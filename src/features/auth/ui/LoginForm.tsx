import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/appStore';
import { Input, Button, Notification } from '../../../shared/ui';
import { login } from '../model/authSlice';

import styles from './LoginForm.module.scss';

export const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showNotification, setShowNotification] = useState(true);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { status, error } = useAppSelector((state) => state.auth);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const resultAction = await dispatch(login({ username, password }));

    if (login.fulfilled.match(resultAction)) {
      navigate('/');
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
      {status === 'failed' && error && showNotification && (
        <Notification
          message={error}
          type="error"
          onClose={() => setShowNotification(false)}
        />
      )}

      <Button
        text="Авторизоваться"
        type="submit"
        loading={status === 'loading'}
      />
    </form>
  );
};
