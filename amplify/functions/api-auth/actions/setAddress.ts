import { Pool } from "mysql2/promise";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export const setAddress = async (
    event: APIGatewayProxyEvent,
    pool: Pool,
    poolCT: Pool,
    user: any
): Promise<APIGatewayProxyResult> => {
    try {
        if(!user){
            return { statusCode: 401, body: JSON.stringify({ message: "Usuario no autenticado" }) };
        }

        let { department, city, type_road, name_road, number, details, postal_code } = JSON.parse(event.body || `{}`);
        
        const [addressExists]:any = await pool.execute(`SELECT id FROM address WHERE user_id = ?`, [user?.id]);
        if (addressExists.length === 0) {
            // 📌 Insertar nuevo prospecto
            await pool.execute(
                `INSERT INTO address (user_id, department, city, type_road, name_road, number, details, postal_code)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [user.id, department, city, type_road, name_road, number, details, postal_code]
            );
        } else {
            await pool.execute(
                `UPDATE address
                SET department = ?, city = ?, type_road = ?, name_road = ?, number = ?, details = ?, postal_code = ?
                WHERE id = ?`,
                [department, city, type_road, name_road, number, details, postal_code, addressExists[0].id]
            );
        }
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Dirección añadida',
                success: true
            })
        };
    } catch (error) {
        console.error("Error en Lambda:", error);
        return { statusCode: 500, body: JSON.stringify({ message: "Error en el servidor", error }) };
    }
}