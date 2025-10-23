import { Button, Card } from '@compratodo/ui-components';
import { BusinnessBold, WalletBold } from '../../../../../app/icons';
import IconCardCircle from '../../../components/IconCardCircle';
import { useRegisterFlow } from '../../../hooks/useRegisterFlow';

const InfoCard = ({
    title,
    description,
    icon,
    buttonVariant = 'primary',
    buttonText,
    buttonOnClick
}) => {
    return (
        <Card title="" border={false} className='flex justify-center items-center'>
            <div style={{ maxWidth: '300px' }}>
                <IconCardCircle>{icon}</IconCardCircle>
                <div className="mt-4 mb-4">
                    <h4>{title}</h4>
                    <p>{description}</p>
                </div>
                <div className='flex justify-center'>
                    <Button variant={buttonVariant} onClick={buttonOnClick}>{buttonText}</Button>
                </div>
            </div>
        </Card>
    );
}

const RegisterTypeAccount = () => {
    const { setAccount } = useRegisterFlow();
    return (
        <div className='text-center'>
            <div className="flex justify-center">
                <div className="info">
                    <h1>Elige tu tipo de cuenta</h1>
                    <p>Selecciona el tipo de cuenta que mejor se adapte a tus necesidades. Gestiona tus pagos de manera segura y eficiente.</p>
                </div>
            </div>
            <div className="grid-2">
                <InfoCard
                    icon={<WalletBold />}
                    title="Cuenta Personal"
                    description="Necesitas tener tu Cédula contigo para crear una cuenta personal."
                    buttonText="Crear cuenta personal"
                    buttonOnClick={async () => await setAccount('personal')}
                />
                <InfoCard
                    icon={<BusinnessBold />}
                    title="Cuenta para empresa"
                    description="Necesitas tener el NIT,  tu documento Y SER EL REPRESENTANTE LEGAL."
                    buttonText="Crear cuenta empresa"
                    buttonOnClick={async () => await setAccount('business')}
                />
            </div>
        </div>
    );
}

export default RegisterTypeAccount;