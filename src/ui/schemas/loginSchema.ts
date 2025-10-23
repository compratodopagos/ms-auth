import { Validators } from '@compratodo/ui-components';

export const loginSchema = {
    email: {
        type: 'email',
        label: 'Correo electrónico',
        required: true,
        placeholder: 'tu@email.com',
        validation: Validators.validateEmail || 'Correo inválido'
    },
    password: {
        type: 'password',
        label: 'Ingresa tu contraseñas',
        required: true,
        showPasswordToggle: true
    }
};