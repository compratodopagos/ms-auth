import { compareString } from "../../resources/encrypt";
import { generateToken } from "../../resources/token";

export const login = async (event: any, pool: any) => {
    try {

        const { email, password, recaptcha } = JSON.parse(event.body || "{}");

        const connection = await pool.getConnection();
        const [existingProspect] = await connection.execute(`SELECT id, password, failed_attempts FROM users WHERE email = ?`, [email]);
        if (!existingProspect[0]?.password) {
            return {
                statusCode: 401,
                body: JSON.stringify({ error: "Correo o contraseña incorrectos", message: "Correo o contraseña incorrectos" })
            };
        }
        const validPassword = await compareString(password, existingProspect[0].password);

        if(existingProspect[0].failed_attempts >= 5){
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Demasiados intentos fallidos, cuenta bloqueada" })
            };
        }

        if(existingProspect[0].failed_attempts >= 3){
            if (!recaptcha) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({ error: "Captcha requerido", requiresCaptcha: true })
                };
            }
            const captchaResponse = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: `secret=${process.env.RECAPTCHA_SECRET}&response=${recaptcha}`
            });
            const captchaData = await captchaResponse.json();
            if (!captchaData.success) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({ error: "Captcha inválido", requiresCaptcha: true })
                };
            }
        }

        if (!existingProspect[0] || !validPassword) {
            // Incrementar el contador de intentos fallidos
            const failedAttempts = existingProspect[0].failed_attempts + 1 || 1;
            await pool.query('UPDATE users SET failed_attempts = ? WHERE id = ?', [failedAttempts, existingProspect[0].id]);
            return {
                statusCode: 401,
                body: JSON.stringify({ error: "Correo o contraseña incorrectos", message: "Correo o contraseña incorrectos" })
            };
        }
        connection.release();

        const [existingBasicData] = await connection.execute(`SELECT * FROM basic_data WHERE user_id = ?`, [existingProspect[0].id]);
        let register = false;
        const basic_data: any = existingBasicData[0];
        if (!basic_data) {
            register = true;
        } else if (!basic_data.country) {
            register = true;
        } else if (!basic_data.ocupation) {
            register = true;
        } else if (!basic_data.income_statement && `${basic_data.income_statement}` !== "0") {
            register = true;
        } else if (!basic_data.PEP && `${basic_data.PEP}` !== "0") {
            register = true;
        } else if (!basic_data.tyc && `${basic_data.tyc}` !== "0") {
            register = true;
        }

        const token = generateToken(existingProspect[0].id);
        await pool.query('UPDATE users SET failed_attempts = ? WHERE id = ?', [0, existingProspect[0].id]);

        return {
            statusCode: 201,
            headers: {
                "Set-Cookie": `auth_token=${token}; Path=/; Max-Age=1800; Secure; HttpOnly; SameSite=None`
            },
            body: JSON.stringify({ message: "Usuario logueado con éxito", register })
        };
    } catch (error) {
        console.error("Error en Lambda:", error);
        throw error;
    }
}