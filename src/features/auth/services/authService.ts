import { User } from "../../../entities/user/model";

interface LoginPayload {
    email: string;
    password: string;
}

export async function login(payload: LoginPayload): Promise<User> {
    const res = await fetch("https://api.compratodo.com/api/public/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        throw new Error("Error en el login");
    }

    const data = await res.json();

    // Adaptamos la respuesta al modelo User
    return {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        token: data.token,
    };
}
