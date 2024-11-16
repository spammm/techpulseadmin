import React, { useId } from 'react';
import clsx from 'clsx';

import styles from './Textarea.module.scss';

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  errorMessage?: string;
};

export const Textarea: React.FC<TextareaProps> = React.forwardRef<
  HTMLTextAreaElement,
  TextareaProps
>(({ label, className, id, errorMessage, disabled, ...props }, ref) => {
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
        ref={ref}
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
});
