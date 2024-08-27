import React from 'react';
import styles from './Button.module.css';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  text: string;
};

export const Button: React.FC<ButtonProps> = ({
  text,
  className,
  ...props
}) => {
  return (
    <button className={`${styles.button} ${className}`} {...props}>
      {text}
    </button>
  );
};
