export const CheckCircle = ({
    color = "var(--color-primary)",
    stroke = "var(--color-accent)",
    className = "w-12"
}) => {
    return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="2 2 20 20">
            <circle cx="12" cy="12" r="10" fill={color}/>
            <path d="M7.8 12.2l3.39 3 5-7" fill="none" stroke={stroke} strokeWidth={2}/>
        </svg>
    );
}