import { Pool } from "mysql2/promise";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export const setOcupation = async (
    event: APIGatewayProxyEvent,
    pool: Pool,
    poolCT: Pool,
    user: any
): Promise<APIGatewayProxyResult> => {
    try {
        const { ocupation } = JSON.parse(event.body || '{}');

        if (!user) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Usuario no encontrado" }),
            };
        }

        const [basicDataExists]: any = await pool.query(`SELECT id, ocupation FROM basic_data WHERE user_id = ?`, [user.id]);

        if (basicDataExists[0]) {
            const [result] = await pool.query(
                "UPDATE basic_data SET ocupation = ? WHERE id = ?",
                [ocupation, basicDataExists[0].id]
            );
            if ((result as any).affectedRows === 0) {
                return {
                    statusCode: 404,
                    body: JSON.stringify({ message: "Usuario no modificado" }),
                };
            }
        } else {
            const [result] = await pool.query(
                "INSERT INTO basic_data (ocupation, user_id) VALUES (?, ?)",
                [ocupation, user.id]
            );
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                message: "Ocupación actualizada correctamente"
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