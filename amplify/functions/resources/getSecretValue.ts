import AWS from 'aws-sdk';

const secretsManager = new AWS.SecretsManager();

export async function getSecretValue(secretName: string) {
    try {
        const data:any = await secretsManager.getSecretValue({ SecretId: secretName }).promise();

        if (data.SecretString) {
            return JSON.parse(data.SecretString);
        } else if (data.SecretBinary) {
            const buff = Buffer.from(data.SecretBinary, 'base64');
            return JSON.parse(buff.toString('ascii'));
        } else {
            throw new Error(`No se encontraron datos en el secreto: ${secretName}`);
        }
    } catch (err:any) {
        console.error(`Error al obtener el secreto ${secretName}:`, err);
        throw new Error(`Error retrieving secret: ${err.message}`);
    }
}