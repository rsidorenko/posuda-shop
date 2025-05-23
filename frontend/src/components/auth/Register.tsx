import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../../store/slices/authSlice';
import { AppDispatch } from '../../store';
import styles from '../../styles/Auth.module.scss';
import { GoogleLoginButton } from './GoogleLoginButton';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    try {
      await dispatch(register({ name, email, password })).unwrap();
      navigate('/');
    } catch (err) {
      setError('Ошибка при регистрации');
    }
  };

  return (
    <div className={styles.authContainer}>
      <form className={styles.authForm} onSubmit={handleSubmit}>
        <h1 className={styles.formTitle}>Регистрация</h1>
        
        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="name">Имя</label>
          <input
            id="name"
            type="text"
            className={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Введите ваше имя"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Введите ваш email"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="password">Пароль</label>
          <input
            id="password"
            type="password"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Введите пароль"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label} htmlFor="confirmPassword">Подтверждение пароля</label>
          <input
            id="confirmPassword"
            type="password"
            className={styles.input}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Подтвердите пароль"
            required
          />
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <button type="submit" className={styles.submitButton}>
          Зарегистрироваться
        </button>

        <div className={styles.switchForm}>
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </div>

        <div className={styles.socialLogin}>
          <div className={styles.divider}>
            <span>или зарегистрироваться через</span>
          </div>
          <GoogleLoginButton onClick={() => {
            window.location.href = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/auth/google`;
          }} />
        </div>
      </form>
    </div>
  );
};

export default Register; 