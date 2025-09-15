import { useEffect } from 'react';

const CheckSession = ({
    setSessionChecked
}) => {
    useEffect(() => {
        const handleMessage = ({ origin, data, type }) => {
            if (origin !== import.meta.AUTH_MT) return;

            if (type === "message") {
                const { token, refreshToken } = data;
                if(!token){
                    window.location.href = import.meta.AUTH_MT_VIEW_CP;
                    return;
                }
                document.cookie = `access_token=${token}; path=/; secure; samesite=Strict; max-age=7200`;
                document.cookie = `refresh_token=${refreshToken}; path=/; secure; samesite=Strict; max-age=${60 * 60 * 24 * 7}`;
            }

            if (data?.type === "AUTH_ERROR") {
                console.error("❌ Error en login silencioso:", data.error);
            }
            setSessionChecked(true);
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
}

export default CheckSession;