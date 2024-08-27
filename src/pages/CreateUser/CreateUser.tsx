import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../store/store';
import { Button } from '../../components/shared/Button';
import { Input } from '../../components/shared/Input';
import styles from './CreateUser.module.scss';
import { createUser } from '../../store/userSlice';
import type { IUser } from '../../types/user';

export const CreateUser: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<{
    username: string;
    password: string;
    role: IUser['role'];
  }>({
    username: '',
    password: '',
    role: 'user',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const resultAction = await dispatch(createUser(formData));

      if (createUser.fulfilled.match(resultAction)) {
        console.log('Пользователь успешно создан:', resultAction.payload);
        navigate('/users');
      } else {
        console.error('Ошибка:', resultAction.payload);
      }
    } catch (error) {
      console.error('Ошибка при создании пользователя:', error);
    }
  };

  return (
    <div className={styles.createUserContainer}>
      <h1>Создать пользователя</h1>
      <form onSubmit={handleSubmit} className={styles.createUserForm}>
        <Input
          label="Логин"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Введите логин"
          required
        />
        <Input
          label="Пароль"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Введите пароль"
          type="password"
          required
        />
        <div className={styles.formGroup}>
          <label htmlFor="role">Роль</label>
          <select
            name="role"
            id="role"
            value={formData.role}
            onChange={handleChange}
            className={styles.select}
          >
            <option value="user">Пользователь</option>
            <option value="admin">Администратор</option>
            <option value="writer">Автор</option>
            <option value="manager">Менеджер</option>
            <option value="client">Клиент</option>
          </select>
        </div>
        <div className={styles.actions}>
          <Button text="Создать" type="submit" />
          <Button text="Отмена" type="button" onClick={() => navigate(-1)} />
        </div>
      </form>
    </div>
  );
};
