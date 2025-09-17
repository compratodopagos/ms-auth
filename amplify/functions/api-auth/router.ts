import { Pool } from 'mysql2/promise';
import { APIGatewayProxyEvent } from "aws-lambda";

import { setEmail } from "./actions/setEmail";

export const routes: Record<string, (event: APIGatewayProxyEvent, pool: Pool, poolCT: Pool) => Promise<any>> = {
    "POST:/email": setEmail,
};