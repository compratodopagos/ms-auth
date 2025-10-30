import { Pool } from "mysql2/promise";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export const setCountry = async (
    event: APIGatewayProxyEvent,
    pool: Pool,
    poolCT: Pool,
    user: any
): Promise<APIGatewayProxyResult> => {
    try {
        const { country } = JSON.parse(event.body || '{}');

        if (!user) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Usuario no encontrado" }),
            };
        }

        const [basicDataExists]: any = await pool.query(`SELECT country, ocupation, income_statement, PEP, tyc FROM basic_data WHERE user_id = ?`, [user.id]);

        if (basicDataExists[0]) {
            const [result] = await poolCT.query(
                "UPDATE basic_data SET country = ? WHERE id = ?",
                [country, basicDataExists[0].id]
            );
            if ((result as any).affectedRows === 0) {
                return {
                    statusCode: 404,
                    body: JSON.stringify({ message: "Usuario no modificado" }),
                };
            }
        } else {
            const [result] = await poolCT.query(
                "INSERT INTO basic_data (country, user_id) VALUES (?, ?)",
                [country, user.id]
            );
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                message: "País actualizado correctamente"
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