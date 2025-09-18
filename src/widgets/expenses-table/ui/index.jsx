import cn from 'classnames';
import styles from './styles.module.css';

export function ExpensesTable() {
  return (
    <div className={styles.table}>
      <h2 className={styles.table__title}>Таблица расходов</h2>
      <div className={styles.table__content}>
        <div className={styles.table__header}>
          <div className={styles['table__header-col']}>Описание</div>
          <div className={styles['table__header-col']}>Категория</div>
          <div className={styles['table__header-col']}>Дата</div>
          <div className={styles['table__header-col']}>Сумма</div>
        </div>
        <div className={styles.line}></div>

        <div className={styles.table__expenses}>
          {Array(18)
            .fill(null)
            .map((_, index) => (
              <div key={index} className={styles.expenses__item}>
                <div className={styles.item__description}>Пятерочка</div>
                <div className={styles.item__category}>Еда</div>
                <div className={styles.item__date}>03.07.2024</div>
                <div className={styles.item__sum}>3 500 ₽</div>
                <div className={cn(styles.item__delete, styles.col5)}>
                  <img src="/common/bag.svg" alt="Удалить" />
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
