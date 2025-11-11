import React, { useState, forwardRef, useMemo, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';

const Input = forwardRef(({
    type = 'text',
    options = [],
    variant = 'default',
    size = 'md',
    placeholder = '',
    label = '',
    helperText = '',
    errorMessage = '',
    icon = null,
    iconPosition = 'left',
    showPasswordToggle = false,
    disabled = false,
    required = false,
    value,
    onChange,
    onFocus,
    onBlur,
    className = '',
    inputClassName = '',
    currency = '',
    maxLength,
    min,
    max,
    step,
    name,
    id,
    autoComplete,
    autoFocus,
    readOnly,
    inputClassContainer = '',
    ...props
}, ref) => {
    // === Estados internos ===
    const [isFocused, setIsFocused] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [internalValue, setInternalValue] = useState(value ?? '');

    // === Control de errores y variantes ===
    const hasError = Boolean(errorMessage);
    const currentVariant = hasError
        ? 'error'
        : (isFocused && type !== 'radio' ? 'active' : variant);

    // === Estilos dinámicos optimizados ===
    const inputClasses = useMemo(() => `
    rounded-lg border transition-all duration-200 ease-in-out
    disabled:cursor-not-allowed disabled:opacity-60
    placeholder:text-[var(--color-text-tertiary)]
    bg-[var(--color-bg-input)] text-[var(--color-text-primary)]
    ${variant === 'disabled' ? 'cursor-not-allowed' : ''}
    ${variant === 'error' ? 'border-[var(--color-danger)]' : ''}
    ${size === 'sm' ? 'px-3 py-2 text-sm' :
            size === 'lg' ? 'px-5 py-4 text-lg' : 'px-4 py-3 text-base'}
    ${icon && iconPosition === 'left' ? 'pl-10' : ''}
    ${(icon && iconPosition === 'right') || (type === 'password' && showPasswordToggle) ? 'pr-10' : ''}
    ${inputClassName}
  `.trim().replace(/\s+/g, ' '), [
        variant, size, icon, iconPosition, showPasswordToggle, inputClassName
    ]);

    // === Determinar tipo de input actual ===
    const currentType = useMemo(() => {
        if (type === 'password' && showPasswordToggle) {
            return showPassword ? 'text' : 'password';
        }
        if (type === 'price') return 'text';
        return type;
    }, [type, showPasswordToggle, showPassword]);

    // === Manejadores ===
    const handleChange = useCallback((e) => {
        let newValue = e.target.value;

        // Si es radio, tomamos directamente el valor de la opción
        if (type === 'radio') {
            newValue = e.target.value;
        }

        // Formatear precios
        if (type === 'price') {
            newValue = newValue.replace(/[^0-9.]/g, '');
            const parts = newValue.split('.');
            if (parts.length > 2) newValue = parts[0] + '.' + parts.slice(1).join('');
            if (parts[1]?.length > 2) newValue = `${parts[0]}.${parts[1].slice(0, 2)}`;
        }

        // Formatear números
        if (type === 'number') newValue = newValue.replace(/[^0-9.-]/g, '');

        // Solo actualiza si el valor cambió realmente
        setInternalValue((prev) => (prev === newValue ? prev : newValue));

        // Dispara el cambio al padre
        if (onChange) {
            onChange({
                ...e,
                target: { ...e.target, name, value: newValue }
            });
        }
    }, [onChange, name, type, value]);

    const handleFocus = useCallback((e) => {
        setIsFocused(true);
        onFocus?.(e);
    }, [onFocus]);

    const handleBlur = useCallback((e) => {
        setIsFocused(false);
        onBlur?.(e);
    }, [onBlur]);

    const togglePasswordVisibility = useCallback(() => {
        setShowPassword((prev) => !prev);
    }, []);

    // Sincroniza valor externo → interno solo si cambia realmente
    useEffect(() => {
        if (value !== undefined && value !== internalValue) {
            setInternalValue(value);
        }
    }, [value]);

    // === Valor mostrado ===
    const displayValue = internalValue ?? value;

    // === Render del input (memoizado) ===
    const renderInput = useCallback((opt, radio = false) => {
        const style = radio
            ? { width: 19, height: 19 }
            : type === 'price' && currency
                ? { paddingLeft: `${currency.length * 0.6 + 1}rem` }
                : undefined;

        return (
            <input
                ref={ref}
                id={opt.label}
                name={name}
                type={currentType}
                value={radio ? opt.value : displayValue}
                checked={radio ? displayValue === opt.value : undefined}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                placeholder={placeholder}
                disabled={disabled}
                required={required}
                readOnly={readOnly}
                autoComplete={autoComplete}
                autoFocus={autoFocus}
                maxLength={maxLength}
                min={min}
                max={max}
                step={step}
                className={`${inputClasses} ${!radio && 'w-full'}`}
                style={style}
                aria-invalid={hasError}
                aria-describedby={hasError ? `${id}-error` : helperText ? `${id}-helper` : undefined}
                {...props}
            />
        );
    }, [
        ref, name, currentType, displayValue, handleChange, handleFocus, handleBlur,
        placeholder, disabled, required, readOnly, autoComplete, autoFocus,
        maxLength, min, max, step, inputClasses, hasError, id, helperText, props, currency, type
    ]);

    // === Render principal ===
    return (
        <div className={`relative flex flex-col w-full ${className}`}>
            {/* Label */}
            {label && type !== 'radio' && (
                <label htmlFor={id} className="block text-sm font-medium text-text-secondary mb-2">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
            )}

            {/* Contenedor del input */}
            <div className={`relative ${inputClassContainer}`}>
                {/* Icono izquierdo */}
                {icon && iconPosition === 'left' && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        {icon}
                    </div>
                )}

                {/* Símbolo de moneda */}
                {type === 'price' && currency && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 font-medium pointer-events-none">
                        {currency}
                    </div>
                )}

                {/* Radio buttons */}
                {type === 'radio'
                    ? options.map((opt) => (
                        <div key={opt.value} className="flex justify-between border-b border-gray-200 px-2 items-center">
                            <label htmlFor={opt.value} className="w-full cursor-pointer py-2">{opt.label}</label>
                            {renderInput(opt, true)}
                        </div>
                    ))
                    : renderInput({ label: id })
                }

                {/* Icono derecho */}
                {icon && iconPosition === 'right' && !showPasswordToggle && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        {icon}
                    </div>
                )}

                {/* Botón de mostrar/ocultar contraseña */}
                {type === 'password' && showPasswordToggle && (
                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                        aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    >
                        {showPassword ? '🙈' : '👁️'}
                    </button>
                )}
            </div>

            {/* Texto de ayuda */}
            {helperText && !hasError && (
                <p id={`${id}-helper`} className="mt-2 text-sm text-gray-500">{helperText}</p>
            )}

            {/* Mensaje de error */}
            {hasError && (
                <p id={`${id}-error`} className="mt-2 text-[12px] text-red-600 flex items-center gap-1" role="alert">
                    ⚠️ {errorMessage}
                </p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

Input.propTypes = {
    type: PropTypes.oneOf(['text', 'email', 'password', 'number', 'tel', 'url', 'search', 'price', 'radio']),
    variant: PropTypes.oneOf(['default', 'active', 'error', 'disabled', 'success']),
    size: PropTypes.oneOf(['sm', 'md', 'lg']),
    placeholder: PropTypes.string,
    label: PropTypes.string,
    helperText: PropTypes.string,
    errorMessage: PropTypes.string,
    icon: PropTypes.node,
    iconPosition: PropTypes.oneOf(['left', 'right']),
    showPasswordToggle: PropTypes.bool,
    disabled: PropTypes.bool,
    required: PropTypes.bool,
    readOnly: PropTypes.bool,
    autoFocus: PropTypes.bool,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    className: PropTypes.string,
    inputClassName: PropTypes.string,
    currency: PropTypes.string,
    maxLength: PropTypes.number,
    min: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    max: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    step: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    name: PropTypes.string,
    id: PropTypes.string,
    autoComplete: PropTypes.string,
    inputClassContainer: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })),
};

export default Input;
