import { APIGatewayProxyEvent } from "aws-lambda";
import { refreshAccessToken, validToken } from "./tokenService";
import { Pool } from "mysql2/promise";
import cookie from "cookie";

export const getUserLogged = async (
    event: APIGatewayProxyEvent,
    poolCT: Pool
): Promise<{ user?: any; newTokens?: { access_token: string; refresh_token: string } }> => {
    const { access_token, refresh_token } = cookie.parse(event.headers.Cookie || "");

    if (access_token) {
        const { user, isValid, expired } = await validToken(poolCT, access_token);

        // Caso: access token válido pero expirado
        if (isValid && expired && refresh_token) {

            const sourceIp = event.requestContext.identity.sourceIp;
            const userAgent = event.headers["User-Agent"] || null;

            // Aquí usamos el refresh_token plano de la cookie, no el user.id
            const { access_token: newAccess, refresh_token: newRefresh, error } = await refreshAccessToken(poolCT, refresh_token, sourceIp, userAgent);
            if(!access_token && !refresh_token || error){
                console.log('expired', access_token, refresh_token, error)
                return {};
            }

            return { user, newTokens: { access_token: newAccess, refresh_token: newRefresh } };
        } else if (user) {
            return { user };
        }
    }

    return { user: undefined };
};