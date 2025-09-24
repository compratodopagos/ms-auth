import { Pool } from "mysql2/promise";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

const validCode = async (email: string, code: string) => {
    const API_URL = process.env.API_URL;
    const response = await fetch(
        `${API_URL}/public/auth/verify/email/check`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, code }),
        }
    );

    if (!response.ok) {
        const text = await response.text();
        console.error("Fallo al validar código:", text);
        return {
            success: false,
            details: text
        }
    }

    return {
        success: true
    };
}

export const statusSteps = async (event: APIGatewayProxyEvent, pool: Pool, poolCT: Pool): Promise<APIGatewayProxyResult> => {
    try {
        const { email, stepsId } = JSON.parse(event.body || '{}');

        if (!stepsId) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Email ó stepsId inválido" }),
            };
        }

        const stepsStatus: any = {};

        if (!email) {
            stepsId.forEach((id: string) => {
                stepsStatus[id] = false;
            });
            return {
                statusCode: 200,
                body: JSON.stringify({ stepsStatus }),
            };
        }

        let emailDecoded = atob(email);

        const [rows] = await poolCT.query(
            `
                SELECT u.email, ev.verified_at as email_verified_at
                FROM users u
                LEFT JOIN email_verifications ev
                    ON ev.user_id = u.id
                    AND ev.verified_at IS NOT NULL
                WHERE u.email = ?
                LIMIT 1
            `,
            [emailDecoded]
        );

        const user = (rows as any[])[0];

        stepsId.forEach((id: string) => {
            switch (id) {
                case "email":
                    stepsStatus[id] = user.email_verified_at !== null;
                    break;
                case "password":
                    stepsStatus[id] = user.password !== null;
                    break;
                default:
                    stepsStatus[id] = false;
                    break;
            }
        })

        return {
            statusCode: 200,
            body: JSON.stringify({ stepsStatus }),
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