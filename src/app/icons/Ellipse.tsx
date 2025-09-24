export const Ellipse = ({
    color = "var(--color-primary)",
    stroke = "var(--color-primary)",
    className = "w-12"
}) => {
    return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="45 45 420 420" fill={color} stroke={stroke}>
            <circle cx="256" cy="256" r="192"
                style={{
                    fill: 'none',
                    stroke: stroke,
                    strokeLinecap: 'round',
                    strokeLinejoin: 'round',
                    strokeWidth: '32px'
                }}>
            </circle>
        </svg>
    );
}