import { Pool } from "mysql2/promise";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import bcrypt from "bcryptjs";
import { getDefaultHeaders } from "../../resources/getDefaultHeaders";

export const setPassword = async (event: APIGatewayProxyEvent, pool: Pool, poolCT: Pool): Promise<APIGatewayProxyResult> => {
    try {
        const { email, password, confirm_password } = JSON.parse(event.body || "{}");

        if (!email || !password || !confirm_password) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Campos incompletos" }),
            };
        }

        if (password !== confirm_password) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Las contraseñas no coinciden" }),
            };
        }

        const emailDecoded = Buffer.from(email, "base64").toString("utf-8");
        const hashed = await hashPassword(password);

        // Guardar contraseña
        const [result] = await poolCT.query(
            "UPDATE users SET password = ?, updated_at = NOW() WHERE email = ?",
            [hashed, emailDecoded]
        );

        if ((result as any).affectedRows === 0) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: "Usuario no encontrado" }),
            };
        }

        // Hacer login automático contra Laravel API
        const API_URL = process.env.API_URL;
        const response = await fetch(`${API_URL}/public/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: emailDecoded,
                password
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            return {
                statusCode: 401,
                body: JSON.stringify({
                    success: false,
                    message: "Error al iniciar sesión",
                    details: errorText,
                }),
            };
        }

        const { access_token, refresh_token } = await response.json();

        const access_cookie = `access_token=${access_token}; Path=/; ${process.env.stageName == "local"
            ? 'SameSite=None; Secure'
            : 'Domain=.comprapagos.com; Secure; SameSite=Strict; Max-Age=604800'
            }`;
        const refresh_cookie = `refresh_token=${refresh_token}; Path=/; ${process.env.stageName == "local"
            ? 'SameSite=None; Secure'
            : 'Domain=.comprapagos.com; Secure; SameSite=Strict; Max-Age=604800'
            }`;

        return {
            statusCode: 200,
            headers: {
                ...getDefaultHeaders(event.headers.origin)
            },
            multiValueHeaders: {
                'Set-Cookie': [access_cookie, refresh_cookie], // cookies separadas
            },
            body: JSON.stringify({ success: true }),
        };
    } catch (error) {
        console.error("Error en setPassword:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Error en el servidor",
                error: error instanceof Error ? error.message : String(error),
            }),
        };
    }
};

export async function hashPassword(password: string) {
    const hashed = await bcrypt.hash(password, 12);
    return hashed.replace(/^\$2[abxy]\$/, "$2y$");
}