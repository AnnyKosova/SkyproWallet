import { Link, useLocation, useNavigate } from 'react-router-dom';
import cn from 'classnames';
import { useAuth } from '@/shared/context/auth-ctx/AuthContext';
import { useState } from 'react';

import logo from '@/shared/assets/images/logo.svg';
import { locationNow } from '@/shared/lib/location-now';

import styles from './styles.module.css';

export const Header = ({ isMain = false }) => {
  const { pathname } = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  // Получаем название активного раздела для мобильного меню
  const getActiveSectionName = () => {
    if (locationNow('/expenses', pathname)) {
      return 'Мои расходы';
    } else if (locationNow('/analysis', pathname)) {
      return 'Анализ Расходов';
    }
    return 'Меню';
  };

  return (
    <header className={styles.header}>
      <img src={logo} alt="SkyproWallet" />
      {isMain ? (
        <>
          {/* Десктопное меню */}
          <nav className={styles.menu}>
            <ul className={styles.menu__list}>
              <li className={styles.menu__item}>
                <Link
                  to={'/expenses'}
                  className={cn(styles.menu__link, {
                    [styles.active]: locationNow('/expenses', pathname),
                  })}
                >
                  Мои расходы
                </Link>
              </li>
              <li className={styles.menu__item}>
                <Link
                  to={'/analysis'}
                  className={cn(styles.menu__link, {
                    [styles.active]: locationNow('/analysis', pathname),
                  })}
                >
                  Анализ Расходов
                </Link>
              </li>
            </ul>
          </nav>

          

          <div className={styles.exit}>
            {/* Мобильное меню */}
          <div className={styles.mobileMenu}>
            <div 
              className={cn(styles.mobileMenuToggle, {
                [styles.active]: isMobileMenuOpen,
              })}
              onClick={toggleMobileMenu}
            >
              {getActiveSectionName()}
              <span className={styles.arrow}></span>
            </div>
            
            <div 
              className={cn(styles.mobileDropdown, {
                [styles.mobileDropdownOpen]: isMobileMenuOpen,
              })}
            >
              <Link
                to={'/expenses'}
                className={cn(styles.mobileMenuLink, {
                  [styles.active]: locationNow('/expenses', pathname),
                })}
                onClick={handleLinkClick}
              >
                Мои расходы
              </Link>
              <Link
                to={'/expenses'}
                className={cn(styles.mobileMenuLink, {
                  [styles.active]: locationNow('/expenses', pathname),
                })}
                onClick={handleLinkClick}
              >
                Новый расход
              </Link>
              <Link
                to={'/analysis'}
                className={cn(styles.mobileMenuLink, {
                  [styles.active]: locationNow('/analysis', pathname),
                })}
                onClick={handleLinkClick}
              >
                Анализ Расходов
              </Link>
            </div>
          </div>
            <button onClick={handleLogout} className={styles.exit__text}>
              Выйти
            </button>
          </div>
        </>
      ) : null}
    </header>
  );
};