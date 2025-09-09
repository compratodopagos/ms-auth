import { getSecretValue } from "./getSecretValue";

const nodemailer = require('nodemailer');

interface mailBody {
    from: string;
    to: string;
    subject: string;
    text: string;
    html: string;
}

export const mailSend = async (body: mailBody) => {
  try {
    const secret = await getSecretValue('ctp/dev/smtp');
    console.log('Secret:', {
      host: secret.HOST,
      port: secret.PORT, 
      secure: secret.PORT == 465,
      auth: {
        user: secret.USER,
        pass: secret.PASSWORD
      }
    });
    const transporter = nodemailer.createTransport({
      host: secret.HOST,
      port: secret.PORT, 
      secure: secret.PORT == 465,
      auth: {
        user: secret.USER,
        pass: secret.PASSWORD
      }
    });

    console.log('Enviando correo a:', body);

    await transporter.sendMail(body);
  } catch (error) {
    console.error('Error al enviar correo:', error);
    throw error;
  }
};
