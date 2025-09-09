import { Pool } from 'mysql2/promise';
import { validateUser } from '../../resources/token';

export const verifyCode = async (event: any, pool: Pool) => {
    try {
        let { user, error } = await validateUser(event, pool);

        const { code, type, id } = JSON.parse(event.body || "{}");

        if (error && (!type || type !== "recovery")) {
            console.error("Error de autenticación:", error);
            return { statusCode: 401, body: JSON.stringify({ message: "Error en la session", error }) };
        }

        if (!code) {
            return { statusCode: 422, body: JSON.stringify({ errors: { code: "El código es obligatorio y debe ser un número" } }) };
        }

        if(type == "recovery"){
            const [users] = await pool.query(`SELECT * FROM users WHERE id = ${id}`);
            user = (users as any[])[0];
            if (user.phone_number_code && user.phone_number_code == code) {
                return { statusCode: 200, body: JSON.stringify({ message: "Código verificado con éxito" }) };
            }
        }

        if (user.phone_number_code && user.phone_number_code == code) {

            // Marcar teléfono como verificado en la base de datos
            let column = (type == "email") ? "email_verified_at" : "phone_number_verified_at";
            await pool.query(`UPDATE users SET phone_number_code = NULL, ${column} = NOW() WHERE id = ?`, [user.id]);

            return { statusCode: 200, body: JSON.stringify({ message: "Código verificado con éxito" }) };
        }

        return { 
            statusCode: 400, 
            body: JSON.stringify({ error: "El código es incorrecto o ha expirado" }) 
        };

    } catch (error) {
        console.error("Error en verifyCode:", error);
        return { statusCode: 500, body: JSON.stringify({ message: "Error en el servidor", error }) };
    }
};
