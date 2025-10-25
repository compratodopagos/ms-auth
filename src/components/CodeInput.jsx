import styles from './CodeInput.module.css';
import React, { useState, useRef, useEffect } from 'react';

const CodeInput = ({
    length = 6,
    onComplete,
    disabled = false,
    className = '',
    resetKey
}) => {
    const [values, setValues] = useState(Array(length).fill(''));
    const inputsRef = useRef([]);

    // Maneja el cambio en cada input
    const handleChange = (index, value) => {
        if (!/^[0-9a-zA-Z]?$/.test(value)) return; // permite solo 1 caracter alfanumérico

        const newValues = [...values];
        newValues[index] = value.slice(-1); // último caracter
        setValues(newValues);

        if (value && index < length - 1) {
            inputsRef.current[index + 1].focus();
        }

        if (newValues.every((v) => v !== '')) {
            onComplete?.(newValues.join(''));
        }
    };

    // Maneja borrado y desplazamiento
    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !values[index] && index > 0) {
            inputsRef.current[index - 1].focus();
        }
    };

    // Permitir pegar un código completo
    const handlePaste = (e) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData('text').slice(0, length);
        if (!pasteData) return;

        const pasteValues = pasteData.split('').slice(0, length);
        const newValues = [...values];
        pasteValues.forEach((char, i) => (newValues[i] = char));
        setValues(newValues);

        // Enfocar último campo lleno
        const nextIndex = Math.min(pasteValues.length, length - 1);
        inputsRef.current[nextIndex].focus();

        if (pasteValues.length === length) {
            onComplete?.(newValues.join(''));
        }
    };

    useEffect(() => {
        setValues(Array(length).fill(''));
        inputsRef.current[0]?.focus();
    }, [resetKey]);

    useEffect(() => {
        inputsRef.current[0]?.focus();
    }, []);

    return (
        <div className={`flex gap-2 ${className}`}>
            {Array.from({ length }).map((_, i) => (
                <input
                    key={i}
                    ref={(el) => {
                        if (el) inputsRef.current[i] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={values[i]}
                    onChange={(e) => handleChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    onPaste={handlePaste}
                    disabled={disabled}
                    className={`${styles.inputCode} w-12 h-12 text-center text-xl border rounded focus:border-blue-500 focus:outline-none`}
                />
            ))}
        </div>
    );
};

export default CodeInput;