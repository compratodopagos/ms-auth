import styles from './PhoneStep.module.css';
import { useState } from "react";
import { useRegisterFlow } from "../../../../../../core/presentation/hooks";
import { Card, FormBuilder } from "@compratodo/ui-components";
import { phoneStep } from '../../../../../schemas';

const PhoneStep = () => {
    const { setPhone } = useRegisterFlow();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();

    const handleSubmit = async ({ phone }) => {
        setLoading(true);
        const errorMsg = await setPhone(`+57${phone}`);
        if (errorMsg) {
            setError(errorMsg);
        }
        setLoading(false);
    }

    return (
        <Card title="" className={`${styles.card} container flex justify-center items-center`}>
            <div className={`${styles.info} text-center`}>
                <h2>Ingresa tu número de celular</h2>
                <p>Te enviaremos un código de verificación por SMS</p>
                {error ? <span className='text-[var(--color-danger)]'>* {error}</span> : null}
                <div className="text-left mt-6">
                    <FormBuilder
                        schema={phoneStep}
                        onSubmit={handleSubmit}
                        submitButtonProps={{ type: 'submit', variant: 'primary', disabled: loading }}
                        submitButtonText={'Continuar'}
                        className="space-y-4 text-left">
                        <p className='mb-3'>Formato sugerido: (+57) 311 123 123</p>
                    </FormBuilder>
                </div>
            </div>
        </Card>
    )
}

export default PhoneStep;