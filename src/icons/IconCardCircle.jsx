import styles from './IconCardCircle.module.css';

const IconCardCircle = ({
    children,
    styleIcon,
    sectIcon
}) => {
    return (
        <div className={`flex justify-center items-center ${styleIcon}`}>
            <div className={`${styles.sectIcon} rounded-full flex justify-center items-center ${sectIcon ?? styles.widthSectIcon}`}>
                {children}
            </div>
        </div>
    );
}

export default IconCardCircle;