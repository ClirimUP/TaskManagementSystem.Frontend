import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { authEnabled, isAuthenticated, email, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className={styles.navbar}>
      <Link to="/tasks" className={styles.navbar__brand}>
        Task Manager
      </Link>

      <div className={styles.navbar__actions}>
        {isAuthenticated && (
          <Link to="/tasks/new">
            <button className={`${styles.navbar__btn} ${styles['navbar__btn--primary']}`}>
              + New Task
            </button>
          </Link>
        )}

        {authEnabled && isAuthenticated && (
          <>
            <span className={styles.navbar__email}>{email}</span>
            <button className={styles.navbar__btn} onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
