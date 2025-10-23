import AWS from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Pool } from 'mysql2/promise';
import { validateDocument } from '../resources/validateDocument';
import { validateFace } from '../resources/validateFace';
import { updateUser } from '../resources/updateUser';

const s3 = new AWS.S3();

export const storeFile = async (
    event: APIGatewayProxyEvent,
    pool: Pool,
    poolCT: Pool,
    user: any
): Promise<APIGatewayProxyResult> => {
    try {

        if(!user){
            return { statusCode: 401, body: JSON.stringify({ message: "Usuario no autenticado" }) };
        }

        if (!event.body) {
            return { statusCode: 400, body: JSON.stringify({ error: 'No data received' }) };
        }

        const bucketName = process.env.IDENTITY_DRIVE_BUCKET_NAME; // Tomará el nombre del bucket creado en Amplify

        if (!bucketName) {
            throw new Error("El bucket no está definido en las variables de entorno.");
        }

        console.log("Bucket de salida:", bucketName);

        const { front, back, ACL } = JSON.parse(event.body);
        if (!front && !back) {
            return { statusCode: 400, body: JSON.stringify({ error: 'Invalid request format' }) };
        }
        let { fileName } = JSON.parse(event.body);
        fileName = sanitizeS3Name(fileName);

        let type = front ? 'front' : 'back';
        let base64Image = front ? front : back;

        // Eliminar el prefijo Base64
        const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');

        // Obtener el tipo de imagen
        const fileType = base64Image.match(/^data:(image\/\w+);base64,/)[1];

        // 1️⃣ Buscar si hay un documento anterior en la base de datos
        const [documents] = await poolCT.query(
            'SELECT id, url FROM user_documents WHERE user_id = ? AND document_side = ?',
            [user.id, type]
        );

        if ((documents as any[]).length > 0) {
            const document = (documents as any[])[0];
            const oldFileUrl = document.url;

            // 2️⃣ Eliminar el archivo anterior de S3 si existe
            if (oldFileUrl) {
                const oldFileKey = oldFileUrl.split('.com/')[1];
                await s3.deleteObject({ Bucket: bucketName, Key: oldFileKey }).promise();
            }
        }

        // 3️⃣ Subir el nuevo archivo a S3
        const uploadParams: AWS.S3.PutObjectRequest = {
            Bucket: bucketName,
            Key: `documents/${user.id}/${fileName}`,
            Body: buffer,
            ContentEncoding: 'base64',
            ContentType: fileType
        };

        const uploadResult = await s3.upload(uploadParams).promise();
        const s3Url = uploadResult.Location;

        // 4️⃣ Validar el documento con Rekognition
        const imageKey = s3Url.split('.com/')[1];
        const { isValid, documentData, documentType } = await validateDocument(bucketName, imageKey);
        console.log('Datos del documento', documentData);
        console.log('Tipo documento', documentType);
        if (!isValid) {
            if (s3Url) {
                const oldFileKey = s3Url.split('.com/')[1];
                await s3.deleteObject({ Bucket: bucketName, Key: oldFileKey }).promise();
            }
            return { statusCode: 400, body: JSON.stringify({ message: 'Documento inválido', s3Url }) };
        }

        const { isValid: hasFace, facialKey } = await validateFace(bucketName, imageKey);
        if (type === 'front' && !hasFace) {
            return { statusCode: 400, body: JSON.stringify({ message: 'Documento sin foto', s3Url }) };
        }

        if (type === 'back' && hasFace){
            return { statusCode: 400, body: JSON.stringify({ message: 'Documento inválido', s3Url }) };
        }

        // Update
        try {
            await updateUser(poolCT, documentData, user);
        } catch (error:any) {
            console.log(error.message);
            if(error.message == 'Ya existe un usuario asociado a este documento de identidad'){
                await s3.deleteObject({ Bucket: bucketName, Key: imageKey }).promise();
                return {
                    statusCode: 400,
                    body: JSON.stringify({
                        message: error.message,
                        error: 'User exists'
                    }),
                };
            }
        }

        // 5️⃣ Insertar o actualizar la base de datos con el nuevo archivo
        let query = `INSERT INTO user_documents (user_id, document_side, url, created_at) VALUES (?, ?, ?, NOW())`;
        if ((documents as any[]).length > 0) {
            query = `UPDATE user_documents SET url = ?, created_at = NOW(), verified_at = NULL, verified_url = NULL WHERE user_id = ? AND document_side = ?`;
            await poolCT.execute(query, [s3Url, user.id, type]);
        } else {
            await poolCT.execute(query, [user.id, type, s3Url]);
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'File uploaded successfully', success: true, s3Url }),
        };

    } catch (error) {
        console.error('Upload error:', error);
        return { statusCode: 500, body: JSON.stringify({ error: 'Upload failed' }) };
    }
};

function sanitizeS3Name(str: string) {
    return str
        .replaceAll(' ', '_')
        .normalize('NFD')                         // Elimina acentos
        .replace(/[\u0300-\u036f]/g, '')          // Borra los caracteres diacríticos
        .replace(/[^a-zA-Z0-9._\-\/]/g, '-')      // Reemplaza lo no permitido por '-'
        .replace(/-+/g, '-')                      // Colapsa guiones múltiples
        .replace(/^[-.]+|[-.]+$/g, '')            // Quita guiones o puntos al inicio/fin
        .toLowerCase();                          // (Opcional) todo minúscula
}