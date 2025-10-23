export const FrontDoc = ({
    color = "var(--color-primary)",
    stroke = "var(--color-primary)",
    className = "w-12"
}) => {
    return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 412" fill="white" stroke={stroke} strokeWidth="12" strokeLinecap="round" strokeLinejoin="round">
            {/* Marco de la tarjeta */}
            <rect x="16" y="80" width="480" height="320" rx="24" ry="24" />

            {/* Clip superior */}
            <rect x="221" y="36" width="70" height="80" rx="12" ry="12" fill="white"></rect>

            {/* Foto */}
            <rect x="80" y="176" width="112" height="112" />
            <circle cx="136" cy="222" r="18"></circle>
            <path d="M104 268c-8-10 76-10 64 0"></path>

            {/* Nombre / info */}
            <line x1="224" y1="176" x2="432" y2="176" />
            <line x1="224" y1="224" x2="432" y2="224" />
            <line x1="224" y1="272" x2="432" y2="272" />

            {/* Línea inferior izquierda */}
            <line x1="80" y1="320" x2="128" y2="320" />
        </svg>
    );
}