import { Pool } from "mysql2/promise";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { callApi } from "../../resources/apiCT";

const validCode = async (event: APIGatewayProxyEvent, email: string, code: string) => {
    const response = await callApi(
        event,
        "/auth/verify/email/check",
        "POST",
        { email, code }
    );

    if (!response.ok) {
        const text = await response.json();
        console.error("Fallo al validar código:", text);
        return text
    }

    return {
        success: true
    };
}

export const emailValid = async (event: APIGatewayProxyEvent, pool: Pool, poolCT: Pool): Promise<APIGatewayProxyResult> => {
    try {
        const { email, code } = JSON.parse(event.body || '{}');

        if (!email || !code || typeof email !== "string") {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Email ó código inválido" }),
            };
        }

        let emailDecoded = atob(email);

        const { success, message } = await validCode(event, emailDecoded, code);
        if (!success) {
            return {
                statusCode: 409,
                body: JSON.stringify({
                    error: "Error al validar el código de verificación",
                    message
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
                message: "Error en el servidor",
                error: error instanceof Error ? error.message : String(error),
            }),
        };
    }
};