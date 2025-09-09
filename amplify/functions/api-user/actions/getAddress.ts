import { APIGatewayProxyEvent } from "aws-lambda";
import { Pool } from 'mysql2/promise';

export const getAddress = async (event:APIGatewayProxyEvent, pool:Pool, user:any) => {
    try {
        if(!user){
            return { statusCode: 401, body: JSON.stringify({ message: "Usuario no autenticado" }) };
        }
        const connection = await pool.getConnection();
        const queryString = `SELECT department, city, type_road, name_road, number, details, postal_code FROM address WHERE user_id = ?`;
        const [addressExists]:any = await connection.execute(queryString, [user?.id]);
        connection.release();
        return {
            statusCode: 200,
            body: JSON.stringify({
                address: addressExists[0]
            })
        };
    } catch (error) {
        console.error("Error en Lambda:", error);
        return { statusCode: 500, body: JSON.stringify({ message: "Error en el servidor", error }) };
    }
}