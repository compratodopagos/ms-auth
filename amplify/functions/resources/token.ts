import jwt from 'jsonwebtoken';
import { getSecretValue } from './getSecretValue';
import { Pool } from 'mysql2/promise';

const secret = await getSecretValue('ctp/dev/jwt_token'); // El nombre de tu secreto

export const generateToken = (user_id: string) => {
    console.log('secretKey',secret.SECRET_KEY)
    return jwt.sign({ user_id }, secret.SECRET_KEY, { expiresIn: '10h' });
}

// 🔎 Función para extraer el token desde las cookies
const extractToken = (cookieHeader: string | undefined): string | null => {
    if (!cookieHeader) return null;
    const match = cookieHeader.match(/auth_token=([^;]+)/);
    return match ? match[1] : null;
};

// ✅ Middleware para validar la sesión
export const validateUser = async (event: any, pool: Pool) => {
    try {
        const token = extractToken(event.headers.Cookie); // 🔍 Leer el token desde la cookie
        if (!token) {
            return { error: { message: "No autorizado" } };
        }

        // 🔐 Verificar y decodificar JWT
        const decoded = jwt.verify(token, secret.SECRET_KEY) as { user_id: string };

        console.log("Usuario autenticado:", decoded);

        // 🔍 Buscar al usuario en la base de datos
        const [users] = await pool.query("SELECT * FROM users WHERE id = ?", [decoded.user_id]);
        if ((users as any[]).length === 0) {
            return { error: { message: "Usuario no encontrado" } };
        }

        return { user: (users as any[])[0] };
    } catch (error) {
        console.error("Error en validación de usuario:", error);
        return { error: { message: "Token inválido o expirado" } };
    }
};