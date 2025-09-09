import { Pool } from 'mysql2/promise';
import { getTwilioClient, numbers } from '../../resources/twilioServie';
import { validateUser } from '../../resources/token';
import { mailSend } from '../../resources/mailService';

export const sendCode = async (event: any, pool: Pool) => {
    try {

        let { user, error } = await validateUser(event, pool);

        const { method, type, id } = JSON.parse(event.body || "{}");

        if (error && (!type || type !== "recovery")) {
            console.error("Error de autenticación:", error);
            return { statusCode: 401, body: JSON.stringify({ message: "Error en la session", error }) };
        }

        if(type == "recovery"){
            const [users] = await pool.query(`SELECT * FROM users WHERE id = ${id}`);
            user = (users as any[])[0];
        }

        // Inicializar cliente Twilio
        const client:any = await getTwilioClient();

        // Generar código de 6 dígitos
        const code = Math.floor(100000 + Math.random() * 900000);

        // Actualizar el término con el prospect_id
        await pool.query('UPDATE users SET phone_number_code = ? WHERE id = ?', [code, user.id]);

        // Mensaje del código
        const message = `${code} es tu código de verificación en Comprapagos. No lo compartas con nadie.`;
        const { sms, wa } = await numbers();

        if (method === "whatsapp") {
            await client.messages.create({
                from: `whatsapp:${wa}`, // Número de WhatsApp de Twilio
                to: `whatsapp:+57${user.phone_number}`,
                body: message,
            });
        } else if (method === "call") {
            const formatted = `${code}`.split('').slice(0).map(num => num + '.').join(' ');
            const messageCall = `${formatted}, nuevamente ${formatted} es tu código de verificación en Comprapagos. No lo compartas con nadie.`;
            await client.calls.create({
                from: sms, // Número de Twilio
                to: `+57${user.phone_number}`,
                twiml: `<Response><Say>${messageCall}</Say></Response>`,
            });
        } else if (method === "email") {
            await mailSend({
                from: 'Comprapagos',
                to: user.email,
                subject: 'Código de verificación',
                text: `${code} es tu código de verificación en Comprapagos. No lo compartas con nadie.`,
                html: `<p>${code} es tu código de verificación en Comprapagos. No lo compartas con nadie.</p>`,
            });
        } else {
            await client.messages.create({
                from: sms, // Número de Twilio
                to: `+57${user.phone_number}`,
                body: message,
            });
        }

        return { statusCode: 200, body: JSON.stringify({ message: "Código enviado correctamente" }) };
    } catch (error) {
        console.error("Error en Lambda:", error);
        return { statusCode: 500, body: JSON.stringify({ message: "Error en el servidor", error }) };
    }
};
