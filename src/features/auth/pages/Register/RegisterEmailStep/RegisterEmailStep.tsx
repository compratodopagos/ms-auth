import styles from './RegisterEmailStep.module.css'
import { useState } from 'react'
import { Card, FormBuilder, Validators } from '@compratodo/ui-components';
import { useRegisterFlow } from '../../../hooks/useRegisterFlow';

const emailSchema = {
    email: {
        type: 'email',
        label: 'Correo electrónico',
        required: true,
        placeholder: 'tu@email.com',
        validation: Validators.validateEmail || 'Correo inválido'
    }
};

const RegisterEmailStep = () => {

    const { setEmail } = useRegisterFlow();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>();
    const handleSubmit = async ({ email }) => {
        setLoading(true);
        const errorMsg = await setEmail(email);
        if(errorMsg){
            setError(errorMsg);
        }
    }

    return (
        <Card title="" className={`${styles.card} container flex justify-center items-center`}>
            <div className={`${styles.info} text-center`}>
                <h2>Ingresa tu correo electrónico</h2>
                <p>Verifica que tengas acceso a él.</p>
                { error? <span className='text-[var(--color-danger)]'>* { error }</span> : null }
                <div className="text-left mt-6">
                    <FormBuilder
                        schema={emailSchema}
                        onSubmit={handleSubmit}
                        submitButtonProps={{ type: 'submit', variant: 'primary', disabled: loading }}
                        submitButtonText={'Continuar'}
                        className="space-y-4 text-left"
                        uilder>
                            <p className='mb-3'>Formato sugerido: nombre@ejemplo.com</p>
                    </FormBuilder>
                </div>
            </div>
        </Card>
    )
}

export default RegisterEmailStep;