import React from 'react';
import PropTypes from 'prop-types';

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'sm',
  icon = null,
  iconPosition = 'left',
  className = '',
  disabled = false,
  onClick,
  ...props
}) => {
  // Base styles usando variables CSS personalizadas
  const baseStyles = `
    flex items-center justify-center gap-2 rounded-md font-medium 
    transition-all duration-200 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-offset-2
    border border-transparent shadow-sm
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  // Variant styles usando el sistema de tokens CSS
  const variantStyles = {
    primary: `
      bg-[var(--color-primary)] text-[var(--color-text-inverse)]
      hover:opacity-90 focus:ring-[var(--color-focus-ring)]
    `,
    accent: `
      bg-[var(--color-accent)] text-[var(--color-text-fixed)]
      hover:opacity-90 focus:ring-[var(--color-focus-ring)]
    `,
    secondary: `
      bg-[var(--color-secondary)] text-[var(--color-text-fixed)]
      hover:opacity-90 focus:ring-[var(--color-focus-ring)]
    `,
    light: `
      bg-[var(--color-button-light-bg)] text-[var(--color-button-light-text)]
       focus:ring-[var(--color-focus-ring)] 
    `,
    danger: `
      bg-[var(--color-button-danger-bg)] text-[var(--color-button-danger-text)]
      hover:bg-[var(--color-button-danger-hover)] focus:ring-[var(--color-focus-ring)]
    `, 
    warning: `
      bg-[var(--color-button-warning-bg)] text-[var(--color-button-warning-text)]
      hover:bg-[var(--color-button-warning-hover)] focus:ring-[var(--color-focus-ring)]
    `,
    success: `
      bg-[var(--color-button-success-bg)] text-[var(--color-button-success-text)]
      hover:bg-[var(--color-button-success-hover)] focus:ring-[var(--color-focus-ring)]
    `,
    info: `
      bg-[var(--color-button-info-bg)] text-[var(--color-button-info-text)]
      hover:bg-[var(--color-button-info-hover)] focus:ring-[var(--color-focus-ring)]
    `,
    outline: `
      bg-transparent text-[var(--color-button-outline-text)]
      border border-[var(--color-button-outline-text)]
      hover:bg-[var(--color-button-outline-hover)] focus:ring-[var(--color-focus-ring)]
    `,
  };

  // Size styles
  const sizeStyles = {
    xs: 'text-xs px-3 py-2',
    sm: 'text-sm px-5 py-3',
    lg: 'text-base px-4 py-3',
  };
  

  // Icon spacing
  const iconSpacing = {
    left: icon ? 'space-x-2' : '',
    right: icon ? 'space-x-2 flex-row-reverse' : '',
  };

  // Disabled styles
  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

  const buttonClasses = `
    ${baseStyles}
    ${variantStyles[variant] || variantStyles.primary}
    ${sizeStyles[size] || sizeStyles.sm}
    ${iconSpacing[iconPosition]}
    ${disabledStyles}
    ${className}
  `;

  // Icon size based on button size
  const iconSize = size === 'xs' ? 'w-3 h-3' : size === 'sm' ? 'w-5 h-5 ' : 'w-5 h-5';

  return (
    <button
      type={type}
      className={buttonClasses}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {icon && iconPosition === 'left' && (
        <span className={iconSize}>{icon}</span>
      )}
      {children}
      {icon && iconPosition === 'right' && (
        <span className={iconSize}>{icon}</span>
      )}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  variant: PropTypes.oneOf(['primary', 'accent', 'secondary', 'light', 'danger', 'warning', 'success', 'info']),
  size: PropTypes.oneOf(['xs', 'sm', 'lg']),
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  className: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
};

export default Button;