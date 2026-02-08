import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Auth.module.css';
import formStyles from './TaskForm.module.css';

export default function Register() {
  const navigate = useNavigate();
  const { register, loading, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalError('');

    if (!email.trim()) {
      setLocalError('Email is required.');
      return;
    }
    if (password.length < 8) {
      setLocalError('Password must be at least 8 characters.');
      return;
    }
    if (password.length > 128) {
      setLocalError('Password must not exceed 128 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }

    const ok = await register(email.trim(), password);
    if (ok) navigate('/tasks');
  };

  const displayError = localError || error;

  return (
    <div className={styles['auth-page']}>
      <h1 className={styles['auth-page__title']}>Register</h1>

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
          <div className={formStyles.form__hint}>
            Minimum 8 characters
          </div>
        </div>

        <div className={formStyles.form__group}>
          <label className={formStyles.form__label} htmlFor="confirmPassword">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            className={formStyles.form__input}
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className={`${formStyles.form__btn} ${formStyles['form__btn--primary']} ${formStyles['form__btn--full-width']}`}
          disabled={loading}
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <div className={styles['auth-page__footer']}>
        Already have an account?{' '}
        <Link to="/login" className={styles['auth-page__link']}>
          Login
        </Link>
      </div>
    </div>
  );
}
