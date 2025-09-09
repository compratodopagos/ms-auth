import { APIGatewayProxyResult } from 'aws-lambda';

export async function logout(): Promise<APIGatewayProxyResult> {
    return {
        statusCode: 200,
        headers: {
            "Set-Cookie": "auth_token=; Path=/; HttpOnly; Secure; SameSite=None; Expires=Thu, 01 Jan 1970 00:00:00 GMT",
        },
        body: JSON.stringify({ message: "Sesión cerrada correctamente" })
    };
}