import {
  Controller,
  Control,
  RegisterOptions,
  Path,
  FieldValues,
} from 'react-hook-form';
import { Textarea } from '..';
import styles from './TextAreaField.module.scss';

type TextAreaFieldProps<TFieldValues extends FieldValues> = {
  name: Path<TFieldValues>;
  control: Control<TFieldValues>;
  label: string;
  placeholder?: string;
  rules?: Omit<
    RegisterOptions<TFieldValues, Path<TFieldValues>>,
    'setValueAs' | 'disabled' | 'valueAsNumber' | 'valueAsDate'
  >;
};

export const TextAreaField = <TFieldValues extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  rules,
}: TextAreaFieldProps<TFieldValues>) => (
  <Controller
    name={name}
    control={control}
    rules={rules}
    render={({ field, fieldState: { error } }) => (
      <div className={styles.textAreaField}>
        <Textarea
          {...field}
          label={label}
          placeholder={placeholder}
          errorMessage={error?.message}
        />
      </div>
    )}
  />
);
