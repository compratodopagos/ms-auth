import { APIGatewayProxyEvent, APIGatewayProxyHandler } from "aws-lambda";
import { pool, poolCT } from "../resources/dbConnection";
import { getDefaultHeaders } from "../resources/getDefaultHeaders";
import { routes } from "./router";

export const handler: APIGatewayProxyHandler = async (event:APIGatewayProxyEvent) => {
    console.log("event", event);

    let response:any = { headers: getDefaultHeaders(event.headers.origin) };

    try {
        const routeKey = `${event.httpMethod}:${event.path}`;
        const action = routes[routeKey];

        let responseAction = action
            ? await action(event, pool, poolCT)
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
