import React from 'react';

import { ExpensesForm } from '@/widgets/expenses-form';

import styles from './styles.module.css';

export const MobileFormPage = () => {
  return (
    <div className={styles.expenses__page}>
      <div className={styles.expenses__content}>
        <ExpensesForm />
      </div>
    </div>
  );
};