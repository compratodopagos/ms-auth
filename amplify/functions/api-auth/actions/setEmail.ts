import { Pool } from "mysql2/promise";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export const setEmail = async (
    event: APIGatewayProxyEvent,
    pool: Pool
): Promise<APIGatewayProxyResult> => {
    try {
        // 1. Validar body
        if (!event.body) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Falta el body con el email" }),
            };
        }

        const { email } = JSON.parse(event.body);

        if (!email || typeof email !== "string") {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Email inválido" }),
            };
        }

        // 2. Verificar si el usuario ya existe
        const [rows] = await pool.query(
            "SELECT id FROM users WHERE email = ? LIMIT 1",
            [email]
        );

        if ((rows as any[]).length > 0) {
            return {
                statusCode: 409,
                body: JSON.stringify({ message: "Ya existe un usuario con ese correo" }),
            };
        }

        // 3. Crear el nuevo usuario
        const [result] = await pool.query(
            "INSERT INTO users (email, created_at) VALUES (?, NOW())",
            [email]
        );

        return {
            statusCode: 201,
            body: JSON.stringify({
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