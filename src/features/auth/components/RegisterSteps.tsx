import { Card, Button } from '@compratodo/ui-components';
import IconCardCircle from './IconCardCircle';
import { MailPlus } from 'lucide-react';

const RegisterSteps = () => {
    return (
        <div className="text-center">
            <div className="flex justify-center mb-4">
                <div className="info">
                    <h1>Configura y Protege Tu Cuenta</h1>
                    <p>Sigue estos pasos para asegurar y personalizar el acceso a tu cuenta:</p>
                </div>
            </div>
            <Card title="">
                <Card title="" className="grid-3 terms mb-2">
                    <IconCardCircle><MailPlus/></IconCardCircle>

                    <div className='text-left'>
                        <label>Proporciona tu correo electrónico</label>
                        <p>Te enviaremos información importante sobre tu cuenta.</p>
                    </div>

                    <Button type="button" variant="accent">
                        <b>Consultar</b>
                    </Button>
                </Card>
            </Card>
        </div>
    );
}

export default RegisterSteps;