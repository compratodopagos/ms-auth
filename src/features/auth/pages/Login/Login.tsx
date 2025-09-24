import { useEffect } from 'react';
import './Login.css';

const LoginPage = async ({
    redirect = true
}) => {
    useEffect(() => {
        const handleMessage = ({ origin, data, type }) => {
            if (origin !== import.meta.env.VITE_AUTH_MT) return;

            if (type === "message") {
                const { token, refreshToken } = data;
                if (!token) {
                    window.location.href = import.meta.env.VITE_AUTH_MT_VIEW_CP + "?prefix=dev";
                    return;
                }
                document.cookie = `access_token=${token}; path=/; secure; samesite=Strict; max-age=7200`;
                document.cookie = `refresh_token=${refreshToken}; path=/; secure; samesite=Strict; max-age=${60 * 60 * 24 * 7}`;
                if(redirect)
                    window.location.href = import.meta.env.VITE_ORIGIN + "/home";
            }

            if (data?.type === "AUTH_ERROR") {
                console.error("❌ Error en login silencioso:", data.error);
            }
        };
        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, []);
    return (
        <>
            <iframe
                src="https://auth.compratodo.com/silent-login"
                style={{ display: 'none' }}
            ></iframe>
            <span>Cargando...</span>
        </>
    );
};

export default LoginPage;
