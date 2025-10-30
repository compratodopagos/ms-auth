export const Terms = ({
    color = "transparent",
    stroke = "var(--color-primary)",
    className = "w-12"
}) => {
    return (
        <svg viewBox="0 0 25 31" fill={color} xmlns="http://www.w3.org/2000/svg" className={className}>
            <path d="M8.25 16.65H16.65M8.25 22.25H12.45M1.25 4.05V26.45C1.25 27.1926 1.545 27.9048 2.0701 28.4299C2.5952 28.955 3.30739 29.25 4.05 29.25H20.85C21.5926 29.25 22.3048 28.955 22.8299 28.4299C23.355 27.9048 23.65 27.1926 23.65 26.45V10.1288C23.65 9.75578 23.5754 9.38654 23.4306 9.04274C23.2859 8.69895 23.074 8.38754 22.8072 8.1268L16.5912 2.048C16.0681 1.53652 15.3656 1.25009 14.634 1.25H4.05C3.30739 1.25 2.5952 1.545 2.0701 2.0701C1.545 2.5952 1.25 3.30739 1.25 4.05Z" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M15.25 1.25V6.85C15.25 7.59261 15.545 8.3048 16.0701 8.8299C16.5952 9.355 17.3074 9.65 18.05 9.65H23.65" stroke={stroke} strokeWidth="2" strokeLinejoin="round" />
        </svg>
    )
}