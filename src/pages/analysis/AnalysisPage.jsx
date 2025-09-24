import React, { useState, useCallback } from 'react';

import { AnalysisCalendar } from '@/widgets/analysis-calendar';
import { AnalysisExpenses } from '@/widgets/analysis-expenses';

import styles from './styles.module.css';

export const AnalysisPage = () => {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date()
  });

  const handleDateRangeChange = useCallback((startDate, endDate) => {
    setDateRange({
      startDate: startDate || new Date(),
      endDate: endDate || startDate || new Date()
    });
  }, []);

  return (
    <div className={styles.expenses__page}>
      <h1 className={styles.expenses__title}>Анализ расходов</h1>
      <div className={styles.expenses__content}>
        <AnalysisCalendar onDateRangeChange={handleDateRangeChange} />
        <AnalysisExpenses 
          startDate={dateRange.startDate} 
          endDate={dateRange.endDate} 
        />
      </div>
    </div>
  );
};