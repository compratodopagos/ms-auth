export const Upload = ({
    color = "var(--color-primary)",
    stroke = "var(--color-primary)",
    className = "w-12",
    width = 15,
    height = 15
}) => {
    return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="14 13 12 17" fill={color} stroke={stroke} width={width} height={height}>
            <g>
                <g>
                    <g>
                        <g style={{ transform: 'translateY(2px)' }}>
                            <g>
                                <path d="M23,16.5c-0.1,0-0.3,0-0.4-0.1L20,13.7l-2.6,2.6c-0.2,0.2-0.5,0.2-0.7,0s-0.2-0.5,0-0.7l3-3 c0.2-0.2,0.5-0.2,0.7,0l3,3c0.2,0.2,0.2,0.5,0,0.7C23.3,16.5,23.1,16.5,23,16.5z"/>
                            </g>
                            <g>
                                <path d="M20,22c-0.3,0-0.5-0.2-0.5-0.5v-8c0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5v8C20.5,21.8,20.3,22,20,22z"/>
                            </g>
                        </g>
                        <g>
                            <path d="M25,27.5H15c-1.4,0-2.5-1.1-2.5-2.5v-2c0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5v2c0,0.8,0.7,1.5,1.5,1.5 h10c0.8,0,1.5-0.7,1.5-1.5v-2c0-0.3,0.2-0.5,0.5-0.5s0.5,0.2,0.5,0.5v2C27.5,26.4,26.4,27.5,25,27.5z"/>
                        </g>
                    </g>
                </g>
            </g>
            </svg>
    );
}