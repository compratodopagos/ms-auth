import { Pool } from "mysql2/promise";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import AWS from 'aws-sdk';
const s3 = new AWS.S3();

export const statusRegulatory = async (
    event: APIGatewayProxyEvent,
    pool: Pool,
    poolCT: Pool,
    user: any
): Promise<APIGatewayProxyResult> => {
    try {
        const stepsStatus: any = {};
        if (!user) {
            return {
                statusCode: 401,
                body: JSON.stringify({ message: 'Token de acceso expirado' }),
            };
        }

        console.log('user',user)

        const queryString = `SELECT department, city, type_road, name_road, number, details, postal_code FROM address WHERE user_id = ?`;
        const [addressExists]:any = await pool.execute(queryString, [user?.id]);
        stepsStatus.residence = addressExists[0];

        const [basicDataExists]:any = await pool.query(`SELECT country, ocupation, income_statement, PEP, tyc FROM basic_data WHERE user_id = ?`, [user.id]);
        const {
            country,
            ocupation,
            income_statement,
            PEP,
            tyc
        } = basicDataExists[0] || {};
        stepsStatus.country = country;
        stepsStatus.ocupation = ocupation;
        stepsStatus.statement = income_statement ? {
            income_statement,
            PEP
        } : undefined;
        stepsStatus.terms = !!PEP || !!tyc;

        return {
            statusCode: 200,
            body: JSON.stringify({ stepsStatus }),
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