import styles from './Form.module.css'
import { Button, Link } from '@compratodo/ui-components';
import { FormBuilder } from '@compratodo/ui-components';
import { useNavigate } from 'react-router-dom';
import { loginSchema } from '../../../../schemas';
import { useAuthController } from '../../../../../core/presentation/hooks';

export const SectForm = () => {
    const { loading, error, login } = useAuthController();
    const navigate = useNavigate();

    return (
        <div className={`grid ${styles.grid}`}>
            <div className="flex justify-center items-center">
                <div className={`${styles.form} text-center container p-4`}>
                    <div className="w-100 flex justify-center">
                        <img src="/images/icons/gift.png" width={60} />
                    </div>
                    <h1>Bienvenido de nuevo</h1>
                    <div>
                        <span>Por favor ingresa de nuevo tus datos</span>
                    </div>
                    {error? <span className='text-[var(--color-danger)]'>{error}</span> : '' }
                    <div className={`${styles.links} mt-4 mb-4 p-2 bg-gray-200 rounded-lg flex`}>
                        <Button className={`${styles.btnWhite} bg-white w-50`} onClick={() => navigate("/login")}>Ingreso</Button>
                        <Button className={`${styles.btnGray} bg-gray-200 w-50`} onClick={() => navigate("/register")}>Registro</Button>
                    </div>
                    <FormBuilder
                        schema={loginSchema}
                        onSubmit={login}
                        submitButtonProps={{ type: 'submit', variant: 'primary', disabled: loading, className:"container" }}
                        submitButtonText={'Continuar'}
                        className="space-y-4 text-left">
                        <div className='mt-4 flex justify-center'>
                            <span className='mr-2'>Olvidaste tu contraseña?,</span>
                            <Link
                                href="#"
                                onClick={() => navigate("/recovery")}
                            >
                                Recuperar
                            </Link>
                        </div>
                    </FormBuilder>
                </div>
            </div>
            <footer className={`${styles.copyRight} flex justify-center`}>
                © comprapago.com 2024 - all reserved copyright
            </footer>
        </div>
    );
}