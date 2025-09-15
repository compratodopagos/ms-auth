import { Validators } from '@compratodo/ui-components';
import { LockKeyhole, Mail } from 'lucide-react';

export const loginForm = {
    email: {
        type: 'email',
        required: true,
        placeholder: 'Correo electrónico:',
        icon: <Mail color="#000000" size={18} />,
        validation: Validators.validateEmail || 'Correo inválido'
    },
    password: {
        type: 'password',
        required: true,
        placeholder: 'Contraseña:',
        showPasswordToggle: true,
        icon: <LockKeyhole color="#000000" size={18} />
    }
};