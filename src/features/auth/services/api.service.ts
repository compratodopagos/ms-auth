import { get, post } from 'aws-amplify/api';

export const getOption = async (path: string): Promise < any > => {
    try {
        const { body } = await get({
            apiName: 'authRestApi',
            path,
            options: {
                withCredentials: true
            }
        }).response;
        return await body.json();
    } catch(errors: any) {
        console.log('errors', errors);
        const { error, message } = JSON.parse(errors.response?.body || '{}');
        console.log(`Error en GET "${path}" with msg ${message}:`, error)
        return { error, message };
    }
}
export const postOption = async (path: string, data: any, options: any = {}): Promise < any > => {
    try {
        const { body } = await post({
            apiName: 'authRestApi',
            path,
            options: {
                ...options,
                body: data,
                withCredentials: true,
            }
        }).response;
        return await body.json();
    } catch(errors: any) {
        console.log('errors', errors);
        const { error, message, requiresCaptcha } = JSON.parse(errors.response?.body || '{}');
        console.log(error, message)
        console.log(`Error en GET "${path}" with msg ${message}:`, error)
        return { error, message, requiresCaptcha };
    }
}