export const updateUser = async (connection:any, documentData:any, user:any) => {
    let queryUser = 'UPDATE users SET ';
    let dataUser = [];
    if (documentData.document_type) {
        queryUser += `document_type = ?,`;
        dataUser.push(documentData.document_type);
    }
    if (documentData.name) {
        queryUser += `name = ?,`;
        dataUser.push(documentData.name);
    }
    if (documentData.lastname) {
        queryUser += `lastname = ?,`
        dataUser.push(documentData.lastname);
    }
    if (documentData.document) {
        queryUser += `document_number = ?,`
        dataUser.push(documentData.document);
        const [userExists] = await connection.query(`SELECT id FROM users WHERE document_number = ? AND id != ?`,[documentData.document,user.id]);
        if(userExists.length > 0){
            throw Error("Ya existe un usuario asociado a este documento de identidad");
        }
    }

    if (documentData.birthDate) {
        queryUser += `birthDate = ?,`
        let formattedBirthDate = formatDate(documentData.birthDate);
        if (documentData.birthDate.includes('/')) {
            formattedBirthDate = documentData.birthDate.replaceAll('/', '-');
        }
        dataUser.push(formattedBirthDate);
    }
    if (documentData.nationality) {
        queryUser += `nationality = ?,`
        dataUser.push(documentData.nationality);
    }

    if (queryUser !== 'UPDATE users SET ') {
        queryUser = queryUser.slice(0, -1) + ` WHERE id = ${user.id}`;
        await connection.execute(queryUser, dataUser);
    }
}

const formatDate = (birthDate: string) => {
    const monthMap: any = {
        "ENE": "01", "JAN": "01", "ENE/JAN": "01",
        "FEB": "02", "FEB/FEB": "02",
        "MAR": "03", "MAR/MAR": "02",
        "ABR": "04", "APR": "04", "ABR/APR": "04",
        "MAY": "05", "MAY/MAY": "05",
        "JUN": "06", "JUN/JUN": "06",
        "JUL": "07", "JUL/JUL": "07",
        "AGO": "08", "AUG": "08", "AGO/AGO": "08",
        "SEP": "09", "SEP/SEP": "09",
        "OCT": "10", "OCT/OCT": "10",
        "NOV": "11", "NOV/NOV": "11",
        "DIC": "12", "DEC": "12", "DIC/DEC": "12"
    };

    let match = birthDate.match(/(\d{1,2})[\s\-\/]+(ENE|JAN|FEB|MAR|ABR|APR|MAY|JUN|JUL|AGO|AUG|SEP|OCT|NOV|DIC|DEC)(?:[\s\-\/]+\2)?[\s\-\/]+(\d{2,4})/i);

    if (match) {
        let [, day, month, year] = match;
        month = month.toUpperCase();
        year = year.length === 2 ? `19${year}` : year; // Si es '20', asumimos '1920' (puedes ajustar)
        return `${year}-${monthMap[month]}-${day.padStart(2, '0')}`;
    }

    match = birthDate.match(/(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/);
    if (match) {
        let [, year, month, day] = match;
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }

    return null; // Retorna null si no puede formatear
}