import React from 'react';

import { ExpensesTable } from '@/widgets/expenses-table';

import styles from './styles.module.css';

export const MobileTablePage = () => {
  return (
    <div className={styles.expenses__page}>
      <h1 className={styles.expenses__title}>Мои расходы</h1>
      <div className={styles.expenses__content}>
        <ExpensesTable />
      </div>
    </div>
  );
};