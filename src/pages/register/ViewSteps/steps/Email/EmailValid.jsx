import styles from './Email.module.css'
import { Card, Link, Preloader } from "@compratodo/ui-components";
import { useState } from "react";
import { useRegisterFlow } from '../../../../../../core/presentation/hooks';

import CodeInput from '../../../../../components/CodeInput';

const EmailValid = () => {

    const { getEmail, setEmail, validEmailCode } = useRegisterFlow();
    const [loading, setLoading] = useState(false);
    const [resetId, setResetId] = useState(0);
    const [error, setError] = useState();

    const handleSubmit = async (code) => {
        setLoading(true);
        setError(null);
        const errorMsg = await validEmailCode(code);
        if (errorMsg) {
            setError(errorMsg);
        }
        setLoading(false);
    }

    const sendCode = async () => {
        setLoading(true);
        await setEmail();
        setError(null);
        setResetId(Date.now());
        setLoading(false);
    }

    return (
        <Card title="" className={`${styles.card} container flex justify-center items-center`}>
            <div className={`${styles.info} text-center`}>
                <h2>Ingresa el código que te enviamos por correo</h2>
                <p>Lo enviamos al correo {getEmail()}. Si es necesario, puedes actualizar tu correo.</p>
                {error ? <span className='text-[var(--color-danger)]'>* {error}</span> : null}
                <div className="text-left mt-6">
                    <CodeInput length={6} onComplete={handleSubmit} className='justify-center' disabled={loading} resetKey={resetId} />
                </div>
                <div className='py-4 flex justify-center'>
                    {
                        loading ?
                            <Preloader /> : <Link href="#" onClick={() => sendCode()}><span>Reenviar código por SMS</span></Link>
                    }
                </div>
            </div>
        </Card>
    )
}

export default EmailValid;