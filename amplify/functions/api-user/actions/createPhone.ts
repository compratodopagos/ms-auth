import { Pool } from 'mysql2/promise';
import { validateUser } from '../../resources/token';

export const createPhone = async (event: any, pool: Pool, user:any) => {
    try {
        if(!user){
            return { statusCode: 401, body: JSON.stringify({ message: "Usuario no autenticado" }) };
        }

        const { phone } = JSON.parse(event.body || "{}");

        // Validar los datos recibidos
        if (!phone || typeof phone !== 'string') {
            return { statusCode: 422, body: JSON.stringify({ errors: { phone: "El campo phone es obligatorio y debe ser un string" } }) };
        }

        await pool.query('UPDATE users SET phone_number = ? WHERE id = ?', [phone, user.id]);

        return { statusCode: 201, body: JSON.stringify({ message: "Número guardado con éxito" }) };

    } catch (error) {
        console.error("Error en Lambda:", error);
        return { statusCode: 500, body: JSON.stringify({ message: "Error en el servidor", error }) };
    }
};
