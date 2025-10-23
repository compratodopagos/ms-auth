import './IconCardCircle.css';

const IconCardCircle = ({
    children
}) => {
    return (
        <div className='flex justify-center items-center'>
            <div className="sect-icon rounded-full flex flex justify-center items-center">
                {children}
            </div>
        </div>
    );
}

export default IconCardCircle;