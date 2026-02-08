import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Auth.module.css';
import formStyles from './TaskForm.module.css';

export default function Login() {
  const navigate = useNavigate();
  const { login, loading, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalError('');

    if (!email.trim()) {
      setLocalError('Email is required.');
      return;
    }
    if (!password) {
      setLocalError('Password is required.');
      return;
    }

    const ok = await login(email.trim(), password);
    if (ok) navigate('/tasks');
  };

  const displayError = localError || error;

  return (
    <div className={styles['auth-page']}>
      <h1 className={styles['auth-page__title']}>Login</h1>

      {displayError && <div className={styles['auth-page__error']}>{displayError}</div>}

      <form onSubmit={handleSubmit} noValidate>
        <div className={formStyles.form__group}>
          <label className={formStyles.form__label} htmlFor="email">
            Email
          </label>
          <input
            id="email"
            className={formStyles.form__input}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
          />
        </div>

        <div className={formStyles.form__group}>
          <label className={formStyles.form__label} htmlFor="password">
            Password
          </label>
          <input
            id="password"
            className={formStyles.form__input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className={`${formStyles.form__btn} ${formStyles['form__btn--primary']} ${formStyles['form__btn--full-width']}`}
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>

      <div className={styles['auth-page__footer']}>
        Don&apos;t have an account?{' '}
        <Link to="/register" className={styles['auth-page__link']}>
          Register
        </Link>
      </div>
    </div>
  );
}
