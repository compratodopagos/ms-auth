import { Validators } from '@compratodo/ui-components';

export const emailSchema = {
    email: {
        type: 'email',
        label: 'Correo electrónico',
        required: true,
        placeholder: 'tu@email.com',
        validation: Validators.validateEmail || 'Correo inválido'
    }
};