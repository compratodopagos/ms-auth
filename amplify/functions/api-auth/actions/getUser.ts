import { Pool } from "mysql2/promise";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import AWS from 'aws-sdk';
const s3 = new AWS.S3();

export const getUser = async (
    event: APIGatewayProxyEvent,
    pool: Pool,
    poolCT: Pool,
    user: any
): Promise<APIGatewayProxyResult> => {
    try {
        if (!user) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Usuario no encontrado" }),
            };
        }

        // Buscar documentos del usuario prospecto
        const Bucket = process.env.IDENTITY_DRIVE_BUCKET_NAME;
        let [documents]: any = await poolCT.query('SELECT document_side as type, url FROM user_documents WHERE user_id = ?', [user.id]);

        const mapDocuments = async (documents: any[]) => {
            return Promise.all(documents.map(async (document: any) => {
                const keyStartIndex = document.url.indexOf("/", 8) + 1; // 8 para saltar "https://"
                const Key = document.url.substring(keyStartIndex);

                document.publicUrl = await s3.getSignedUrlPromise("getObject", {
                    Bucket,
                    Key,
                    Expires: 3600
                });

                return document;
            }));
        };

        return {
            statusCode: 200,
            body: JSON.stringify({
                user_data: {
                    email: user.email,
                    type_account: user.type_account,
                    terms: user.accepted_terms == 1,
                    documents: await mapDocuments(documents)
                },
            }),
        };
    } catch (error) {
        console.error("Error en Lambda getEmailData:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Error en el servidor",
                error: error instanceof Error ? error.message : String(error),
            }),
        };
    }
};