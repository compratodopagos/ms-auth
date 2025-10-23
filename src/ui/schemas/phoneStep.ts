export const validatePhone = (phone: number | string) => {
    if (phone === undefined || phone === null || phone === '') {
        return 'El número es obligatorio';
    }

    // Convertimos a string para contar dígitos
    const digits = String(phone);

    // Solo dígitos (type="number" ya ayuda, pero por si acaso)
    if (!/^\d+$/.test(digits)) {
        return 'El número solo debe contener dígitos';
    }

    // Exactamente 10 dígitos y comenzar con 3 (celulares en Colombia)
    if (!/^3\d{9}$/.test(digits)) {
        return 'El número debe tener 10 dígitos y empezar por 3';
    }

    return true; // válido
};

export const phoneStep = {
    phone: {
        type: 'number',
        label: 'Número',
        required: true,
        icon: '+57',
        iconPosition: 'left',
        validation: validatePhone || 'Correo inválido'
    }
};