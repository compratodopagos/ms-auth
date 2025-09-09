export const createTerms = async (event:any, pool: any) => {
    try {

        const { type } = JSON.parse(event.body || "{}");
        const ip_address = event.requestContext.identity.sourceIp;

        let data: Record<string, any> = {
            type_user: "prospect",
            type,
            ip_address,
            accepted_at: new Date().toISOString(),
            version: process.env[type.toUpperCase()] || "1.0",
        };

        const fields = Object.keys(data).join(", ");
        const values = Object.values(data);
        const placeholders = values.map(() => "?").join(", ");

        const query = `INSERT INTO user_terms (${fields}) VALUES (${placeholders})`;
        const connection = await pool.getConnection();
        const [result] = await connection.execute(query, values);
        connection.release();

        return { statusCode: 201, body: JSON.stringify({ message: "Términos aceptados y guardados con éxito", data: { id: result.insertId } }) };
    } catch (error) {
        console.error("Error en Lambda:", error);
        return { statusCode: 500, body: JSON.stringify({ message: "Error en el servidor", error }) };
    }
}