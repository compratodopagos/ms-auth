import styles from './RegisterEmailStep.module.css'
import { useState } from 'react'
import { Card, FormBuilder, Validators } from '@compratodo/ui-components';
import { useNavigate } from 'react-router-dom';

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

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const handleSubmit = ({ email }) => {
        setLoading(true);
        localStorage.setItem('email',email);
        navigate('./valid');
    }

    return (
        <Card title="" className={`${styles.card} container flex justify-center items-center`}>
            <div className={`${styles.info} text-center`}>
                <h2>Ingresa tu correo electrónico</h2>
                <p>Verifica que tengas acceso a él.</p>
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