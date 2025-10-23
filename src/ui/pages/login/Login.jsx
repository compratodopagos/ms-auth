import { Aside, SectForm } from './components';
import AuthIframe from '../../components/AuthIframe';

const Login = () => {
    return (
        <>
            <AuthIframe redirect={false} />
            <div className={`grid-2 bg-white min-h-screen`}>
                <SectForm />
                <Aside />
            </div>
        </>
    );
};

export default Login;