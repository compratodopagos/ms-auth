import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";
import { pool, poolCT } from "../resources/dbConnection";
import { getDefaultHeaders } from "../resources/getDefaultHeaders";
import { routes } from "./router";
import { getUserLogged } from "../resources/getUserLogged";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent) => {
    console.log("event", event);

    let response: any = { headers: getDefaultHeaders(event.headers.origin) };

    try {
        const routeKey = `${event.httpMethod}:${event.path}`;
        const action = routes[routeKey];

        const { user, newTokens } = await getUserLogged(event, poolCT);

        let responseAction: APIGatewayProxyResult = action
            ? await action(event, pool, poolCT, user)
            : { statusCode: 400, body: JSON.stringify({ message: "Método no permitido" }) };

        if (newTokens) {
            const access_cookie = `access_token=${newTokens.access_token}; Path=/; ${process.env.stageName == "local"
                ? 'SameSite=None; Secure'
                : 'Domain=.comprapagos.com; Secure; SameSite=Strict; Max-Age=3600'
                }`;
            const refresh_cookie = `refresh_token=${newTokens.refresh_token}; Path=/; ${process.env.stageName == "local"
                ? 'SameSite=None; Secure'
                : 'Domain=.comprapagos.com; Secure; SameSite=Strict; Max-Age=21600'
                }`;
            responseAction.multiValueHeaders = {
                ...(responseAction.multiValueHeaders || {}),
                "Set-Cookie": [
                    ...(responseAction.multiValueHeaders || {})['Set-Cookie'] || [],
                    access_cookie,
                    refresh_cookie
                ],
            };
        }

        return {
            ...response,
            ...responseAction,
            headers: { ...response.headers, ...(responseAction.headers || {}) }
        };
    } catch (error: any) {
        console.error("Error en Lambda:", error);
        return {
            ...response,
            statusCode: 500,
            body: JSON.stringify({ message: "Error en el servidor", error: JSON.stringify(error.message) }),
        };
    }
};