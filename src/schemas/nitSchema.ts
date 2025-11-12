// Valida formato y dígito de verificación de un NIT colombiano
export const validateNit = (nit: number | string) => {
    if (nit === undefined || nit === null || nit === '') {
        return 'El NIT es obligatorio';
    }

    const cleanNit = String(nit).trim();

    // Validar formato: solo dígitos o dígitos con un guion y un DV
    if (!/^\d{5,12}(-\d{1})?$/.test(cleanNit)) {
        return 'El NIT debe tener entre 5 y 12 dígitos y, opcionalmente, un dígito de verificación separado por guion';
    }

    // Si no tiene DV, se acepta como válido sin calcular
    if (!cleanNit.includes('-')) {
        return true;
    }

    // Separar número base y dígito de verificación
    const [nitNumber, dvString] = cleanNit.split('-');
    const dv = Number(dvString);

    if (isNaN(dv)) {
        return 'El dígito de verificación no es válido';
    }

    // Calcular DV esperado según la DIAN
    const factors = [3, 7, 13, 17, 19, 23, 29, 37, 41, 43, 47, 53, 59, 67, 71];
    const reversed = nitNumber.split('').reverse().map(Number);

    let sum = 0;
    for (let i = 0; i < reversed.length; i++) {
        sum += reversed[i] * factors[i];
    }

    const remainder = sum % 11;
    const calculatedDV = remainder > 1 ? 11 - remainder : remainder;

    if (calculatedDV !== dv) {
        return `El NIT no es válido (DV esperado: ${calculatedDV})`;
    }

    return true;
};

// Ejemplo de uso en schema
export const nitSchema = {
    nit: {
        type: 'text',
        label: 'NIT',
        required: true,
        placeholder: 'Ej: 900373912-6',
        validation: validateNit
    }
};