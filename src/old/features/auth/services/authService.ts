import { postOption } from "./api.service";

interface LoginPayload {
    email: string;
    password: string;
}

export async function login(payload: LoginPayload): Promise<boolean> {
    const { success, stepsStatus } = await postOption("auth/login", payload);
    if (!success) {
        throw new Error("Error en el login");
    }

    if(stepsStatus){
        let success = true;
        Object.keys(stepsStatus).forEach(key => {
            if(!stepsStatus[key]){
                success = false;
            }
        })
        if(!success){
            window.location.pathname = '/register/steps'
        }
    } else {
        window.location.pathname = '/home'
    }

    // Adaptamos la respuesta al modelo User
    return true;
}
