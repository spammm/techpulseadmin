import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../shared/Input';
import { Button } from '../shared/Button';
import { loginUser } from '../../api/authApi';
import { useAppDispatch } from '../../store/store';
import { fetchUserProfile } from '../../store/userSlice';
import styles from './Login.module.css';

export const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { accessToken } = await loginUser(username, password);
      localStorage.setItem('token', accessToken);
      dispatch(fetchUserProfile());
      navigate('/posts');
    } catch (error) {
      console.error('Login failed', error);
      alert('Login failed');
    }
  };

  return (
    <form onSubmit={handleLogin} className={styles.loginForm}>
      <Input
        label="Логин"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <Input
        label="Пароль"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <Button text="Автоизироваться" type="submit" />
    </form>
  );
};
