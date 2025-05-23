import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { logout, logoutThunk } from '../../store/slices/authSlice';
import styles from '../../styles/Header.module.scss';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const cartItems = useAppSelector((state) => state.cart.items);
  
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = () => {
    dispatch(logoutThunk()).then(() => {
      navigate('/login');
    });
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <Link to="/" className={styles.logo}>
          <span className={styles.siteName}>Посуда от и до</span>
        </Link>
        <nav className={styles.nav}>
          <Link to="/" className={styles.navLink}>
            Главная
          </Link>
          <Link to="/catalog" className={styles.navLink}>
            Каталог
          </Link>
          {isAuthenticated && user?.role !== 'admin' && (
            <Link to="/orders" className={styles.navLink}>
              Заказы
            </Link>
          )}
          {isAuthenticated && user?.role === 'admin' && (
            <Link to="/admin" className={styles.navLink}>
              Админ-панель
            </Link>
          )}
        </nav>
        <div className={styles.actions}>
          {isAuthenticated ? (
            <>
              <Link to="/profile" className={styles.profile}>
                {user?.name}
              </Link>
              <button onClick={handleLogout} className={styles.logoutBtn}>
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={styles.navLink}>
                Войти
              </Link>
              <Link to="/register" className={styles.navLink}>
                Регистрация
              </Link>
            </>
          )}
          <Link to="/cart" className={styles.cartIconWrapper}>
            <svg
              className={styles.cartIcon}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            {totalItems > 0 && (
              <span className={styles.cartBadge}>{totalItems}</span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header; 