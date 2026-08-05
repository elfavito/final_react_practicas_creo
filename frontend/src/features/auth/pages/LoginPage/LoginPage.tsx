import React from 'react';
import { LoginForm } from '../../components/LoginForm/LoginForm';
import styles from './LoginPage.module.css';

export const LoginPage: React.FC = () => {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.formWrapper}>
        <LoginForm />
      </div>
    </div>
  );
};
