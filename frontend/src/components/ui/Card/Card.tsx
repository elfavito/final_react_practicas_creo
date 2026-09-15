import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> & {
  Content: React.FC<React.HTMLAttributes<HTMLDivElement>>;
  Footer: React.FC<React.HTMLAttributes<HTMLDivElement>>;
} = ({ className, hoverable = false, children, ...props }) => {
  const classNames = [
    "bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col transition-shadow duration-300",
    hoverable ? "hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600" : "",
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classNames} {...props}>
      {children}
    </div>
  );
};

const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => {
  return (
    <div className={`p-4 flex-1 ${className || ''}`} {...props}>
      {children}
    </div>
  );
};

const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => {
  return (
    <div className={`p-4 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 mt-auto ${className || ''}`} {...props}>
      {children}
    </div>
  );
};

Card.Content = CardContent;
Card.Footer = CardFooter;
