import { Pool } from 'mysql2/promise';

export const getUser = async (event: any, pool: Pool, user:any) => {
    try {
        
        if(!user){
            return { statusCode: 401, body: JSON.stringify({ message: "Usuario no autenticado" }) };
        }

        // Buscar documentos del usuario prospecto
        const [documents] = await pool.query('SELECT * FROM user_documents WHERE user_id = ?', [user.id]);

        user.documents = documents;
        if(user.password){
            user.hasPassword = true;
            delete user.password;
        }

        Object.keys(user).forEach(name => {
            if(!user[name])
                delete user[name]
        })

        const [companyExists]:any = await pool.query(`SELECT nit, nit_document FROM companies WHERE user_id = ?`, [user.id]);
        if(companyExists[0]){
            user.company = companyExists[0];
        }

        const [basicDataExists]:any = await pool.query(`SELECT country, ocupation, income_statement, PEP, tyc FROM basic_data WHERE user_id = ?`, [user.id]);
        if(basicDataExists[0]){
            user.basic_data = basicDataExists[0];
        }

        // Por ejemplo, para enviarlo al frontend sin el email completo:
        const maskedEmail = maskEmail(user.email);
        user.email = maskedEmail;

        return { statusCode: 200, body: JSON.stringify({ user }) };

    } catch (error) {
        console.error("Error en Lambda:", error);
        return { statusCode: 500, body: JSON.stringify({ message: "Error en el servidor", error }) };
    }
};

function maskEmail(email: string): string {
  const [user, domain] = email.split("@");
  const visible = user.slice(0, 2); // Mostrar solo los primeros 2 caracteres del usuario
  const masked = "*".repeat(user.length - 2);
  return `${visible}${masked}@${domain}`;
}