import { RekognitionClient, GetFaceLivenessSessionResultsCommand, CompareFacesCommand } from "@aws-sdk/client-rekognition";
import { APIGatewayProxyResult } from 'aws-lambda';
import { Pool } from 'mysql2/promise';

const rekognitionClient = new RekognitionClient({ region: "us-east-1" });

export async function getLivenessResults(event: any, pool: Pool, user:any): Promise<APIGatewayProxyResult> {
    let sessionID = event.pathParameters?.proxy;
    console.log('aqui comienza')
    if (!sessionID) {
        return { statusCode: 400, body: JSON.stringify({ error: "El sessionID es obligatorio" }) };
    }
    console.log('Pasa validacion de Session')
    
    if(!user){
        return { statusCode: 401, body: JSON.stringify({ message: "Usuario no autenticado" }) };
    }
    console.log('Pasa validacion de user')

    sessionID = sessionID.replace('rekognitionLiveness/', ''); // Limpia ID
    const params = { SessionId: sessionID };
    console.log('params',params);
    const command = new GetFaceLivenessSessionResultsCommand(params);
    const response = await rekognitionClient.send(command);
    const { Status, Confidence, ReferenceImage } = response;
    console.log('response',response)

    if (Status == "SUCCEEDED" && (Confidence && Confidence >= 90)) {

        const bucket = ReferenceImage?.S3Object?.Bucket;
        const referenceImageKey = ReferenceImage?.S3Object?.Name;

        if (!bucket || !referenceImageKey) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "No se encontró la imagen de referencia en la sesión de Rekognition." }),
            };
        }

        // Buscar el documento frontal del usuario
        const [documents] = await pool.query('SELECT id, url, failed_attempts FROM user_documents WHERE document_side = "front" AND user_id = ?', [user.id]);

        if ((documents as any[]).length === 0) {
            return { statusCode: 400, body: JSON.stringify({ error: "El usuario no existe" }) };
        }

        const document = (documents as any[])[0];

        // Extraer el nombre del archivo desde la URL (si es un S3 URL)
        const documentKey = document.url.split('/').pop() || "";

        if (!documentKey) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "No se pudo extraer el nombre del documento frontal." }),
            };
        }

        // Comparar la imagen del documento con la de Rekognition
        const SimilarityThreshold = 85;
        let userDocumentUrl = `documents/${user.id}/${documentKey}`;
        const similarity = await compareImages(userDocumentUrl, referenceImageKey, bucket, SimilarityThreshold);

        if(similarity >= SimilarityThreshold){
            await pool.query('UPDATE user_documents SET verified_at = NOW(), verified_url = ? WHERE id = ?', [
                referenceImageKey,
                document.id
            ]);
        } else {
            let failed_attempts = parseInt(document.failed_attempts || '0');
            failed_attempts++;
            console.log('UPDATE user_documents SET failed_attempts = ?, verified_url = ? WHERE id = ?', [
                failed_attempts,
                referenceImageKey,
                document.id
            ])
            await pool.query('UPDATE user_documents SET failed_attempts = ?, verified_url = ? WHERE id = ?', [
                failed_attempts,
                referenceImageKey,
                document.id
            ]);
            if(failed_attempts >= 3){
                return {
                    statusCode: 200,
                    body: JSON.stringify({
                        confidence: Confidence,
                        similarity,
                        isMatch: true
                    }),
                };
            }
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                confidence: Confidence,
                similarity,
                isMatch: similarity >= SimilarityThreshold,
                status: Status,
            }),
        };

    }

    return {
        statusCode: 200,
        body: JSON.stringify({
            confidence: response.Confidence,
            status: response.Status,
        }),
    };
}

async function compareImages(sourceImage: string, targetImage: string, bucket: string, SimilarityThreshold = 85): Promise<number> {
    console.log('Validando imágenes...');
    console.log({
        SourceImage: { S3Object: { Bucket: bucket, Name: sourceImage } },
        TargetImage: { S3Object: { Bucket: bucket, Name: targetImage } },
        SimilarityThreshold
    });
    const command = new CompareFacesCommand({
        SourceImage: { S3Object: { Bucket: bucket, Name: sourceImage } },
        TargetImage: { S3Object: { Bucket: bucket, Name: targetImage } },
        SimilarityThreshold
    });

    try {
        const response = await rekognitionClient.send(command);
        if (response.FaceMatches && response.FaceMatches.length > 0) {
            console.log("✅ Coincidencia encontrada con:", response.FaceMatches[0].Similarity, "% de similitud.");
            return response.FaceMatches[0].Similarity || 0;
        } else {
            console.log("❌ No se encontraron coincidencias.");
            return 0;
        }
    } catch (error) {
        console.error("Error comparando imágenes:", error);
        throw new Error("Error en la comparación de imágenes.");
    }
}