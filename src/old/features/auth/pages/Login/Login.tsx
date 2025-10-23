import { LoginAside } from './LoginAside';
import { LoginSectForm } from './LoginForm';
import { useState } from 'react';
import LoginIframe from './LoginIframe';

const LoginPage = async () => {
    const [sessionChecked, setSessionChecked] = useState(false);
    return (
        <>
            <LoginIframe />
            <div className={`grid-2 bg-white min-h-screen`}>
                <LoginSectForm />
                <LoginAside />
            </div>
        </>
    );
};

export default LoginPage;