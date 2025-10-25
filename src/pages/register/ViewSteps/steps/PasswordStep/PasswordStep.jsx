import styles from './PasswordStep.module.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Validators, Card, FormBuilder } from '@compratodo/ui-components';
import { useRegisterFlow } from '../../../../../../core/presentation/hooks';
import { passwordStep, passwordItemsValid } from '../../../../../schemas';
import { ItemPasswordValidUI } from '../../../../../components/steps/ItemPasswordValidUI';

const PasswordStep = () => {
    const navigate = useNavigate();
    const { setPassword, getEmail } = useRegisterFlow();
    const [loading, setLoading] = useState(false);
    const [inputPassword, setInputPassword] = useState('');
    const [confirmInputPassword, setConfirmInputPassword] = useState('');
    const [error, setError] = useState({ uncheck: true });
    
    useEffect(() =>{
        if(!getEmail()){
            navigate('/register/steps/email');
        }
    },[])

    const validPassword = (password) => {
        setInputPassword(password);
        validPass(password, confirmInputPassword);
        return true;
    };

    const validConfirmPassword = (confirmPassword) => {
        setConfirmInputPassword(confirmPassword);
        validPass(inputPassword, confirmPassword);
        return true;
    };

    const validPass = (password, confirmPassword) => {
        const errors = Validators.validatePassword(password);
        setError({ ...errors, confirm_password: password !== confirmPassword });
    };

    const handleSubmit = async (values) => {
        const { password, confirm_password } = values;
        setLoading(true);

        if (password !== confirm_password) {
            setError({ confirm_password: true });
            setLoading(false);
            return;
        }

        const errorMsg = await setPassword(password, confirm_password);
        if (errorMsg) {
            setError(errorMsg);
            setLoading(false);
            return;
        }

        setTimeout(() => {
            localStorage.removeItem('e');
            localStorage.removeItem('tA');
            localStorage.removeItem('terms');
        }, 1000);

        setLoading(false);
    };

    const hasError = () => {
        return Object.values(error).some((e) => e);
    };

    return (
        <Card
            title=""
            className={`${styles.card} container flex justify-center items-center`}
        >
            <div className={`${styles.info} text-center`}>
                <h2>Crear tu contraseña</h2>
                <p>
                    Elige una contraseña segura, asegúrate de que sea única y fácil de
                    recordar
                </p>
                <div className="text-left mt-6">
                    <FormBuilder
                        schema={passwordStep(validPassword, validConfirmPassword)}
                        onSubmit={handleSubmit}
                        submitButtonProps={{
                            type: 'submit',
                            variant: 'primary',
                            disabled: hasError() || loading,
                        }}
                        submitButtonText="Continuar"
                    >
                        <div>
                            {passwordItemsValid.map((item, key) => (
                                <ItemPasswordValidUI
                                    label={item.label}
                                    validator={item.error}
                                    errors={error}
                                    key={key}
                                />
                            ))}
                        </div>
                    </FormBuilder>
                </div>
            </div>
        </Card>
    );
};

export default PasswordStep;