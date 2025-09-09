export const createCompany = async (event: any, pool: any, user:any) => {
    try {
        if(!user){
            return { statusCode: 401, body: JSON.stringify({ message: "Usuario no autenticado" }) };
        }

        const { nit } = JSON.parse(event.body || "{}");
        const connection = await pool.getConnection();
        // 🚀 Procesar datos en la base de datos
        let id:any;
        const [existingCompany] = await connection.execute(`SELECT id FROM companies WHERE nit = ? and user_id = ?`, [nit, user.id]);
        if(!existingCompany[0]){
            const [result] = await connection.execute(`INSERT INTO companies (nit,user_id) VALUES (?,?)`, [nit,user.id]);
            id = result.insertId;
        }
        connection.release();
        return { statusCode: 201, body: JSON.stringify({ message: "Datos guardados", id }) };
    } catch (error) {
        console.error("Error en Lambda:", error);
        return serverErrorResponse(error);
    }
};

const serverErrorResponse = (error: any) => ({
    statusCode: 500,
    body: JSON.stringify({ message: "Error en el servidor", error: error.message || error }),
});
