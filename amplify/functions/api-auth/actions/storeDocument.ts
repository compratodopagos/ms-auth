import AWS from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Pool } from 'mysql2/promise';

const s3 = new AWS.S3();
const MAX_FILE_SIZE_MB = 50;
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];

export const storeDocument = async (
    event: APIGatewayProxyEvent,
    pool: Pool,
    poolCT: Pool,
    user: any
): Promise<APIGatewayProxyResult> => {
    try {
        if(!user){
            return { statusCode: 401, body: JSON.stringify({ message: "Usuario no autenticado" }) };
        }

        const bucketName = process.env.IDENTITY_DRIVE_BUCKET_NAME; // Tomará el nombre del bucket creado en Amplify

        if (!bucketName) {
            throw new Error("El bucket no está definido en las variables de entorno.");
        }

        const body = JSON.parse(event.body || '{}');
        const { documentType, mimeType, file } = body;

        if (!documentType || !mimeType || !file) {
            console.log('Faltan parametros');
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Missing required fields.', message: 'Missing required fields.' })
            };
        }

        // Validate mime type
        if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
            return { statusCode: 400, body: JSON.stringify({ message: 'Invalid file type. Only JPEG and PNG are allowed.' }) };
        }

        // Validate file size
        const buffer = Buffer.from(file.split(',')[1], 'base64');
        const fileSizeMB = buffer.length / (1024 * 1024);
        if (fileSizeMB > MAX_FILE_SIZE_MB) {
            return { statusCode: 400, body: JSON.stringify({ message: 'File size exceeds 50MB limit.' }) };
        }

        const [company]:any = await pool.query(`SELECT id from companies where user_id = ?`,[user.id]);
        if (company.length === 0) {
            throw new Error("La empresa no existe.");
        }

        let power = documentType == 'power_of_attorney'? 'power_':'';
        const s3Key = `documents/companies/${company[0].id}/${Date.now()}_${power+company[0].nit}`;

        // Upload to S3
        const uploadResult = await s3.upload({
            Bucket: bucketName,
            Key: s3Key,
            Body: buffer,
            ContentType: mimeType
        }).promise();
        const s3Url = uploadResult.Location;
        const imageKey = s3Url.split('.com/')[1];

        let inputs = `${documentType} = ?`;
        if(documentType == 'power_of_attorney'){
            inputs += `, is_attorney = 1`
        }

        await pool.execute(`UPDATE companies SET ${inputs} WHERE id = ?`, [imageKey, company[0].id]);

        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                message: 'Document uploaded successfully.',
            })
        };
    } catch (error: any) {
        console.error('Error uploading document:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error', error: error.message })
        };
    }
};
