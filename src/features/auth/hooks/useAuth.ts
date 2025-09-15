import { useState } from "react";
import { login } from "../services/authService";
import { User } from "../../../entities/user/model";

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleLogin(email: string, password: string) {
        try {
            setLoading(true);
            setError(null);
            const loggedUser = await login({ email, password });

            // Guardamos el token en localStorage
            localStorage.setItem("token", loggedUser.token);

            setUser(loggedUser);
            return loggedUser;
        } catch (err) {
            setError("Credenciales inválidas");
            return null;
        } finally {
            setLoading(false);
        }
    }

    function logout() {
        localStorage.removeItem("token");
        setUser(null);
    }

    return { user, loading, error, handleLogin, logout };
}