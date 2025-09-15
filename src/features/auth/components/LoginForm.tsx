import { FormBuilder } from '@compratodo/ui-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { loginForm } from '../schemas';

export const LoginForm = () => {

    const { handleLogin, loading, error } = useAuth();
    const navigate = useNavigate();

    return (
        <>
            {error && <p className="text-red-500 mt-2">{error}</p>}
            <FormBuilder
                schema={loginForm}
                loading={loading}
                onSubmit={async (data) => {
                    const user = await handleLogin(data.email, data.password);
                    if (user) navigate("/dashboard");
                }}
                submitButtonProps={{ type: 'submit', variant: 'primary', className: 'container', disabled: loading }}
                submitButtonText={'Ingresar'}
            ></FormBuilder>
        </>
    );
}