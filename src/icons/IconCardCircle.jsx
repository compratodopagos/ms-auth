import './IconCardCircle.css';

const IconCardCircle = ({
    children,
    styleIcon
}) => {
    return (
        <div className={`flex justify-center items-center ${styleIcon}`}>
            <div className="sect-icon rounded-full flex flex justify-center items-center">
                {children}
            </div>
        </div>
    );
}

export default IconCardCircle;