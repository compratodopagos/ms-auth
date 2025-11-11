import { Pool } from "mysql2/promise";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export const setStatement = async (
    event: APIGatewayProxyEvent,
    pool: Pool,
    poolCT: Pool,
    user: any
): Promise<APIGatewayProxyResult> => {
    try {
        const {
            income_statement,
            pep_position,
            pep_entity,
            pep_relationship
        } = JSON.parse(event.body || '{}');

        if (!user) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Usuario no encontrado" }),
            };
        }

        const [basicDataExists]: any = await pool.query(`SELECT id FROM basic_data WHERE user_id = ?`, [user.id]);

        if (basicDataExists[0]) {
            let strQuery = "UPDATE basic_data SET income_statement = ?, PEP = ?";
            let PEP = 0;
            if(income_statement == 'Si'){
                PEP = 1;
                strQuery += `, pep_position="${pep_position}", pep_entity="${pep_entity}", pep_relationship="${pep_relationship}"`;
            }
            strQuery += " WHERE id = ?";
            const [result] = await pool.query(strQuery, [income_statement, PEP, basicDataExists[0].id]);
            if ((result as any).affectedRows === 0) {
                return {
                    statusCode: 404,
                    body: JSON.stringify({ message: "Usuario no modificado" }),
                };
            }
        } else {
            let columns = "income_statement, PEP, user_id";
            let values = "?, ?";
            let PEP = 0;
            if(income_statement == 'Si'){
                PEP = 1;
                columns += ', pep_position, pep_entity, pep_relationship';
                values += `, "${pep_position}", "${pep_entity}", "${pep_relationship}"`;
            }
            const [result] = await pool.query(
                `INSERT INTO basic_data (${columns}) VALUES (${values})`,
                [income_statement, PEP, user.id]
            );
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true,
                message: "Declaración actualizada correctamente"
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