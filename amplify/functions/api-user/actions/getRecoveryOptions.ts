import { Pool } from 'mysql2/promise';

export const getRecoveryOptions = async (event: any, pool: Pool) => {
    try {

        const { number } = JSON.parse(event.body || '{}');
        if (!number) {
            return { statusCode: 400, body: JSON.stringify({ message: "Número de documento es requerido" }) };
        }

        const connection = await pool.getConnection();
        const [rows]: any = await connection.execute(
            `SELECT email, phone_number, id FROM users WHERE document_number = ?`,
            [number]
        );

        if (rows.length === 0) {
            return { statusCode: 404, body: JSON.stringify({ message: "Número de documento inválido" }) };
        }

        const user = rows[0];

        const maskedEmail = maskEmail(user.email);
        user.email = maskedEmail;

        const maskedPhone = user.phone_number ? user.phone_number.replace(/.(?=.{4})/g, '*') : null;
        user.phone_number = maskedPhone;

        const { email, phone_number, id } = user;

        return {
            statusCode: 200,
            body: JSON.stringify({ email, phone_number, id })
        };

    } catch (error) {
        console.error("Error en getRecoveryOptions:", error);
        throw error;
    }
}

function maskEmail(email: string): string {
    const [user, domain] = email.split("@");
    const visible = user.slice(0, 2); // Mostrar solo los primeros 2 caracteres del usuario
    const masked = "*".repeat(user.length - 2);
    return `${visible}${masked}@${domain}`;
}