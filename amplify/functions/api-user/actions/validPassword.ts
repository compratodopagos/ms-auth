import { Pool } from 'mysql2/promise';
import { validateUser } from '../../resources/token';

export const validPassword = async (event: any, pool: Pool) => {
    try {

        let { user, error } = await validateUser(event, pool);

        const { password, id, type } = JSON.parse(event.body || "{}");

        if (error && (!type || type !== "recovery")) {
            console.error("Error de autenticación:", error);
            return { statusCode: 401, body: JSON.stringify({ message: "Error en la session", error }) };
        }

        if (!password || typeof password !== 'string') {
            console.log({ errors: { password: "El campo es obligatorio y debe ser un string" } })
            return { statusCode: 422, body: JSON.stringify({ errors: { password: "El campo es obligatorio y debe ser un string" } }) };
        }

        // Buscar el usuario
        if (type == "recovery") {
            const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
            if ((users as any[]).length === 0) {
                return { statusCode: 400, body: JSON.stringify({ error: "El usuario no existe" }) };
            }
            user = (users as any[])[0];
        }

        // No permitir datos personales
        const forbiddenWords = [
            {
                data: [user.name, user.lastname], errorName: 'containsNameOrLastname'
            },
            {
                data: [user.document_number], errorName: 'containsDocumentOrDate'
            },
            {
                data: [user.email, user.phone_number], errorName: 'containsEmailOrPhone'
            }
        ];

        const errors: any = {};

        for (const validation of forbiddenWords) {
            for (const word of validation.data) {
                if (word) {
                    let arrayWord = word.split(' ');
                    for (const wordSplit of arrayWord) {
                        if (password.toLowerCase().includes(wordSplit.toLowerCase())) {
                            errors[validation.errorName] = true;
                        }
                    }
                }
            }
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: "Validado con éxito!",
                errors: Object.keys(errors).length > 0 ? errors : null
            })
        };
    } catch (error) {
        console.error("Error en Lambda:", error);
        return { statusCode: 500, body: JSON.stringify({ message: "Error en el servidor", error }) };
    }
};
