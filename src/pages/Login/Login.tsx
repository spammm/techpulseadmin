import React from 'react';
import { Login } from '../../components/Login';
import styles from './Login.module.css';

export const LoginPage: React.FC = () => {
  return (
    <section className={styles.login}>
      <h1>Авторизация</h1>
      <div>
        <Login />
      </div>
    </section>
  );
};
