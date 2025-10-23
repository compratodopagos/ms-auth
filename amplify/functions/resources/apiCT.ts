import { APIGatewayProxyEvent } from "aws-lambda";
import cookie from "cookie";

const API_URL = process.env.API_URL || "";

/**
 * Extrae el token de las cookies y arma headers comunes
 */
const buildHeaders = (event: APIGatewayProxyEvent) => {
    const { access_token } = cookie.parse(event.headers.Cookie || "");
    return {
        "Content-Type": "application/json",
        ...(access_token ? { Authorization: `Bearer ${access_token}` } : {}),
    };
};

/**
 * Maneja request hacia el API externo
 */
export const callApi = async (
    event: APIGatewayProxyEvent,
    path: string,
    method: "GET" | "POST" = "GET",
    body?: unknown,
    customAccessToken?: string
) => {
    try {

        const headers = buildHeaders(event);
        if(customAccessToken){
            headers.Authorization = `Bearer ${customAccessToken}`
        }

        console.log({
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined,
        })

        const response = await fetch(`${API_URL}${path}`, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined,
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
            throw new Error(
                data?.message || `Error ${response.status} en ${method} ${path}`
            );
        }

        return data;
    } catch (error) {
        console.error(`❌ Error en ${method} ${path}:`, error);
        throw error;
    }
};

/**
 * GET wrapper
 */
export const getOption = (event: APIGatewayProxyEvent, path: string) =>
    callApi(event, path, "GET");

/**
 * POST wrapper
 */
export const postOption = (
    event: APIGatewayProxyEvent,
    path: string,
    body: unknown
) => callApi(event, path, "POST", body);