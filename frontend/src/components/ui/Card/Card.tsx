import React from 'react';
import styles from './Card.module.css';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> & {
  Content: React.FC<React.HTMLAttributes<HTMLDivElement>>;
  Footer: React.FC<React.HTMLAttributes<HTMLDivElement>>;
} = ({ className, hoverable = false, children, ...props }) => {
  const classNames = [
    styles.card,
    hoverable ? styles.hoverable : '',
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
    <div className={`${styles.content} ${className || ''}`} {...props}>
      {children}
    </div>
  );
};

const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children, ...props }) => {
  return (
    <div className={`${styles.footer} ${className || ''}`} {...props}>
      {children}
    </div>
  );
};

Card.Content = CardContent;
Card.Footer = CardFooter;
