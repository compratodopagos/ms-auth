export const ErrorFilled = ({
    color = "var(--color-primary)",
    stroke = "var(--color-primary)",
    className = "w-12"
}) => {
    return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="2 2 20 20">
            <circle cx="12" cy="12" r="10" fill={color} />
            <path d="M15.3 9 L9 15.3 M9 9 L15.3 15.3" stroke={stroke} strokeWidth="2"/>
        </svg>
    );
}