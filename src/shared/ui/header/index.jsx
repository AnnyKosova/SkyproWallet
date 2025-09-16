import { Link } from 'react-router-dom';
import cn from 'classnames';

import logo from '@/shared/assets/images/logo.svg';
import { locationNow } from '@/shared/lib/location-now';

import styles from './styles.module.css';

export const Header = ({ isMain = false }) => {
  return (
    <header className={styles.header}>
      <img src={logo} alt="SkyproWallet" />
      {isMain ? (
        <>
          <nav className={styles.menu}>
            <ul className={styles.menu__list}>
              <li className={styles.menu__item}>
                <Link
                  className={cn(styles.menu__link, {
                    [styles.active]: locationNow('/expenses'),
                  })}
                >
                  Мои расходы
                </Link>
              </li>
              <li className={styles.menu__item}>
                <Link
                  className={cn(styles.menu__link, {
                    [styles.active]: locationNow('/analysis'),
                  })}
                >
                  Анализ Расходов
                </Link>
              </li>
            </ul>
          </nav>

          <div className={styles.exit}>
            <p className={styles.exit__text}>Выйти</p>
          </div>
        </>
      ) : null}
    </header>
  );
};
