import { ItemPasswordValid } from "../../core/domain/types";

export const passwordItemsValid: ItemPasswordValid[] = [
    { label: 'Mínimo 8 caracteres, con al menos 1 mayúscula y 1 minúscula', error: 'minlength' },
    { label: 'Mínimo 1 número y 1 signo como %$!?', error: 'number' },
    { label: 'Sin secuencias ni repeticiones como ABC o TTT', error: 'weakSequence' },
    { label: 'Sin tu e-mail, ni compratodo o comprapagos', error: 'minlength' },
    { label: 'Las contraseñas deben coincidir', error: 'confirm_password' },
]

export const passwordStep = (validation:any, validConfirmPassword:any) => {
    return {
        password: {
            type: 'password',
            label: 'Ingresa tu contraseñas',
            required: true,
            placeholder: 'Ejemplo: An#1.213jshf',
            showPasswordToggle: true,
            validation
        },
        confirm_password: {
            type: 'password',
            label: 'Confirma tu contraseñas',
            showPasswordToggle: true,
            required: true,
            validation: validConfirmPassword
        }
    };
}