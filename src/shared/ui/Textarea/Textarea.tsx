import { useId } from 'react';
import clsx from 'clsx';

import styles from './Textarea.module.css';

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  errorMessage?: string;
};

export const Textarea: React.FC<TextareaProps> = ({
  label,
  className,
  id,
  errorMessage,
  disabled,
  ...props
}) => {
  const autoId = useId();
  const textareaId = id ? id : autoId;

  return (
    <div
      className={clsx(styles.textareaContainer, {
        [styles.hasError]: errorMessage,
      })}
    >
      {label && (
        <label htmlFor={textareaId} className={styles.label}>
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={clsx(styles.textarea, className, {
          [styles.error]: errorMessage,
        })}
        disabled={disabled}
        aria-invalid={!!errorMessage}
        {...props}
      />
      {errorMessage && (
        <span className={styles.errorMessage}>{errorMessage}</span>
      )}
    </div>
  );
};
