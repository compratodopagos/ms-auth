import React, { forwardRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { ChevronDown } from 'lucide-react';

const Select = forwardRef(({
  options = [],
  variant = 'default',
  size = 'md',
  placeholder = 'Selecciona una opción',
  label = '',
  helperText = '',
  errorMessage = '',
  icon = null,
  iconPosition = 'left',
  disabled = false,
  required = false,
  value,
  onChange,
  onFocus,
  onBlur,
  className = '',
  selectClassName = '',
  multiple = false,
  name,
  id,
  autoFocus,
  ...props
}, ref) => {

  const [isFocused, setIsFocused] = useState(false);
  const [internalValue, setInternalValue] = useState();

  const hasError = Boolean(errorMessage);
  const currentVariant = hasError ? 'error' : (isFocused ? 'active' : variant);

  const containerBaseStyles = 'relative flex flex-col w-full';

  const selectBaseStyles = `
    w-full rounded-lg border transition-all duration-200 ease-in-out appearance-none
    focus:outline-none focus:ring-2 focus:ring-offset-1
    disabled:cursor-not-allowed disabled:opacity-60
    bg-[var(--color-bg-input)] text-[var(--color-text-primary)]
  `;

  const variantStyles = {
    default: `
      border-[var(--color-border-default)]
      hover:border-[var(--color-border-strong)]
      focus:border-[var(--color-primary)] focus:ring-[var(--color-focus-ring)]/20
    `,
    active: `
      border-[var(--color-primary)]
      ring-2 ring-[var(--color-focus-ring)]/20
    `,
    error: `
      border-[var(--color-danger)]
      ring-1 ring-[var(--color-danger)]/20
      focus:border-[var(--color-danger)] focus:ring-[var(--color-danger)]/20
    `,
    disabled: `
      bg-[var(--color-bg-elevated)] text-[var(--color-text-muted)] border-[var(--color-border-default)]
      cursor-not-allowed
    `,
    success: `
      border-[var(--color-success)]
      ring-1 ring-[var(--color-success)]/20
      focus:border-[var(--color-success)] focus:ring-[var(--color-success)]/20
    `
  };

  const sizeStyles = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-5 py-4 text-lg'
  };

  const iconStyles = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const paddingWithIcon = {
    left: {
      sm: 'pl-10',
      md: 'pl-12',
      lg: 'pl-14'
    },
    right: {
      sm: 'pr-10',
      md: 'pr-12',
      lg: 'pr-14'
    }
  };

  // Sincroniza valor externo → interno solo si cambia realmente
  useEffect(() => {
    if (value !== undefined && value !== internalValue) {
      setInternalValue(value);
    }
  }, [value]);

  // === Valor mostrado ===
  const displayValue = internalValue ?? value;

  const handleFocus = (e) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  const selectClasses = `
    ${selectBaseStyles}
    ${variantStyles[disabled ? 'disabled' : currentVariant]}
    ${sizeStyles[size]}
    ${icon && iconPosition === 'left' ? paddingWithIcon.left[size] : ''}
    ${icon && iconPosition === 'right' ? paddingWithIcon.right[size] : ''}
    ${selectClassName}
  `.trim().replace(/\s+/g, ' ');

  const changeValue = (e) => {
    const { target } = e;
    if(!internalValue || internalValue !== target.value){
      setInternalValue(target.value);
    }
    if(onChange)
      onChange(e);
  }

  return (
    <div className={`${containerBaseStyles} ${className}`}>
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-(--color-text-secondary) mb-2">
          {label}
          {required && <span className="text-(--color-danger) ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-(--color-text-tertiary) ${iconStyles[size]} pointer-events-none`}>
            {icon}
          </div>
        )}

        <select
          ref={ref}
          id={id}
          name={name}
          value={displayValue}
          onChange={changeValue}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          required={required}
          multiple={multiple}
          autoFocus={autoFocus}
          className={selectClasses}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${id}-error` : helperText ? `${id}-helper` : undefined}
          {...props}
        >
          <option value="" disabled>{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <div className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-(--color-text-tertiary) pointer-events-none ${iconStyles[size]}`}>
          <ChevronDown />
        </div>

        {icon && iconPosition === 'right' && (
          <div className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-(--color-text-tertiary) ${iconStyles[size]} pointer-events-none`}>
            {icon}
          </div>
        )}
      </div>

      {helperText && !hasError && (
        <p id={`${id}-helper`} className="mt-2 text-sm text-(--color-text-caption)">
          {helperText}
        </p>
      )}

      {hasError && (
        <p id={`${id}-error`} className="mt-2 text-sm text-(--color-danger) flex items-center gap-1" role="alert">
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {errorMessage}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

Select.propTypes = {
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    label: PropTypes.string.isRequired
  })),
  variant: PropTypes.oneOf(['default', 'active', 'error', 'disabled', 'success']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  placeholder: PropTypes.string,
  label: PropTypes.string,
  helperText: PropTypes.string,
  errorMessage: PropTypes.string,
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array]),
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  className: PropTypes.string,
  selectClassName: PropTypes.string,
  multiple: PropTypes.bool,
  name: PropTypes.string,
  id: PropTypes.string,
  autoFocus: PropTypes.bool
};

export default Select;