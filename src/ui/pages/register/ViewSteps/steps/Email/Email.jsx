import styles from './Email.module.css'
import { useState } from 'react'
import { Card, FormBuilder } from '@compratodo/ui-components';
import { useRegisterFlow } from '../../../../../../presentation/hooks';
import { emailSchema } from '../../../../../schemas';

const RegisterEmailStep = () => {

    const { setEmail } = useRegisterFlow();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();

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
                { error == 'Ya existe un usuario con ese correo'? <div><a href="/login">Ingresar</a></div> : null }
                <div className="text-left mt-6">
                    <FormBuilder
                        schema={emailSchema}
                        onSubmit={handleSubmit}
                        submitButtonProps={{ type: 'submit', variant: 'primary', disabled: loading }}
                        submitButtonText={'Continuar'}
                        className="space-y-4 text-left">
                            <p className='mb-3'>Formato sugerido: nombre@ejemplo.com</p>
                    </FormBuilder>
                </div>
            </div>
        </Card>
    )
}

export default RegisterEmailStep;