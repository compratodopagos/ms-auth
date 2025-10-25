import styles from './PhoneStep.module.css'
import { useRegisterFlow } from '../../../../../../core/presentation/hooks';
import { Card, Link, Preloader } from "@compratodo/ui-components";
import { useState } from "react";
import CodeInput from '../../../../../components/CodeInput';

const RegisterPhoneValidStep = () => {

    const { setPhone, validPhoneCode, phone } = useRegisterFlow();
    const [loading, setLoading] = useState(false);
    const [resetId, setResetId] = useState(0);
    const [error, setError] = useState();

    const handleSubmit = async (code) => {
        setLoading(true);
        setError(null);
        const errorMsg = await validPhoneCode(code);
        if(errorMsg){
            setError(errorMsg);
        }
        setLoading(false);
    }

    const sendCode = async () => {
        setLoading(true);
        await setPhone();
        setError(null);
        setResetId(Date.now());
        setLoading(false);
    }

    return (
        <Card title="" className={`${styles.card} container flex justify-center items-center`}>
            <div className={`${styles.info} text-center`}>
                <h2>Ingresa el código que te enviamos por SMS</h2>
                <p>Lo enviamos al +57 {phone}. Si es necesario, puedes actualizar tu número.</p>
                {error ? <span className='text-[var(--color-danger)]'>* {error}</span> : null}
                <div className="text-left mt-6">
                    <CodeInput length={6} onComplete={handleSubmit} className='justify-center' disabled={loading} resetKey={resetId} />
                </div>
                <div className='py-4 flex justify-center'>
                    {
                        loading?
                        <Preloader/> : <Link href="#" onClick={() => sendCode()}><span>Reenviar código por SMS</span></Link>
                    }
                </div>
            </div>
        </Card>
    )
}

export default RegisterPhoneValidStep;