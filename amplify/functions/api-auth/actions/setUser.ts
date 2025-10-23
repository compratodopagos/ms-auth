import { Pool } from "mysql2/promise";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { callApi } from "../../resources/apiCT";

export const setUser = async (
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

        const { type_account } = JSON.parse(event.body || '{}');

        // Guardar contraseña
        const [result] = await poolCT.query(
            "UPDATE users SET type_account = ?, updated_at = NOW() WHERE id = ?",
            [type_account, user.id]
        );

        if ((result as any).affectedRows === 0) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: "Usuario no encontrado" }),
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true })
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
}