import { useEffect, useState } from 'react';
import cn from 'classnames';

import { useExpensesCtx } from '@/shared/context/expenses-ctx';
import { getCategoryKey } from '@/shared/lib/get-category-key';
import { MobileBtn } from '@/shared/ui/mobile-btn';

import styles from './styles.module.css';
import { Link } from 'react-router-dom';

export function ExpensesTable() {
  const [focusedExpenseId, setFocusedExpenseId] = useState(null);
  const { expenses, getAllExpenses, deleteExpense } = useExpensesCtx();

  useEffect(() => {
    getAllExpenses();
  }, []);

  const onDelete = (e) => {
    const target = e.target;
    let id = target.getAttribute('data-id');
    if (!id) id = target.parentNode.getAttribute('data-id');
    if (!target.nextSibling && !target.firstChild)
      id = target.parentElement.parentNode.getAttribute('data-id');
    deleteExpense(id);
  };

  const mobileFocusedItem = (id) => {
    setFocusedExpenseId(id);
  };

  const onDeleteMobile = (targetId) => {
    deleteExpense(targetId);
  };

  return (
    <div className={cn(styles.table)}>
      <h2 className={styles.table__title}>Таблица расходов</h2>
      <div className={styles['title__content-md-sm']}>
        <h2 className={styles['table__title-md-sm']}>Мои расходы</h2>
        <Link to={"/form"} className={styles['expenses__btn-md-sm']}>Новый расход</Link>
      </div>
      <div className={styles.table__content}>
        <div className={styles.table__header}>
          <div className={cn(styles['table__header-col'], styles.item1)}>
            Описание
          </div>
          <div className={cn(styles['table__header-col'], styles.item2)}>
            Категория
          </div>
          <div className={cn(styles['table__header-col'], styles.item3)}>
            Дата
          </div>
          <div className={cn(styles['table__header-col'], styles.item4)}>
            Сумма
          </div>
        </div>
        <div className={styles.line}></div>

        <div className={styles.table__expenses}>
          {expenses ? (
            expenses.map((el) => (
              <div
                key={el._id}
                className={cn(styles.expenses__item, {
                  [styles.focused]: focusedExpenseId === el._id,
                })}
                data-id={el._id}
                onClick={() => mobileFocusedItem(el._id)}
              >
                <div className={styles.item__description}>{el.description}</div>
                <div className={styles.item__category}>
                  {getCategoryKey(el.category)}
                </div>
                <div className={cn(styles.item__date, styles.item3)}>
                  {new Date(el.date).toLocaleDateString('ru-RU')}
                </div>
                <div className={cn(styles.item__sum, styles.item4)}>
                  {el.sum + ' ₽'}
                </div>
                <div
                  className={cn(styles.item__delete, styles.col5)}
                  onClick={onDelete}
                >
                  <img src="/common/bag.svg" alt="Удалить" />
                </div>
              </div>
            ))
          ) : (
            <p>Кажется, трат пока нет! РАДУЙТЕСЬ!</p>
          )}
        </div>
      </div>
      <MobileBtn
        handler={() => onDeleteMobile(focusedExpenseId)}
        classNames={styles['show__mobile-btn']}
        type="submit"
        description={'Удалить расход'}
      />
    </div>
  );
}
