import twilio from 'twilio';
import { getSecretValue } from './getSecretValue';

// Variable para almacenar la instancia de Twilio
let twilioClient: any = null;

export async function getTwilioClient() {
    if (!twilioClient) {
        const secret = await getSecretValue('ctp/dev/twilio');
        twilioClient = twilio(secret.accountSid, secret.authToken);
    }
    return twilioClient;
}

export const numbers = async () => {
    const secret = await getSecretValue('ctp/dev/twilio');
    return {
        sms: secret.smsPhoneNumber,
        wa: secret.waPhoneNumber
    }
}