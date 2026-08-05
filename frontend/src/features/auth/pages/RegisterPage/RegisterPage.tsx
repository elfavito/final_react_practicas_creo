import React from 'react';
import { RegisterForm } from '../../components/RegisterForm/RegisterForm';
import styles from './RegisterPage.module.css';

export const RegisterPage: React.FC = () => {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.formWrapper}>
        <RegisterForm />
      </div>
    </div>
  );
};
