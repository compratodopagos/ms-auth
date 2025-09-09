import { RekognitionClient, CreateFaceLivenessSessionCommand } from "@aws-sdk/client-rekognition"; 
import { APIGatewayProxyResult } from 'aws-lambda';
import { validateUser } from "../../resources/token";
import { Pool } from "mysql2/promise";

const rekognitionClient = new RekognitionClient({ region: "us-east-1" });

export async function createLivenessSession(event:any, pool: Pool, user:any): Promise<APIGatewayProxyResult> {
    try {
        console.log('inicia peticion de creación');

        if(!user){
            return { statusCode: 401, body: JSON.stringify({ message: "Usuario no autenticado" }) };
        }
        
        const bucketName = process.env.IDENTITY_DRIVE_BUCKET_NAME; // Tomará el nombre del bucket creado en Amplify

        if (!bucketName) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: "El bucket no está definido en las variables de entorno." }),
            };
        }

        console.log("Bucket de salida:", bucketName);
        const params = {
            ClientRequestToken: `session-${Date.now()}`,
            Settings: {
                OutputConfig: {
                    S3Bucket: bucketName,
                    S3KeyPrefix: "rekognition-liveness/",
                },
            }
        };
        console.log('Parameters:',params);
        console.log("Configuración de Rekognition Client:", rekognitionClient.config);

        const command = new CreateFaceLivenessSessionCommand(params);
        console.log('Comando:',command)
        
        // Desde aqui falla pero no muestra error
        const response = await rekognitionClient.send(command);
        console.log('Respuesta:',response)
    
        return {
            statusCode: 200,
            body: JSON.stringify({ sessionId: response.SessionId }),
        };
    } catch (error:any) {
        console.log('fallo',error)
        return {
            statusCode: 400,
            body: JSON.stringify({ error })
        };
    }
}