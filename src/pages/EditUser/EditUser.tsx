import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState, useAppDispatch } from '../../store/store';
import { updateUserProfile } from '../../store/userSlice';
import styles from './EditUser.module.css';
import { Button } from '../../components/shared/Button';
import { Input } from '../../components/shared/Input';
import { useNavigate, useParams } from 'react-router-dom';

export const EditUser: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const userId = id ? parseInt(id, 10) : null;

  const userProfile = useSelector((state: RootState) =>
    state.user.users.find((user) => user.id === userId)
  );

  const currentUser = useSelector((state: RootState) => state.user.profile);

  const [formData, setFormData] = useState({
    username: userProfile?.username || '',
    disable: userProfile?.disable || false,
    role: userProfile?.role || 'user',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (userProfile) {
      setFormData({
        username: userProfile.username,
        disable: userProfile.disable,
        role: userProfile.role || 'user',
        password: '',
        confirmPassword: '',
      });
    }
  }, [userProfile]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const isCheckbox = (e.target as HTMLInputElement).type === 'checkbox';
    const checked = isCheckbox
      ? (e.target as HTMLInputElement).checked
      : undefined;

    setFormData({
      ...formData,
      [name]: isCheckbox ? checked : value.trim(),
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
      try {
        const resultAction = await dispatch(
          updateUserProfile({
            id: userProfile.id.toString(),
            profileData: profileData,
          })
        );

        if (updateUserProfile.fulfilled.match(resultAction)) {
          console.log('Пользователь обновлен:', resultAction.payload);
          navigate('/users');
        } else {
          console.error('Ошибка:', resultAction.payload);
        }
      } catch (error) {
        console.error('Ошибка при создании пользователя:', error);
      }
    }
  };

  const canEdit =
    currentUser?.role === 'admin' || userProfile?.role !== 'admin';

  if (!canEdit) {
    return <p>Вы не можете редактировать этот профиль.</p>;
  }

  return (
    <div className={styles.editUserContainer}>
      <h1>Редактировать пользователя</h1>
      <form onSubmit={handleSubmit} className={styles.editUserForm}>
        <div className={styles.userDetails}>
          <p>
            <strong>Логин:</strong> {userProfile?.username}
          </p>
          <p>
            <strong>Email:</strong> {userProfile?.email}
          </p>
          <p>
            <strong>Имя:</strong> {userProfile?.firstName}
          </p>
          <p>
            <strong>Фамилия:</strong> {userProfile?.lastName}
          </p>
          <p>
            <strong>Псевдоним:</strong> {userProfile?.publicAlias}
          </p>
          <p>
            <strong>Заметки:</strong> {userProfile?.note}
          </p>
          <p>
            <strong>О себе:</strong> {userProfile?.about}
          </p>
          <p>
            <strong>Контакты:</strong>
          </p>
          <ul>
            {userProfile?.contacts?.map((contact, index) => (
              <li key={index}>
                {contact.name}: {contact.value}
              </li>
            ))}
          </ul>
        </div>

        <Input
          label="Логин"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Введите логин"
          required
          disabled={!canEdit || userProfile?.role === 'admin'}
        />

        <div className={styles.checkboxGroup}>
          <label htmlFor="disable">Заблокировать профиль</label>
          <input
            type="checkbox"
            name="disable"
            id="disable"
            checked={formData.disable}
            onChange={handleChange}
            disabled={!canEdit}
          />
        </div>

        {currentUser?.role === 'admin' && (
          <div className={styles.roleSelect}>
            <label htmlFor="role">Роль</label>
            <select
              name="role"
              id="role"
              value={formData.role}
              onChange={handleChange}
              disabled={!canEdit}
            >
              <option value="user">Пользователь</option>
              <option value="admin">Администратор</option>
              <option value="manager">Менеджер</option>
              <option value="writer">Писатель</option>
              <option value="client">Клиент</option>
            </select>
          </div>
        )}

        <Input
          label="Пароль"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Введите новый пароль"
          type="password"
          disabled={!canEdit}
        />
        <Input
          label="Подтверждение пароля"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Подтвердите новый пароль"
          type="password"
          disabled={!canEdit}
        />

        <div className={styles.actions}>
          <Button
            text="Сохранить изменения"
            type="submit"
            disabled={!canEdit}
          />
          <Button text="Отмена" type="button" onClick={() => navigate(-1)} />
        </div>
      </form>
    </div>
  );
};
