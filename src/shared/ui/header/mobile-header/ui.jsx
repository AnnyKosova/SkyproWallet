import { Link, useLocation } from 'react-router-dom';
import { useRef } from 'react';
import cn from 'classnames';

import { locationNow } from '@/shared/lib/location-now';
import { mobilePathMap, mobilePaths } from './mobile-header-paths';

import styles from './styles.module.css';

export function MobileNav() {
  const { pathname } = useLocation();
  const navRef = useRef(null);

  const closeOnClick = (e) => {
    const target = e.target;
    if (target) navRef.current.open = false;
  };

  return (
    <div className={styles.container}>
      <details ref={navRef} className={styles['mobile-nav']}>
        <summary className={styles['title-content']}>
          <span className={styles['location-title']}>{mobilePathMap[pathname]}</span>
          <img
            className={styles['arrow-nav']}
            src="/public/common/arrow-mobile.svg"
            alt=""
          />
        </summary>
        <div className={styles['link-container']}>
          {mobilePaths.map((path, index) => (
            <Link
              key={index}
              className={cn(styles.link__mobile, {
                [styles.current__location]: locationNow(path.name, pathname),
              })}
              to={path.name}
              onClick={closeOnClick}
            >
              {path.title}
            </Link>
          ))}
        </div>
      </details>
      <div className={styles.exit}>
        <button className={styles.exit__text}>Выйти</button>
      </div>
    </div>
  );
}
