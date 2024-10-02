import { InputHTMLAttributes, useId } from 'react';
import clsx from 'clsx';

import styles from './Checkbox.module.css';

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  id?: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  id,
  label,
  checked,
  onChange,
  disabled = false,
  className,
  ...props
}) => {
  const newId = useId();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!disabled) {
      onChange(e.target.checked);
    }
  };

  return (
    <div className={clsx(styles.checkboxContainer, className)}>
      <input
        id={id || newId}
        className={clsx(styles.checkboxInput, { [styles.disabled]: disabled })}
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
        {...props}
      />
      <label
        htmlFor={id || newId}
        className={clsx(styles.checkboxLabel, {
          [styles.disabledLabel]: disabled,
        })}
      >
        {label}
      </label>
    </div>
  );
};
