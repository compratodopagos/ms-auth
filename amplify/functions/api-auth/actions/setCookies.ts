import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { getDefaultHeaders } from "../../resources/getDefaultHeaders";

export const setCookies = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {

        const { token, refreshToken } = JSON.parse(event.body || '{}');

        const access_cookie = `access_token=${token}; Path=/; ${process.env.stageName == "local"
                ? 'SameSite=None; Secure'
                : 'Domain=.comprapagos.com; Secure; SameSite=Strict; Max-Age=604800'
            }`;
        const refresh_cookie = `refresh_token=${refreshToken}; Path=/; ${process.env.stageName == "local"
                ? 'SameSite=None; Secure'
                : 'Domain=.comprapagos.com; Secure; SameSite=Strict; Max-Age=604800'
            }`;

        return {
            statusCode: 200,
            headers: {
                ...getDefaultHeaders(event.headers.origin)
            },
            multiValueHeaders: {
                'Set-Cookie': [access_cookie, refresh_cookie], // cookies separadas
            },
            body: JSON.stringify({ success: true }),
        };
    } catch (error) {
        console.error("Error en Lambda getEmailData:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "Error en el servidor",
                error: error instanceof Error ? error.message : String(error),
            }),
        };
    }
};