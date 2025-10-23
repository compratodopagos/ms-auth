import { Pool } from "mysql2/promise";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { callApi } from "../../resources/apiCT";

const validCode = async (event: APIGatewayProxyEvent, code: string) => {
    const { success, message } = await callApi(
        event,
        "/public/auth/verified-phone/code",
        "POST",
        { code }
    );

    if (!success) {
        console.error("Fallo al validar código:", message);
        return {
            success: false,
            details: message
        }
    }

    return { success };
}

export const phoneValid = async (event: APIGatewayProxyEvent, pool: Pool, poolCT: Pool, user:any): Promise<APIGatewayProxyResult> => {
    const { code } = JSON.parse(event.body || '{}');
    try {

        if (!code || isNaN(parseInt(code))) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Número ó código inválido" }),
            };
        }

        if(!user){
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Usuario no encontrado" }),
            };
        }

        const { success, details } = await validCode(event, code);
        if (!success) {
            return {
                statusCode: 409,
                body: JSON.stringify({
                    error: "Error al validar el código de verificación",
                    details
                }),
            }
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                success: true
            }),
        };
    } catch (error) {
        console.error("Error en Lambda:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: "Error en el servidor",
                code,
                message: error instanceof Error ? error.message : String(error),
            }),
        };
    }
};