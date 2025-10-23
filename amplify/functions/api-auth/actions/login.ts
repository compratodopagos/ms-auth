import { Pool } from "mysql2/promise";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import bcrypt from "bcryptjs";
import { generateToken } from "../../resources/tokenService";
import { getDefaultHeaders } from "../../resources/getDefaultHeaders";
import { stepStatusValid } from "../../resources/stepStatusValid";

export const login = async (
    event: APIGatewayProxyEvent,
    pool: Pool,
    poolCT: Pool
): Promise<APIGatewayProxyResult> => {
    try {
        const { email: emailHash, password } = JSON.parse(event.body || "{}");

        if (
            !emailHash ||
            !password ||
            typeof emailHash !== "string" ||
            typeof password !== "string"
        ) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Email o contraseña inválido" }),
            };
        }

        let email = emailHash;
        try {
            email = atob(emailHash);
        } catch (error) {
            console.log('No viene cifrado el email');
        }

        // 1. Buscar usuario en DB
        const [rows]: any = await poolCT.query(
            "SELECT id, name, email, password FROM users WHERE email = ? LIMIT 1",
            [email]
        );

        if (!rows.length) {
            return {
                statusCode: 401,
                body: JSON.stringify({ message: "Credenciales inválidas" }),
            };
        }

        const user = rows[0];

        // 2. Verificar contraseña
        const isPasswordValid = await verifyPassword(password, user.password);

        if (!isPasswordValid) {
            return {
                statusCode: 401,
                body: JSON.stringify({ message: "Credenciales inválidas" }),
            };
        }

        // 3. Generar access_token con Sanctum-style (expira en 15 min o 1h)
        const { access_token, refresh_token } = await generateToken(poolCT, user.id, event.requestContext.identity.sourceIp, event.requestContext.identity.userAgent);

        const access_cookie = `access_token=${access_token}; Path=/; ${process.env.stageName == "local"
            ? 'SameSite=None; Secure'
            : 'Domain=.comprapagos.com; Secure; SameSite=Strict; Max-Age=604800'
            }`;
        const refresh_cookie = `refresh_token=${refresh_token}; Path=/; ${process.env.stageName == "local"
            ? 'SameSite=None; Secure'
            : 'Domain=.comprapagos.com; Secure; SameSite=Strict; Max-Age=604800'
            }`;

        const stepsStatus: Record<string, boolean> = await stepStatusValid(email, poolCT);

        return {
            statusCode: 200,
            headers: {
                ...getDefaultHeaders(event.headers.origin)
            },
            multiValueHeaders: {
                'Set-Cookie': [access_cookie, refresh_cookie], // cookies separadas
            },
            body: JSON.stringify({
                success: true,
                status: user.status,
                stepsStatus
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

export async function verifyPassword(password: string, hash: string) {
    // bcryptjs.compare puede validar hashes $2y$? si da problemas, normaliza a $2b$:
    const normalized = hash.replace(/^\$2y\$/, "$2b$");
    return bcrypt.compare(password, normalized);
}