import React from 'react';

const Preloader = ({ size = 'sm', color = 'primary', className = '' }) => {
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-10 h-10'
  };

  const colorClasses = {
    primary: 'border-[var(--color-primary)]',
    white: 'border-[var(--color-text-inverse)]',
    gray: 'border-[var(--color-text-secondary)]',
    blue: 'border-[var(--color-info)]',
    green: 'border-[var(--color-success)]',
    red: 'border-[var(--color-danger)]'
  };

  return (
    <div
    style={{ marginLeft: '0px'}}
      className={`inline-block m-0 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] ${
        sizeClasses[size]
      } ${
        colorClasses[color]
      } ${className}`}
      role="status"
    >
      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
        Cargando...
      </span>
    </div>
  );
};

export default Preloader;