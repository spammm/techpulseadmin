import { useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Checkbox,
  Button,
  Select,
  ContactForm,
  Notification,
  TextAreaField,
  FormField,
} from '../../../shared/ui';
import {
  getUsernameValidation,
  getEmailValidation,
  getPasswordValidation,
  getConfirmPasswordValidation,
} from '../validation/validationRules';
import { rolesOptions } from '../model/selectData';
import { useEditUser } from './../model/useEditUser';
import type { EditUserFormProps, FormData } from '../types/editFormTypes';
import styles from './EditUserForm.module.scss';

export const EditUserForm: React.FC<EditUserFormProps> = ({ userProfile }) => {
  const { defaultValues, isLoading, notification, onSubmit, setNotification } =
    useEditUser(userProfile);

  const {
    handleSubmit,
    control,
    watch,
    trigger,
    reset,
    formState: { isValid },
  } = useForm<FormData>({
    mode: 'onChange',
    defaultValues,
  });

  const isClientRole = watch('role') === 'client';

  const handleReset = useCallback(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  return (
    <div className={styles.editUserForm}>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset disabled={isLoading}>
          <FormField<FormData>
            name="username"
            control={control}
            label="Логин"
            placeholder="Введите логин"
            rules={getUsernameValidation(isClientRole)}
            disabled={isClientRole}
          />

          <FormField<FormData>
            name="email"
            control={control}
            label="Email"
            placeholder="Введите email"
            rules={getEmailValidation(isClientRole)}
          />

          <FormField<FormData>
            name="firstName"
            control={control}
            label="Имя"
            placeholder="Введите имя"
          />

          <FormField<FormData>
            name="lastName"
            control={control}
            label="Фамилия"
            placeholder="Введите фамилию"
          />

          <FormField<FormData>
            name="publicAlias"
            control={control}
            label="Псевдоним"
            placeholder="Введите псевдоним"
          />

          <TextAreaField<FormData>
            name="about"
            control={control}
            label="О себе"
            placeholder="Расскажите о себе"
          />

          <TextAreaField<FormData>
            name="note"
            control={control}
            label="Заметки"
            placeholder="Заметки"
          />

          <Controller
            name="contacts"
            control={control}
            render={({ field }) => (
              <ContactForm
                initialContacts={field.value}
                onContactsChange={field.onChange}
              />
            )}
          />

          <Controller
            name="disable"
            control={control}
            render={({ field }) => (
              <Checkbox
                id="disable"
                label="Заблокировать профиль"
                checked={!!field.value}
                onChange={field.onChange}
              />
            )}
          />

          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <Select
                id="role"
                value={field.value}
                options={rolesOptions}
                onChange={(e) => {
                  field.onChange(e);
                  trigger('username');
                }}
              />
            )}
          />

          <FormField<FormData>
            name="password"
            control={control}
            label="Пароль"
            placeholder="Введите новый пароль"
            type="password"
            rules={getPasswordValidation<FormData>(watch)}
          />

          <FormField<FormData>
            name="confirmPassword"
            control={control}
            label="Подтверждение пароля"
            placeholder="Подтвердите новый пароль"
            type="password"
            rules={getConfirmPasswordValidation<FormData>(watch)}
          />
        </fieldset>

        <div className={styles.actions}>
          <Button
            text="Сохранить изменения"
            type="submit"
            loading={isLoading}
            disabled={isLoading || !isValid}
          />
          <Button
            text="Отменить изменения"
            type="button"
            onClick={handleReset}
            disabled={isLoading}
          />
        </div>
      </form>
    </div>
  );
};
