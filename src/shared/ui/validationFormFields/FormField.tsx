import {
  Controller,
  Control,
  RegisterOptions,
  Path,
  FieldValues,
} from 'react-hook-form';
import { Input } from '..';
import styles from './FormField.module.scss';

type FormFieldProps<TFieldValues extends FieldValues> = {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  label: string;
  placeholder?: string;
  type?: string;
  rules?: Omit<
    RegisterOptions<TFieldValues, Path<TFieldValues>>,
    'setValueAs' | 'disabled' | 'valueAsNumber' | 'valueAsDate'
  >;
  disabled?: boolean;
};

export const FormField = <TFieldValues extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  type = 'text',
  rules,
  disabled,
}: FormFieldProps<TFieldValues>) => (
  <Controller
    name={name}
    control={control}
    rules={rules}
    render={({ field, fieldState: { error } }) => (
      <div className={styles.formField}>
        <Input
          {...field}
          label={label}
          placeholder={placeholder}
          type={type}
          disabled={disabled}
          errorMessage={error?.message}
        />
      </div>
    )}
  />
);
