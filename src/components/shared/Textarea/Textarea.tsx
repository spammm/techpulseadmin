import React from 'react';
import styles from './Textarea.module.css';

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
};

export const Textarea: React.FC<TextareaProps> = ({
  label,
  className,
  ...props
}) => {
  return (
    <div className={styles.textareaContainer}>
      {label && <label className={styles.label}>{label}</label>}
      <textarea className={`${styles.textarea} ${className}`} {...props} />
    </div>
  );
};
