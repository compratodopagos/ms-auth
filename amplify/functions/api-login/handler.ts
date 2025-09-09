import { APIGatewayProxyHandler } from "aws-lambda";
import { getDefaultHeaders } from "../resources/getDefaultHeaders";
import { routes } from "./router";
import { pool } from "../resources/dbConnection";

export const handler: APIGatewayProxyHandler = async (event) => {
    console.log("event", event);

    let response = { headers: getDefaultHeaders(event.headers.origin) };

    try {
        const routeKey = `${event.httpMethod}:${event.path}`;
        const action = routes[routeKey];

        const responseAction = action
            ? await action(event, pool)
            : { statusCode: 400, body: JSON.stringify({ message: "Método no permitido" }) };

        return {
            ...response,
            ...responseAction,
            headers: { ...response.headers, ...(responseAction.headers || {}) }
        };
    } catch (error:any) {
        console.error("Error en Lambda:", error);
        return {
            ...response,
            statusCode: 500,
            body: JSON.stringify({ message: "Error en el servidor", error: JSON.stringify(error.message) }),
        };
    }
};
