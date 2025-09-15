import CheckSession from './checkSession';
import './Login.css';
import { LoginAside } from './LoginAside';
import { LoginSectForm } from './LoginForm';
import { useState } from 'react';

const LoginPage = async () => {
    const [sessionChecked, setSessionChecked] = useState(false);
    return (
        !sessionChecked ? 
            <CheckSession setSessionChecked={setSessionChecked} />
        :
        <div className='LoginLayout grid-2 bg-white min-h-screen'>
            <LoginSectForm />
            <LoginAside />
        </div>
    );
};

export default LoginPage;
