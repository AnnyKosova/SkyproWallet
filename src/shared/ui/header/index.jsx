import { Link, Links, useLocation } from 'react-router-dom';
import cn from 'classnames';

import logo from '@/shared/assets/images/logo.svg';
import { locationNow } from '@/shared/lib/location-now';

import styles from './styles.module.css';

export const Header = ({ isMain = false }) => {
  const { pathname } = useLocation();

  return (
    <header className={styles.header}>
      <img src={logo} alt="SkyproWallet" />
      {isMain ? (
        <>
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
            <Link to={"/login"} className={styles.exit__text}>Выйти</Link>
          </div>
        </>
      ) : null}
    </header>
  );
};
