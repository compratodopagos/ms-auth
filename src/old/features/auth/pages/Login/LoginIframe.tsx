import { useEffect } from 'react';
import { setCookies } from '../../services/cookie.service';

const LoginIframe = ({
    redirect = false,
    origin = "https://auth.compratodo.com/silent-login"
}) => {
    useEffect(() => {
        const handleMessage = async ({ origin, data, type }) => {
            if (origin !== import.meta.env.VITE_AUTH_MT) return;

            if (type === "message") {
                const { token, refreshToken, user } = data;

                if (!token) {
                    if (redirect) {
                        window.location.href = import.meta.env.VITE_AUTH_MT_VIEW_CP + "?prefix=dev";
                    }
                    return;
                }

                await setCookies(token, refreshToken);
                if (user?.name === 'prospect') {
                    window.location.href = import.meta.env.VITE_ORIGIN + "/register/steps";
                } else {
                    window.location.href = import.meta.env.VITE_ORIGIN + "/home";
                }
            }

            if (data?.type === "AUTH_ERROR") {
                console.error("❌ Error en login silencioso:", data.error);
            }
        };

        window.addEventListener("message", handleMessage);
        return () => window.removeEventListener("message", handleMessage);
    }, [redirect]);

    return (
        <>
            <iframe
                src={origin}
                style={{ display: 'none' }}
            ></iframe>
            <span>Cargando...</span>
        </>
    );
};

export default LoginIframe;
