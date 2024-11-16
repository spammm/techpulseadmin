import { useCreateUser } from '../model/useCreateUser';
import { Input, Button, Select } from '../../../shared/ui';
import { rolesOptions } from '../model/selectData';
import styles from './CreateUserForm.module.scss';

export const CreateUserForm: React.FC = () => {
  const { handleChange, handleSubmit, formData, errors, loading } =
    useCreateUser();

  return (
    <form
      onSubmit={handleSubmit}
      className={styles.createUserForm}
      autoComplete="off"
      noValidate
    >
      <Input
        label="Логин"
        name="username"
        value={formData.username}
        onChange={handleChange}
        placeholder="Введите логин"
        required
        aria-required="true"
        aria-invalid={!!errors.username}
        aria-describedby={errors.username ? 'username-error' : undefined}
        errorMessage={errors.username}
        autoComplete="off"
      />
      <Input
        label="Пароль"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Введите пароль"
        type="password"
        required
        aria-required="true"
        aria-invalid={!!errors.password}
        aria-describedby={errors.password ? 'password-error' : undefined}
        errorMessage={errors.password}
        autoComplete="new-password"
      />
      <div className={styles.formGroup}>
        <Select
          label="Роль"
          name="role"
          value={formData.role}
          onChange={handleChange}
          options={rolesOptions}
          required
          aria-required="true"
          aria-invalid={!!errors.role}
          aria-describedby={errors.role ? 'role-error' : undefined}
          errorMessage={errors.role}
          className={styles.select}
        />
      </div>
      <div className={styles.actions}>
        <Button text="Создать" type="submit" loading={loading} />{' '}
        <Button text="Отмена" type="button" />
      </div>
    </form>
  );
};
