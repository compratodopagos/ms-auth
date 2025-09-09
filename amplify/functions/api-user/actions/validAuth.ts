import { APIGatewayProxyEvent } from "aws-lambda";
import { Pool } from 'mysql2/promise';

export const validAuth = async (event:APIGatewayProxyEvent, pool:Pool, user:any) => {
    try {
        if(!user){
            return { statusCode: 401, body: JSON.stringify({ message: "Usuario no autenticado" }) };
        }
        const connection = await pool.getConnection();
        const [basicDataExists]:any = await connection.execute(`SELECT country, ocupation, income_statement, PEP, tyc FROM basic_data WHERE user_id = ?`, [user?.id]);
        const record = basicDataExists[0];
        const validPEP = record?.PEP === 0? '0' : record?.PEP === 1? '1' : null;
        const validTYC = `${record?.tyc || 'NULL'}` !== 'NULL';
        const validIncomeStatement = `${record?.income_statement || 'NULL'}` !== 'NULL';
        if(!record || !record?.country || !record?.ocupation || !validIncomeStatement || !validPEP || !validTYC){
            return {
                statusCode: 200,
                body: JSON.stringify({
                    success: false,
                    user
                })
            };
        }
        connection.release();
        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true
            })
        };
    } catch (error) {
        console.error("Error en Lambda:", error);
        throw error;
    }
}