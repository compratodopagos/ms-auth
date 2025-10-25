import { Pool } from 'mysql2/promise';
import { companySteps } from '../../../src/schemas/companySteps';
import { personalSteps } from '../../../src/schemas/personalSteps';

export const stepStatusValid = async (email:string, poolCT: Pool) => {
    const [rows] = await poolCT.query(
        `SELECT u.email, u.password, ev.verified_at as email_verified_at, u.type_account, u.phone_verified_at
        FROM users u
        LEFT JOIN email_verifications ev
        ON ev.user_id = u.id
        AND ev.verified_at IS NOT NULL
        WHERE u.email = ?
        LIMIT 1`,
        [email]
    );
    const user_data = (rows as any[])[0];
    const stepsId = (user_data.type_account == 'personal'? personalSteps : companySteps).map(s => s.id);
    const stepsStatus: Record<string, boolean> = {};
    
    stepsId.forEach((id: string) => {
        switch (id) {
            case "email":
                stepsStatus[id] = user_data && user_data.email_verified_at !== null;
                break;
            case "password":
                stepsStatus[id] = user_data && user_data.password !== null;
                break;
            case "phone":
                stepsStatus[id] = user_data && user_data.phone_verified_at;
                break;
            default:
                stepsStatus[id] = false;
                break;
        }
    });
    return stepsStatus;
}