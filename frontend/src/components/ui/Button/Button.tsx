import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', fullWidth, children, ...props }, ref) => {
    const baseClasses = "inline-flex items-center justify-center font-medium transition-colors duration-200 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed";
    
    const variantClasses = {
      primary: "bg-indigo-500 hover:bg-indigo-600 text-white",
      secondary: "bg-pink-500 hover:bg-pink-600 text-white",
      ghost: "bg-transparent hover:bg-slate-800 text-slate-100"
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
