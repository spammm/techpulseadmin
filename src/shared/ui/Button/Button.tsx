import clsx from 'clsx';

import styles from './Button.module.css';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  text?: string;
  loading?: boolean;
  children?: React.ReactNode;
};

export const Button: React.FC<ButtonProps> = ({
  text,
  children,
  loading = false,
  className,
  disabled,
  ...props
}) => {
  return (
    <button
      className={clsx(styles.button, className, { [styles.loading]: loading })}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? 'Загрузка...' : text || children}{' '}
    </button>
  );
};
