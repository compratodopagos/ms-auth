import { Button, Link } from '@compratodo/ui-components';
import { useNavigate } from 'react-router-dom';
import { LoginForm } from '../../components/LoginForm';

export const LoginSectForm = () => {
    const navigate = useNavigate();
    return (
        <div className='grid'>
            <div className="flex justify-center items-center">
                <div className="form text-center container p-4">
                    <div className="w-100 flex justify-center">
                        <img src="/images/icons/gift.png" width={60} />
                    </div>
                    <h1>Bienvenido de nuevo</h1>
                    <div>
                        <span>Por favor ingresa de nuevo tus datos</span>
                    </div>
                    <div className="links mt-4 mb-4 p-2 bg-gray-200 rounded-lg flex">
                        <Button className='bg-white w-50' onClick={() => navigate("/login")}>Ingreso</Button>
                        <Button className='bg-gray-200 w-50' onClick={() => navigate("/register")}>Registro</Button>
                    </div>
                    <LoginForm />
                    <div className='mt-4 flex justify-center'>
                        <span className='mr-2'>Olvidaste tu contraseña?,</span>
                        <Link
                            href="#"
                            onClick={() => navigate("/recovery")}
                        >
                            Recuperar
                        </Link>
                    </div>
                </div>
            </div>
            <footer className='copy-right flex justify-center'>
                © comprapago.com 2024 - all reserved copyright
            </footer>
        </div>
    );
}