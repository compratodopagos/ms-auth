import { Pool } from 'mysql2/promise';
import { APIGatewayProxyEvent } from "aws-lambda";

import { setEmail } from "./actions/setEmail";
import { emailValid } from './actions/emailValid';
import { statusSteps } from './actions/statusSteps';
import { setPassword } from './actions/setPassword';
import { setPhone } from './actions/setPhone';
import { getUser } from './actions/getUser';
import { setCookies } from './actions/setCookies';
import { setUser } from './actions/setUser';
import { phoneValid } from './actions/phoneValid';
import { login } from './actions/login';

export const routes: Record<string, (event: APIGatewayProxyEvent, pool: Pool, poolCT: Pool, user:any) => Promise<any>> = {
    "GET:/auth/user": getUser,
    "POST:/auth/login": login,
    "POST:/auth/user": setUser,
    "POST:/auth/cookies": setCookies,
    "GET:/auth/steps": statusSteps,
    "POST:/auth/email": setEmail,
    "POST:/auth/phone": setPhone,
    "POST:/auth/password": setPassword,
    "POST:/auth/email/valid": emailValid,
    "POST:/auth/phone/valid": phoneValid,
};