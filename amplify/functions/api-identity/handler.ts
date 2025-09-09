import { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-lambda";
import { pool } from "../resources/dbConnection";
import { generateToken, validateUser } from "../resources/token";
import { getDefaultHeaders } from "../resources/getDefaultHeaders";
import { routes } from "./router";

export const handler: APIGatewayProxyHandler = async (event:APIGatewayProxyEvent) => {
    console.log("event", event);

    let response:any = { headers: getDefaultHeaders(event.headers.origin) };

    try {
        const routeKey = event.path.includes('rekognitionLiveness')
            ? `${event.httpMethod}:/identity/rekognitionLiveness`
            : `${event.httpMethod}:${event.path}`;
        const action = routes[routeKey];

        // 🔐 Validar usuario y generar JWT si es válido
        const { user, error } = await validateUser(event, pool);
        if (!error) {
            const token = generateToken(user.id);
            response.headers["Set-Cookie"] = `auth_token=${token}; Path=/; Max-Age=1800; Secure; HttpOnly; SameSite=None`;
        }

        let responseAction = action
            ? await action(event, pool, user)
            : { statusCode: 400, body: JSON.stringify({ message: "Método no permitido" }) };


        return {
            ...response,
            ...responseAction,
            headers: { ...response.headers, ...(responseAction.headers || {}) }
        };
    } catch (error) {
        console.error("Error en Lambda:", error);
        return {
            ...response,
            statusCode: 500,
            body: JSON.stringify({ message: "Error en el servidor", error }),
        };
    }
};
