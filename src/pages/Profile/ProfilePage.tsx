import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../store/store';
import { updateUserProfile } from '../../store/userSlice';
import styles from './ProfilePage.module.css';
import { Button } from '../../components/shared/Button';
import { Input } from '../../components/shared/Input';
import { useNavigate } from 'react-router-dom';

export const ProfilePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const userProfile = useSelector((state: RootState) => state.user.profile);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: userProfile?.username || '',
    email: userProfile?.email || '',
    firstName: userProfile?.firstName || '',
    lastName: userProfile?.lastName || '',
    publicAlias: userProfile?.publicAlias || '',
    note: userProfile?.note || '',
    about: userProfile?.about || '',
    avatar: userProfile?.avatar || '',
    contacts: userProfile?.contacts || [],
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (userProfile) {
      setFormData({
        username: userProfile.username,
        email: userProfile.email || '',
        firstName: userProfile.firstName || '',
        lastName: userProfile.lastName || '',
        publicAlias: userProfile.publicAlias || '',
        note: userProfile.note || '',
        about: userProfile.about || '',
        avatar: userProfile.avatar || '',
        contacts: userProfile.contacts || [],
        password: '',
        confirmPassword: '',
      });
    }
  }, [userProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value.trim(), // Тримминг
    });
  };

  const handleContactChange = (index: number, field: string, value: string) => {
    const updatedContacts = formData.contacts.map((contact, i) =>
      i === index ? { ...contact, [field]: value.trim() } : contact
    );
    setFormData({ ...formData, contacts: updatedContacts });
  };

  const handleAddContact = () => {
    setFormData({
      ...formData,
      contacts: [...formData.contacts, { name: '', value: '' }],
    });
  };

  const handleRemoveContact = (index: number) => {
    const updatedContacts = formData.contacts.filter((_, i) => i !== index);
    setFormData({ ...formData, contacts: updatedContacts });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { confirmPassword, password, ...dataToSubmit } = formData;

    if (password !== '' && password !== confirmPassword) {
      alert('Пароли не совпадают!');
      return;
    }

    const profileData: Partial<typeof formData> = { ...dataToSubmit };

    if (!password) {
      delete profileData.password;
    } else {
      profileData.password = password.trim();
    }

    if (userProfile?.id) {
      dispatch(
        updateUserProfile({
          id: userProfile.id.toString(),
          profileData: profileData,
        })
      );
    }
  };

  return (
    <div className={styles.profileContainer}>
      <h1>Редактировать профиль</h1>
      <form onSubmit={handleSubmit} className={styles.profileForm}>
        <div className={styles.profileHeader}>
          <div className={styles.profileAvatar}>
            <img src={formData.avatar} alt="Аватар" className={styles.avatar} />
          </div>
          <div className={styles.profileInfo}>
            <h2>{formData.username}</h2>
            <p>{formData.email}</p>
          </div>
        </div>
        <Input
          label="Url для аватарки"
          name="avatar"
          value={formData.avatar}
          onChange={handleChange}
          placeholder="URL изображения"
        />
        <Input
          label="Логин"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Введите логин"
          required
          disabled={userProfile?.role !== 'admin'}
        />
        <Input
          label="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Введите email"
          type="email"
        />
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
        <Input
          label="Заметки"
          name="note"
          value={formData.note}
          onChange={handleChange}
          placeholder="Введите заметки"
        />
        <Input
          label="О себе"
          name="about"
          value={formData.about}
          onChange={handleChange}
          placeholder="Расскажите о себе"
        />

        <div className={styles.contacts}>
          <h3>Контакты</h3>
          {formData.contacts.map((contact, index) => (
            <div key={index} className={styles.contactRow}>
              <Input
                label="Название контакта"
                name={`contactName-${index}`}
                value={contact.name}
                onChange={(e) =>
                  handleContactChange(index, 'name', e.target.value)
                }
                placeholder="Название"
                required
              />
              <Input
                label="Значение"
                name={`contactValue-${index}`}
                value={contact.value}
                onChange={(e) =>
                  handleContactChange(index, 'value', e.target.value)
                }
                placeholder="Значение"
                required
              />
              <Button
                text="Удалить"
                type="button"
                onClick={() => handleRemoveContact(index)}
              />
            </div>
          ))}
          <Button
            text="Добавить контакт"
            type="button"
            onClick={handleAddContact}
          />
        </div>

        <Input
          label="Пароль"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Введите новый пароль"
          type="password"
        />
        <Input
          label="Подтверждение пароля"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Подтвердите новый пароль"
          type="password"
        />

        <div className={styles.profileActions}>
          <Button
            text="Сохранить изменения"
            type="submit"
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
    </div>
  );
};
