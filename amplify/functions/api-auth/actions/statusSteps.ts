import { Pool } from "mysql2/promise";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import AWS from 'aws-sdk';
const s3 = new AWS.S3();

export const statusSteps = async (
    event: APIGatewayProxyEvent,
    pool: Pool,
    poolCT: Pool,
    user: any
): Promise<APIGatewayProxyResult> => {
    try {
        const stepsStatus: any = {};
        if (!user) {
            const { e } = event.queryStringParameters || {};
            if (!e) {
                return {
                    statusCode: 200,
                    body: JSON.stringify({ stepsStatus }),
                };
            }
            const emailDecoded = Buffer.from(e, "base64").toString("utf-8");
            const [rows]: any = await poolCT.query(
                "SELECT * FROM users WHERE email = ? LIMIT 1",
                [emailDecoded]
            );
            if (!rows.length) {
                return {
                    statusCode: 200,
                    body: JSON.stringify({ stepsStatus }),
                };
            }
            user = rows[0];
        }

        stepsStatus.email = !!user.email_verified_at;
        stepsStatus.password = !!user.password;
        stepsStatus.phone = !!user.phone_verified_at;
        stepsStatus.docs = {};

        const Bucket = process.env.IDENTITY_DRIVE_BUCKET_NAME;
        const [documents]: any = await poolCT.query(
            'SELECT document_side as type, url, verified_at FROM user_documents WHERE user_id = ?',
            [user.id]
        );

        let docs:any = {};

        await Promise.all(
            documents.map(async (doc: any) => {
                const keyStartIndex = doc.url.indexOf("/", 8) + 1; // saltar https://
                const Key = doc.url.substring(keyStartIndex);

                docs[doc.type] = await s3.getSignedUrlPromise("getObject", {
                    Bucket,
                    Key,
                    Expires: 3600
                });
                if(doc.type == 'front' && doc.verified_at){
                    docs.verified = true;
                }
            })
        );

        return {
            statusCode: 200,
            body: JSON.stringify({ stepsStatus, type_account: user.type_account, docs }),
        };

    } catch (error) {
        console.error("Error en Lambda:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Error en el servidor",
                error: error instanceof Error ? error.message : String(error),
            }),
        };
    }
};