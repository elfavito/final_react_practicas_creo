import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'unstyled';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', fullWidth, children, ...props }, ref) => {
    const baseClasses = "inline-flex items-center justify-center font-medium transition-colors duration-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed";
    
    // Si className provee colores explícitos de fondo o texto, no forzar variantClasses que colisionen
    const hasCustomBg = className && /(^|\s)(!?)bg-/.test(className);
    const hasCustomText = className && /(^|\s)(!?)text-/.test(className);

    const variantClasses = {
      primary: `${hasCustomBg ? '' : 'bg-indigo-500 hover:bg-indigo-600'} ${hasCustomText ? '' : 'text-white'}`.trim(),
      secondary: `${hasCustomBg ? '' : 'bg-pink-500 hover:bg-pink-600'} ${hasCustomText ? '' : 'text-white'}`.trim(),
      ghost: `${hasCustomBg ? '' : 'bg-transparent hover:bg-slate-800'} ${hasCustomText ? '' : 'text-slate-100'}`.trim(),
      unstyled: ''
    };
    
    const sizeClasses = {
      sm: "px-3 py-1.5 text-sm",
      md: "px-4 py-2 text-base",
      lg: "px-6 py-3 text-lg"
    };

    const classNames = [
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      fullWidth ? "w-full" : "",
      className
    ].filter(Boolean).join(' ');

    return (
      <button ref={ref} className={classNames} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

