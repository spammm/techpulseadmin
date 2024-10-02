import { useId } from 'react';
import clsx from 'clsx';

import styles from './Select.module.scss';

type SelectOption = {
  value: string;
  label: string;
};

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  options: SelectOption[];
  errorMessage?: string;
};

export const Select: React.FC<SelectProps> = ({
  label,
  className,
  id,
  options,
  errorMessage,
  disabled,
  ...props
}) => {
  const autoId = useId();
  const selectId = id ? id : autoId;

  return (
    <div
      className={clsx(styles.selectContainer, {
        [styles.hasError]: errorMessage,
      })}
    >
      {label && (
        <label htmlFor={selectId} className={styles.label}>
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={clsx(styles.select, className, {
          [styles.error]: errorMessage,
        })}
        disabled={disabled}
        aria-invalid={!!errorMessage}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {errorMessage && (
        <span className={styles.errorMessage}>{errorMessage}</span>
      )}
    </div>
  );
};
