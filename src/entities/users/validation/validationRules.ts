import { RegisterOptions, Path, FieldValues } from 'react-hook-form';

export const getUsernameValidation = <TFieldValues extends FieldValues>(
  isClientRole: boolean
): RegisterOptions<TFieldValues, Path<TFieldValues>> => ({
  required: !isClientRole ? 'Логин обязателен!' : false,
  minLength: {
    value: 3,
    message: 'Логин должен быть не менее 3 символов',
  },
});

export const getEmailValidation = <TFieldValues extends FieldValues>(
  isClientRole: boolean
): RegisterOptions<TFieldValues, Path<TFieldValues>> => ({
  required: isClientRole ? 'Email обязателен для клиента!' : false,
  pattern: {
    value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
    message: 'Введите корректный email',
  },
});

export const getPasswordValidation = <
  TFieldValues extends FieldValues & {
    password: string;
    confirmPassword: string;
  }
>(
  watch: (field: Path<TFieldValues>) => string
): RegisterOptions<TFieldValues, Path<TFieldValues>> => ({
  validate: (value: string) =>
    value === watch('confirmPassword' as Path<TFieldValues>) ||
    'Пароли не совпадают!',
  deps: ['confirmPassword'] as Path<TFieldValues>[],
});

export const getConfirmPasswordValidation = <
  TFieldValues extends FieldValues & {
    password: string;
    confirmPassword: string;
  }
>(
  watch: (field: Path<TFieldValues>) => string
): RegisterOptions<TFieldValues, Path<TFieldValues>> => ({
  validate: (value: string) =>
    value === watch('password' as Path<TFieldValues>) || 'Пароли не совпадают!',
  deps: ['password'] as Path<TFieldValues>[],
});
