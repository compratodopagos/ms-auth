import { APIGatewayProxyEvent } from "aws-lambda";
import { Pool } from 'mysql2/promise';

export const updateBasicData = async (event: APIGatewayProxyEvent, pool: Pool, user: any) => {
    try {
        const connection = await pool.getConnection();
        if (!user) {
            return { statusCode: 401, body: JSON.stringify({ message: "Usuario no autenticado" }) };
        }

        let { country, ocupation, income_statement, pep, phone_number, tyc } = JSON.parse(event.body || `{}`);
        if(country){
            return await updateData(connection, 'country', country, user);
        } else if(ocupation){
            return await updateData(connection, 'ocupation', ocupation, user);
        } else if(income_statement){
            await updateData(connection, 'income_statement', income_statement, user);
            return await updateData(connection, 'PEP', pep, user);
        } else if(phone_number){
            return await updateData(connection, 'phone_number', phone_number, user);
        } else if(tyc){
            return await updateData(connection, 'tyc', tyc, user);
        }

        return {
            statusCode: 400,
            body: JSON.stringify({
                message: 'Sin Datos'
            })
        };

    } catch (error) {
        console.error("Error en Lambda:", error);
        return { statusCode: 500, body: JSON.stringify({ message: "Error en el servidor", error }) };
    }
}

const updateData = async (connection:any, input:string, value:string, user:any) => {
    const [addressExists]: any = await connection.execute(`SELECT id FROM basic_data WHERE user_id = ?`, [user?.id]);
    if (addressExists.length === 0) {
        // 📌 Insertar nuevo prospecto
        await connection.execute(
            `INSERT INTO basic_data (user_id, ${input}) VALUES (?, ?)`,
            [user.id, value]
        );
    } else {
        await connection.execute(
            `UPDATE basic_data SET ${input} = ? WHERE id = ?`,
            [value, addressExists[0].id]
        );
    }
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'Datos modificados'
        })
    };
}