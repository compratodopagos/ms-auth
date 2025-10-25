import { Button, Card } from "@compratodo/ui-components";
import IconCardCircle from "../../icons/IconCardCircle"; // ✅ default import

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
};

export default InfoCard;