import styles from './RegisterEmailStep.module.css'
import { useRegisterFlow } from '../../../hooks/useRegisterFlow';
import { Card, Link, Preloader } from "@compratodo/ui-components";
import { useState } from "react";
import CodeInput from '../../../components/CodeInput';

const RegisterEmailValidStep = () => {

    const { getEmail, setEmail, validEmailCode } = useRegisterFlow();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>();
    const handleSubmit = async (code) => {
        setLoading(true);
        setError(null);
        const errorMsg = await validEmailCode(code);
        if(errorMsg){
            setError(errorMsg);
        }
        setLoading(false);
    }

    return (
        <Card title="" className={`${styles.card} container flex justify-center items-center`}>
            <div className={`${styles.info} text-center`}>
                <h2>Ingresa el código que te enviamos por correo</h2>
                <p>Lo enviamos al correo {getEmail()}. Si es necesario, puedes actualizar tu correo.</p>
                {error ? <span className='text-[var(--color-danger)]'>* {error}</span> : null}
                <div className="text-left mt-6">
                    <CodeInput length={6} onComplete={handleSubmit} className='justify-center' disabled={loading} />
                </div>
                <div className='py-4 flex justify-center'>
                    {
                        loading?
                        <Preloader/> : <Link href="#" onClick={() => setEmail()}><span>Reenviar código por SMS</span></Link>
                    }
                </div>
            </div>
        </Card>
    )
}

export default RegisterEmailValidStep;