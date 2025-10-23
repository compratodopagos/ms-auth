import { Pool } from "mysql2/promise";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { callApi } from "../../resources/apiCT";

const sendCode = async (event: APIGatewayProxyEvent, poolCT:Pool, user:any) => {
    // Generar código de verificación aleatorio de 6 dígitos
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();

    const [updateResult] = await poolCT.query("UPDATE users SET phone_verification_code = ?, updated_at = NOW() WHERE id = ?", [newCode, user.id]);

    if ((updateResult as any).affectedRows === 0) {
        return {
            statusCode: 404,
            body: JSON.stringify({ message: "Usuario no modificado" }),
        };
    }

    // REVISAR
    const { success, message } = await callApi(
        event,
        "/public/notification/internal/notifications/sms",
        "POST",
        { phone: user.phone, message: `Tu codigo de verificacion para comprapagos es: ${newCode} Recuerda no compartirlo` },
        'notification-service-internal-token-2024-super-secret-key-microservices'
    );

    if (!success) {
        console.error("Fallo al enviar código:", message);
        return {
            success: false,
            details: message
        }
    }

    return { success };
}

export const setPhone = async (event: APIGatewayProxyEvent, pool: Pool, poolCT: Pool, user: any): Promise<APIGatewayProxyResult> => {
    try {
        const { phone } = JSON.parse(event.body || '{}');

        if ((!phone || typeof phone !== "string") && !user.phone) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Número inválido" }),
            };
        }

        if (!user) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Usuario no encontrado" }),
            };
        }
        // Guardar contraseña
        if (phone) {
            const [result] = await poolCT.query(
                "UPDATE users SET phone = ?, updated_at = NOW() WHERE id = ?",
                [phone, user.id]
            );

            if ((result as any).affectedRows === 0) {
                return {
                    statusCode: 404,
                    body: JSON.stringify({ message: "Usuario no modificado" }),
                };
            }
            user.phone = phone;
        }

        const { success, details } = await sendCode(event, poolCT, user);
        if (success) {
            return {
                statusCode: 200,
                body: JSON.stringify({
                    success: true,
                    message: "Código de verificación enviado.",
                }),
            };
        } else {
            return {
                statusCode: 409,
                body: JSON.stringify({
                    error: "Error al enviar el código de verificación",
                    details
                }),
            };
        }
    } catch (error: any) {
        console.log('Error al enviar codigo de verificacion:', error)
        return {
            statusCode: 409,
            body: JSON.stringify({
                error: "Error al enviar el código de verificación",
                details: error
            }),
        };
    }
};