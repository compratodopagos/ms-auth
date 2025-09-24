import { Pool } from "mysql2/promise";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

const sendCode = async (email: string) => {
    const API_URL = process.env.API_URL;
    const response = await fetch(
        `${API_URL}/public/auth/verify/email/send`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        }
    );

    if (!response.ok) {
        const text = await response.text();
        console.error("Fallo al enviar código:", text);
        return {
            success: false,
            details: text
        }
    }

    return {
        success: true
    };
}

export const setEmail = async (event: APIGatewayProxyEvent, pool: Pool, poolCT: Pool): Promise<APIGatewayProxyResult> => {
    try {
        const { email } = JSON.parse(event.body || '{}');

        if (!email || typeof email !== "string") {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Email inválido" }),
            };
        }

        const emailDecoded = Buffer.from(email, "base64").toString("utf-8");

        // 2. Verificar si el usuario ya existe
        const [rows] = await poolCT.query(
            "SELECT id FROM users WHERE email = ? LIMIT 1",
            [emailDecoded]
        );

        const users = (rows as any[]);
        if (users.length > 0) {
            const user = users[0];
            if (user.password) {
                return {
                    statusCode: 409,
                    body: JSON.stringify({ message: "Ya existe un usuario con ese correo" }),
                };
            } else {
                try {
                    const { success, details } = await sendCode(emailDecoded);
                    if (success) {
                        return {
                            statusCode: 200,
                            body: JSON.stringify({
                                success: true,
                                message: "El usuario ya existe. Código de verificación enviado.",
                            }),
                        };
                    } else {
                        return {
                            statusCode: 409,
                            body: JSON.stringify({
                                error: "Error al enviar el código de verificación",
                                details
                            }),
                        };
                    }
                } catch (error: any) {
                    console.log('Error al enviar codigo de verificacion:', error)
                    return {
                        statusCode: 409,
                        body: JSON.stringify({
                            error: "Error al enviar el código de verificación",
                            details: error
                        }),
                    };
                }
            }
        }

        // 3. Crear el nuevo usuario
        const [result] = await poolCT.query(
            "INSERT INTO users (name, email, created_at) VALUES ('prospect',?, NOW())",
            [emailDecoded]
        );
        const { success, details } = await sendCode(emailDecoded);
        if (!success) {
            return {
                statusCode: 409,
                body: JSON.stringify({
                    error: "Error al enviar el código de verificación",
                    details
                }),
            };
        }

        return {
            statusCode: 201,
            body: JSON.stringify({
                success: true,
                message: "Usuario creado correctamente",
                userId: (result as any).insertId,
            }),
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