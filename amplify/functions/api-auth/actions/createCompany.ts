import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { Pool } from "mysql2/promise";

export const createCompany = async (
    event: APIGatewayProxyEvent,
    pool: Pool,
    poolCT: Pool,
    user: any
): Promise<APIGatewayProxyResult> => {
    try {
        if(!user){
            return { statusCode: 401, body: JSON.stringify({ message: "Usuario no autenticado" }) };
        }

        const { nit } = JSON.parse(event.body || "{}");
        // 🚀 Procesar datos en la base de datos
        let id:any;
        const [existingCompany]: any = await pool.execute(`SELECT id FROM companies WHERE nit = ? and user_id = ?`, [nit, user.id]);
        if(!existingCompany[0]){
            const [result]:any = await pool.execute(`INSERT INTO companies (nit,user_id) VALUES (?,?)`, [nit,user.id]);
            id = result.insertId;
        }
        return { statusCode: 201, body: JSON.stringify({ message: "Datos guardados", id }) };
    } catch (error) {
        console.error("Error en Lambda:", error);
        return serverErrorResponse(error);
    }
};

const serverErrorResponse = (error: any) => ({
    statusCode: 500,
    body: JSON.stringify({ message: "Error en el servidor", error: error.message || error }),
});
