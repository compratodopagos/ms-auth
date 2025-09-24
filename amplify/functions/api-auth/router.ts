import { Pool } from 'mysql2/promise';
import { APIGatewayProxyEvent } from "aws-lambda";

import { setEmail } from "./actions/setEmail";
import { emailValid } from './actions/emailValid';
import { statusSteps } from './actions/statusSteps';
import { setPassword } from './actions/setPassword';

export const routes: Record<string, (event: APIGatewayProxyEvent, pool: Pool, poolCT: Pool) => Promise<any>> = {
    "POST:/auth/steps": statusSteps,
    "POST:/auth/email": setEmail,
    "POST:/auth/password": setPassword,
    "POST:/auth/email/valid": emailValid,
};