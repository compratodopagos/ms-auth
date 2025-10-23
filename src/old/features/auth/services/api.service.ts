import { get, post } from 'aws-amplify/api';

export const getOption = async (path: string): Promise<any> => {
    try {
        const { body } = await get({
            apiName: 'authRestApi',
            path,
            options: {
                withCredentials: true
            }
        }).response;
        return await body.json();
    } catch (errors: any) {
        return errorMSG(path, errors);
    }
}
export const postOption = async (path: string, data: any, options: any = {}, withCredentials = true): Promise<any> => {
    try {
        const dataUser: any = {};
        const e = localStorage.getItem('e');
        if (e) {
            dataUser['email'] = e;
        }
        const { body } = await post({
            apiName: 'authRestApi',
            path,
            options: {
                ...options,
                body: {
                    ...data,
                    ...dataUser
                },
                withCredentials
            }
        }).response;
        return await body.json();
    } catch (errors: any) {
        return errorMSG(path, errors)
    }
}

const errorMSG = (path:string, errors:any) => {
    const { error, message, details, requiresCaptcha } = JSON.parse(errors.response?.body || '{}');
    if((error || message).includes('Token inválido o expirado')){
        window.location.pathname = '/login';
    }
    console.log(error, message)
    console.log(`Error en GET "${path}" with msg ${message}:`, error)
    return { error, message: (message || details), requiresCaptcha };
}