import { generateToken, validateUser } from "../../resources/token";

export const createEmail = async (event: any, pool: any, user:any) => {
    try {
        const { email, terms } = JSON.parse(event.body || "{}");

        // 🔍 Validar datos de entrada
        const validationError = validateInput(email);
        if (validationError) return validationError;

        const connection = await pool.getConnection();
        let prospectId;
        try {
            if(user && user.email){
                await pool.query('UPDATE users SET email = ? WHERE id = ?', [email, user.id]);
            } else {
                // 🚀 Procesar datos en la base de datos
                if (!terms) {
                    return validationErrorResponse("terms", "El campo terms es inválido.");
                }
                const ip_address = event.requestContext.identity.sourceIp;
                prospectId = await handleDatabaseOperations(connection, email, terms, ip_address, user);
                if(prospectId.error){
                    return { statusCode: 401, body: JSON.stringify({ message: "Error en la session", error: prospectId.error }) };
                }
            }
            const token = generateToken(user?.id || prospectId);

            return successResponse(token);
        } finally {
            connection.release(); // 🔄 Garantizar que la conexión se libere
        }
    } catch (error) {
        console.error("Error en Lambda:", error);
        return serverErrorResponse(error);
    }
};

// ✅ Validación de entrada
const validateInput = (email: string) => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
        return validationErrorResponse("email", "El campo email es inválido.");
    }
    return null;
};

// 🛠️ Operaciones en la base de datos
const handleDatabaseOperations = async (connection: any, email: string, terms: string, ip_address:string, userLogued?:any) => {
    
    let prospectId: any;
    const { privacy_policy, habeas_data, terms_register } = JSON.parse(terms);
    if(userLogued){
        prospectId = userLogued.id;
        // 🔄 Actualizar email del user
        await connection.execute(`UPDATE users SET email = ? WHERE id = ?`, [email, prospectId]);
    } else {
        // 🔎 Validar existencia de termss
        const [privacy_policyExists] = await connection.execute(`SELECT id FROM user_terms WHERE id = ?`, [privacy_policy]);
        if (privacy_policyExists.length === 0) {
            throw new Error("El ID de términos 'privacy_policy' no existe.");
        }
        const [habeas_dataExists] = await connection.execute(`SELECT id FROM user_terms WHERE id = ?`, [habeas_data]);
        if (habeas_dataExists.length === 0) {
            throw new Error("El ID de términos 'habeas_data' no existe.");
        }
        const [terms_registerExists] = await connection.execute(`SELECT id FROM user_terms WHERE id = ?`, [terms_register]);
        if (terms_registerExists.length === 0) {
            throw new Error("El ID de términos 'terms_register' no existe.");
        }
    
        // 🔎 Verificar si el email ya existe
        const [existingProspect] = await connection.execute(`SELECT id, password FROM users WHERE email = ?`, [email]);

        if(existingProspect[0] && existingProspect[0].password && !userLogued){
            return { error: 'Ya existe un usuario asociado a este correo' };
        }

        if (existingProspect.length === 0) {
            // 📌 Insertar nuevo prospecto
            const [insertResult]: any = await connection.execute(
                `INSERT INTO users (email, type_user) VALUES (?, ?)`,
                [email, "prospect"]
            );
            prospectId = insertResult.insertId;
        } else {
            prospectId = existingProspect[0]?.id;
        }
    }
    
    // 🗑️ Eliminar registros previos de user_terms excepto el actual
    await connection.execute(
        `DELETE FROM user_terms WHERE ((user_id = ? OR ip_address = '${ip_address}') OR (user_id IS NULL AND ip_address = '${ip_address}')) AND type_user = 'prospect' AND id NOT IN (${privacy_policy},${habeas_data},${terms_register})`,
        [prospectId]
    );

    // 🔄 Actualizar user_terms con el user_id correcto
    await connection.execute(`UPDATE user_terms SET user_id = ? WHERE id IN (${privacy_policy},${habeas_data},${terms_register})`, [prospectId]);

    return prospectId;
};

// 📤 Respuestas estructuradas
const successResponse = (token: string) => ({
    statusCode: 201,
    body: JSON.stringify({ message: "Correo guardado con éxito" }),
    headers: {
        "Set-Cookie": `auth_token=${token}; Path=/; Max-Age=1800; Secure; HttpOnly; SameSite=None`
    },
});

const validationErrorResponse = (field: string, message: string) => ({
    statusCode: 422,
    body: JSON.stringify({ errors: { [field]: message } }),
});

const serverErrorResponse = (error: any) => ({
    statusCode: 500,
    body: JSON.stringify({ message: "Error en el servidor", error: error.message || error }),
});
