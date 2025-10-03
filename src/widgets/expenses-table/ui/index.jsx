import { useEffect } from 'react';
import cn from 'classnames';

import { useExpensesCtx } from '@/shared/context/expenses-ctx';

import styles from './styles.module.css';
import { getCategoryKey } from '../../../shared/lib/get-category-key';

export function ExpensesTable() {
  const { expenses, getAllExpenses, deleteExpense } = useExpensesCtx();

  useEffect(() => {
    getAllExpenses();
  }, []);

  const onDelete = (e) => {
    const target = e.target;
    let id = target.getAttribute("data-id");
    if(!id) {
       id = target.firstChild.getAttribute("data-id");
    }
    deleteExpense(id);
  };

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
          {expenses ? (
            expenses.map((el) => (
              <div key={el._id} className={styles.expenses__item}>
                <div className={styles.item__description}>{el.description}</div>
                <div className={styles.item__category}>{getCategoryKey(el.category)}</div>
                <div className={styles.item__date}>
                  {new Date(el.date).toLocaleDateString('ru-RU')}
                </div>
                <div className={styles.item__sum}>{el.sum}</div>
                <div className={cn(styles.item__delete, styles.col5)} onClick={onDelete}>
                  <img  src="/common/bag.svg" alt="Удалить" data-id={el._id} />
                </div>
              </div>
            ))
          ) : (
            <p>Кажется, трат пока нет! РАДУЙТЕСЬ!</p>
          )}
        </div>
      </div>
    </div>
  );
}
