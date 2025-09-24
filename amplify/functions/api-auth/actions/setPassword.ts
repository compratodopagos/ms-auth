import { Pool } from "mysql2/promise";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import bcrypt from "bcryptjs";

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
        let hashed = await bcrypt.hash(password, 10);
        hashed = hashed.replace(/^\$2b\$/, "$2y$");

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

        const loginData = await response.json();

        return {
            statusCode: 200,
            body: JSON.stringify(loginData),
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