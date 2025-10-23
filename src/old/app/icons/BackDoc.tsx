export const BackDoc = ({
    color = "var(--color-primary)",
    stroke = "var(--color-primary)",
    className = "w-12"
}) => {
    return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 412" fill="none" stroke={stroke} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round">
            <rect x="16" y="64" width="480" height="320" rx="32" ry="32"></rect>
            <line x1="60" y1="128" x2="256" y2="128"></line>
            <line x1="60" y1="160" x2="256" y2="160"></line>
            <rect x="350" y="112" width="96" height="96" rx="16" ry="16"></rect>
            <line x1="370" y1="136" x2="425" y2="136"></line>
            <line x1="370" y1="160" x2="425" y2="160"></line>
            <line x1="370" y1="184" x2="425" y2="184"></line>
            <path d="M55 255 v80 h40 m35 0 h60 m35 0 h60 m35 0 h60 m35 0 h40 v-80"> </path>
        </svg>
    );
}