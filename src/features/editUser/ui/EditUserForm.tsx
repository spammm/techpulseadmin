import { useState } from 'react';
import {
  Checkbox,
  Input,
  Button,
  Select,
  Textarea,
  ContactForm,
  Notification,
} from '../../../shared/ui';
import { useAppDispatch } from '../../../app/appStore';
import { updateUserProfile } from '../../../shared/model/store/userSlice';
import { IUser } from '../../../shared/types/user';

import styles from './EditUserForm.module.scss';

type EditUserFormProps = {
  userProfile: IUser;
};

export const EditUserForm: React.FC<EditUserFormProps> = ({ userProfile }) => {
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState({
    username: userProfile.username || '',
    email: userProfile.email || '',
    firstName: userProfile.firstName || '',
    lastName: userProfile.lastName || '',
    publicAlias: userProfile.publicAlias || '',
    note: userProfile.note || '',
    about: userProfile.about || '',
    contacts: userProfile.contacts || [{ name: '', value: '' }],
    disable: userProfile.disable || false,
    role: userProfile.role || 'user',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const isClientRole = formData.role === 'client';

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    const isCheckbox = (e.target as HTMLInputElement).type === 'checkbox';

    setFormData({
      ...formData,
      [name]: isCheckbox
        ? (e.target as HTMLInputElement).checked
        : ['username', 'email', 'password'].includes(name)
        ? value.trim()
        : value,
    });
  };

  const handleContactsChange = (
    updatedContacts: { name: string; value: string }[]
  ) => {
    setFormData({ ...formData, contacts: updatedContacts });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Валидация
    if (isClientRole && !formData.email) {
      setNotification({
        message: 'Email обязателен для клиента!',
        type: 'error',
      });
      return;
    }
    if (!isClientRole && !formData.username) {
      setNotification({ message: 'Логин обязателен!', type: 'error' });
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setNotification({ message: 'Пароли не совпадают!', type: 'error' });
      return;
    }

    setLoading(true);

    const profileData: Omit<IUser, 'id' | 'createdAt' | 'updatedAt'> = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      publicAlias: formData.publicAlias,
      note: formData.note,
      about: formData.about,
      contacts: formData.contacts,
      disable: formData.disable,
      role: formData.role,
    };

    if (formData.password) {
      profileData.password = formData.password.trim();
    }
    if (formData.email) {
      profileData.email = formData.email.trim();
    }
    if (formData.username) {
      profileData.username = formData.username.trim();
    }

    try {
      const resultAction = await dispatch(
        updateUserProfile({
          id: userProfile.id.toString(),
          profileData,
        })
      );

      setLoading(false);

      if (updateUserProfile.fulfilled.match(resultAction)) {
        setNotification({
          message: 'Профиль обновлен успешно',
          type: 'success',
        });
      } else if (
        resultAction.payload &&
        resultAction.payload.statusCode === 409
      ) {
        setNotification({
          message: resultAction.payload.message,
          type: 'error',
        });
      } else {
        setNotification({
          message: 'Ошибка при обновлении профиля',
          type: 'error',
        });
      }
    } catch (error) {
      setNotification({ message: 'Ошибка при сохранении', type: 'error' });
      console.error('Ошибка при сохранении: ', error);
      setLoading(false);
    }
  };

  return (
    <div className={styles.editUserForm}>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <form onSubmit={handleSubmit}>
        {!isClientRole && (
          <Input
            label="Логин"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Введите логин"
            required
          />
        )}
        {isClientRole && (
          <Input
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Введите email"
            required
          />
        )}
        <Input
          label="Имя"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="Введите имя"
        />
        <Input
          label="Фамилия"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Введите фамилию"
        />
        <Input
          label="Псевдоним"
          name="publicAlias"
          value={formData.publicAlias}
          onChange={handleChange}
          placeholder="Введите псевдоним"
        />
        <Textarea
          label="О себе"
          name="about"
          value={formData.about}
          onChange={handleChange}
          placeholder="Расскажите о себе"
        />
        <Textarea
          label="Заметки"
          name="note"
          value={formData.note}
          onChange={handleChange}
          placeholder="Заметки"
        />

        {/* Контактная форма */}
        <ContactForm
          initialContacts={formData.contacts}
          onContactsChange={handleContactsChange}
        />

        <Checkbox
          id="disable"
          name="disable"
          label="Заблокировать профиль"
          checked={formData.disable}
          onChange={(checked) => setFormData({ ...formData, disable: checked })}
        />

        <Select
          id="role"
          name="role"
          value={formData.role}
          options={[
            { value: 'user', label: 'Пользователь' },
            { value: 'admin', label: 'Администратор' },
            { value: 'manager', label: 'Менеджер' },
            { value: 'writer', label: 'Писатель' },
            { value: 'client', label: 'Клиент' },
            { value: 'guest', label: 'Гость' },
          ]}
          onChange={(e) =>
            setFormData({
              ...formData,
              role: e.target.value as IUser['role'],
            })
          }
        />

        <Input
          label="Пароль"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Введите новый пароль"
          type="password"
          autoComplete="new-password"
        />
        <Input
          label="Подтверждение пароля"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Подтвердите новый пароль"
          type="password"
          autoComplete="new-password"
        />

        {/* Показ дат */}
        <div className={styles.datesContainer}>
          <p>
            Создан:{' '}
            {userProfile.createdAt &&
              new Date(userProfile.createdAt).toLocaleString()}
          </p>
          <p>
            Обновлен:{' '}
            {userProfile.updatedAt &&
              new Date(userProfile.updatedAt).toLocaleString()}
          </p>
        </div>

        <div className={styles.actions}>
          <Button
            text="Сохранить изменения"
            type="submit"
            loading={loading}
            disabled={loading}
          />
          <Button text="Отмена" type="button" />
        </div>
      </form>
    </div>
  );
};
