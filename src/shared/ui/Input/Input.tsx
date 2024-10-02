import { useId } from 'react';
import clsx from 'clsx';

import styles from './Input.module.scss';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  errorMessage?: string;
};

export const Input: React.FC<InputProps> = ({
  label,
  className,
  id,
  errorMessage,
  required,
  ...props
}) => {
  const autoId = useId();
  const inputId = id ? id : autoId;

  return (
    <div
      className={clsx(styles.inputContainer, {
        [styles.hasError]: errorMessage,
      })}
    >
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <input
        id={inputId}
        className={clsx(styles.input, className, {
          [styles.errorInput]: errorMessage,
        })}
        aria-required={required}
        aria-invalid={!!errorMessage}
        aria-describedby={errorMessage ? `${inputId}-error` : undefined}
        {...props}
      />
      {errorMessage && (
        <span id={`${inputId}-error`} className={styles.errorMessage}>
          {errorMessage}
        </span>
      )}
    </div>
  );
};
