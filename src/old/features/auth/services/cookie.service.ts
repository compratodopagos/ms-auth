import { postOption } from "./api.service";

export const setCookies = async (token: string, refreshToken: string) => {
    const { success, message } = await postOption('auth/cookies', { token, refreshToken }, false);
    if (success) {
        return { success }
    } else {
        return { message };
    }
}