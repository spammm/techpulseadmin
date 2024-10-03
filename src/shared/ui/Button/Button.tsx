import clsx from 'clsx';

import styles from './Button.module.scss';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  text?: string;
  loading?: boolean;
  children?: React.ReactNode;
  variant?: 'primary' | 'icon';
};

export const Button: React.FC<ButtonProps> = ({
  text,
  children,
  variant = 'primary',
  loading = false,
  className,
  disabled,
  ...props
}) => {
  return (
    <button
      className={clsx(styles.button, className, {
        [styles[variant]]: variant,
        [styles.loading]: loading,
      })}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? 'Загрузка...' : text || children}
    </button>
  );
};
