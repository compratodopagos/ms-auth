export const logout = async () => {
    try {
        return {
            statusCode: 200,
            headers: {
                'Set-Cookie': 'auth_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax', // 🔥 Elimina la cookie
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: 'Sesión cerrada correctamente' })
        };
    } catch (error) {
        console.error("Error en Lambda:", error);
        return { statusCode: 500, body: JSON.stringify({ message: "Error en el servidor", error }) };
    }
}