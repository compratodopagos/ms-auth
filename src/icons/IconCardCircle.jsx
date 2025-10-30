import './IconCardCircle.css';

const IconCardCircle = ({
    children,
    styleIcon,
    sectIcon
}) => {
    return (
        <div className={`flex justify-center items-center ${styleIcon}`}>
            <div className={`sect-icon rounded-full flex flex justify-center items-center ${sectIcon}`}>
                {children}
            </div>
        </div>
    );
}

export default IconCardCircle;