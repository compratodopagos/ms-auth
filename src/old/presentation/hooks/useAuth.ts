import { useState } from "react";
import { login } from "../services/authService";
import { User } from "../../../entities/user/model";
import { useNavigate } from "react-router-dom";

export function useAuth() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleLogin({ email, password }) {
        try {
            setLoading(true);
            setError(null);
            await login({ email, password });
        } catch (err) {
            console.log('err',err)
            setError("Credenciales inválidas");
            return null;
        } finally {
            setLoading(false);
        }
    }

    function logout() {
    }

    return { loading, error, handleLogin, logout };
}