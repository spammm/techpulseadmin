import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/appStore';
import {
  fetchUserProfile,
  updateUserProfile,
  setField,
} from '../model/profileSlice';
import { Input, ContactForm, Button } from '../../../shared/ui';
import { IUser } from '../../../shared/types/user';

import styles from './ProfileForm.module.scss';

export const ProfileForm: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { profile, status } = useAppSelector((state) => state.profile);
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (!profile) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch, profile]);

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'confirmPassword') {
      setConfirmPassword(value.trim());
    } else {
      dispatch(setField({ field: name as keyof IUser, value: value }));
    }
  };

  const handleContactsChange = (
    updatedContacts: { name: string; value: string }[]
  ) => {
    dispatch(setField({ field: 'contacts', value: updatedContacts }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!profile) return;

    const { password } = profile;

    if (password !== '' && password !== confirmPassword) {
      alert('Пароли не совпадают!');
      return;
    }

    const dataToSubmit = { ...profile };

    if (password === '') {
      delete dataToSubmit.password;
    }

    dispatch(
      updateUserProfile({
        id: profile.id.toString(),
        profileData: dataToSubmit,
      })
    );
  };

  if (!profile) {
    return <div>Загрузка профиля...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className={styles.profileForm}>
      <div className={styles.profileHeader}>
        <div className={styles.profileAvatar}>
          <img
            src={profile.avatar || ''}
            alt="Аватар"
            className={styles.avatar}
          />
        </div>
        <div className={styles.profileInfo}>
          <h2>{profile.username}</h2>
          <p>{profile.email}</p>
        </div>
      </div>

      <Input
        label="Url для аватарки"
        name="avatar"
        value={profile.avatar}
        onChange={handleFieldChange}
        placeholder="URL изображения"
      />

      <Input
        label="Логин"
        name="username"
        value={profile.username}
        onChange={handleFieldChange}
        placeholder="Введите логин"
        required
        disabled={profile.role !== 'admin'}
      />

      <Input
        label="Email"
        name="email"
        value={profile.email}
        onChange={handleFieldChange}
        placeholder="Введите email"
        type="email"
      />

      <Input
        label="Имя"
        name="firstName"
        value={profile.firstName}
        onChange={handleFieldChange}
        placeholder="Введите имя"
      />

      <Input
        label="Фамилия"
        name="lastName"
        value={profile.lastName}
        onChange={handleFieldChange}
        placeholder="Введите фамилию"
      />

      <Input
        label="Псевдоним"
        name="publicAlias"
        value={profile.publicAlias}
        onChange={handleFieldChange}
        placeholder="Введите псевдоним"
      />

      <Input
        label="Заметки"
        name="note"
        value={profile.note}
        onChange={handleFieldChange}
        placeholder="Введите заметки"
      />

      <Input
        label="О себе"
        name="about"
        value={profile.about}
        onChange={handleFieldChange}
        placeholder="Расскажите о себе"
      />

      <ContactForm
        initialContacts={profile.contacts || []}
        onContactsChange={handleContactsChange}
      />

      <Input
        label="Пароль"
        name="password"
        value={profile.password || ''}
        onChange={handleFieldChange}
        placeholder="Введите новый пароль"
        type="password"
        autoComplete="new-password"
      />

      <Input
        label="Подтверждение пароля"
        name="confirmPassword"
        value={confirmPassword}
        onChange={handleFieldChange}
        placeholder="Подтвердите новый пароль"
        type="password"
        autoComplete="new-password"
      />

      <div className={styles.profileActions}>
        <Button
          text="Сохранить изменения"
          type="submit"
          loading={status === 'loading'}
          className={styles.saveBtn}
        />
        <Button
          text="Отмена"
          type="button"
          onClick={() => navigate(-1)}
          className={styles.cancelBtn}
        />
      </div>
    </form>
  );
};
