import * as AWS from 'aws-sdk';
import { Pool } from 'mysql2/promise';

const s3 = new AWS.S3();

export const getListUser = async (event: any, pool: Pool, user: any) => {
    try {
        if (!user) {
            return { statusCode: 401, body: JSON.stringify({ message: "Usuario no autenticado" }) };
        }

        const { type } = event.queryStringParameters || {};
        const values: any[] = [];

        let query = 'SELECT * FROM users WHERE type_user = ?';
        values.push('user');

        if (type) {
            query += ' AND status = ?';
            values.push(type);
        }

        const [rows] = await pool.query(query, values);

        const list = await Promise.all((rows as any[]).map(async (user: any) => {
            // Documentos del usuario
            const [documents] = await pool.query('SELECT * FROM user_documents WHERE user_id = ?', [user.id]);
            user.documents = documents;

            const bucketName = process.env.IDENTITY_DRIVE_BUCKET_NAME; // Tomará el nombre del bucket creado en Amplify
            const signedUrlExpireSeconds = 180; // 3 minutos

            user.documents.forEach((doc:any) => {
                const key = doc.url.slice( doc.url.indexOf('aws.com') + 8 );
                doc.url = s3.getSignedUrl('getObject', {
                    Bucket: bucketName!,
                    Key: key,
                    Expires: signedUrlExpireSeconds
                });
            });

            // Eliminar y marcar contraseña
            if (user.password) {
                user.hasPassword = true;
                delete user.password;
            }

            // Limpieza de nulos (solo undefined o null, no 0 o false)
            Object.keys(user).forEach(key => {
                if (user[key] === undefined || user[key] === null) {
                    delete user[key];
                }
            });

            // Datos de la empresa
            const [companyExists]: any = await pool.query('SELECT nit, nit_document FROM companies WHERE user_id = ?', [user.id]);
            if (companyExists[0]) {
                user.company = companyExists[0];
            }

            // Datos básicos del usuario
            const [basicDataExists]: any = await pool.query(`
                SELECT country, ocupation, income_statement, PEP, tyc
                FROM basic_data
                WHERE user_id = ?`, [user.id]);
            if (basicDataExists[0]) {
                user.basic_data = basicDataExists[0];
            }

            // Email enmascarado
            if (user.email) {
                user.email = maskEmail(user.email);
            }

            return user;
        }));

        return {
            statusCode: 200,
            body: JSON.stringify({ list }),
        };

    } catch (error:any) {
        console.error("Error en Lambda:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Error en el servidor", error: error.message }),
        };
    }
};

function maskEmail(email: string): string {
    const [user, domain] = email.split("@");
    if (!user || !domain) return email;

    const visible = user.slice(0, 2);
    const masked = "*".repeat(Math.max(user.length - 2, 1));
    return `${visible}${masked}@${domain}`;
}