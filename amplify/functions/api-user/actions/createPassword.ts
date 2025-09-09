import { Pool } from 'mysql2/promise';
import { generateToken, validateUser } from '../../resources/token';
import { encryptString } from '../../resources/encrypt';

export const createPassword = async (event: any, pool: Pool) => {
    try {

        let { user, error } = await validateUser(event, pool);

        const { password, passwordConfirm, type, id, code } = JSON.parse(event.body || "{}");
        
        if (error && (!type || type !== "recovery")) {
            console.error("Error de autenticación:", error);
            return { statusCode: 401, body: JSON.stringify({ message: "Error en la session", error }) };
        }

        if(type == "recovery"){
            const [users] = await pool.query(`SELECT * FROM users WHERE id = ${id}`);
            user = (users as any[])[0];

            if(!code || code !== user.phone_number_code){
                return { statusCode: 400, body: JSON.stringify({ error: "El código es incorrecto o ha expirado" }) };
            }
        }

        if (!password || typeof password !== 'string') {
            console.log({ errors: { password: "El campo es obligatorio y debe ser un string" } })
            return { statusCode: 422, body: JSON.stringify({ errors: { password: "El campo es obligatorio y debe ser un string" } }) };
        }
        if (!passwordConfirm || typeof passwordConfirm !== 'string') {
            console.log({ errors: { passwordConfirm: "El campo es obligatorio y debe ser un string" } })
            return { statusCode: 422, body: JSON.stringify({ errors: { passwordConfirm: "El campo es obligatorio y debe ser un string" } }) };
        }
        if (password !== passwordConfirm) {
            console.log({ errors: { matchPasswords: "Las contraseñas no coinciden" } })
            return { statusCode: 422, body: JSON.stringify({ errors: { matchPasswords: "Las contraseñas no coinciden" } }) };
        }

        // Buscar el usuario prospecto
        const [users] = await pool.query('SELECT id FROM users WHERE id = ?', [user.id]);

        if ((users as any[]).length === 0) {
            return { statusCode: 400, body: JSON.stringify({ error: "El usuario no existe" }) };
        }

        let passwordEncrypted = await encryptString(password, 10);
        await pool.query('UPDATE users SET type_user = "user", status = "registered", password = ? WHERE id = ?', [passwordEncrypted, user.id]);

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Contraseña guardada con éxito!"
            })
        };
    } catch (error) {
        console.error("Error en Lambda:", error);
        return { statusCode: 500, body: JSON.stringify({ message: "Error en el servidor", error }) };
    }
};
