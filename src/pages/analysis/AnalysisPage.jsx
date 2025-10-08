// AnalysisPage.jsx
import React, { useState, useCallback } from 'react';
import { AnalysisCalendar } from '@/widgets/analysis-calendar';
import { AnalysisExpenses } from '@/widgets/analysis-expenses';
import styles from './styles.module.css';

export const AnalysisPage = () => {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date()
  });
  
  const [activeView, setActiveView] = useState('calendar'); // 'calendar' или 'expenses'

  const handleDateRangeChange = useCallback((startDate, endDate) => {
    setDateRange({
      startDate: startDate || new Date(),
      endDate: endDate || startDate || new Date()
    });
  }, []);

  const handleToggleView = useCallback((view) => {
    setActiveView(view);
  }, []);

  const isPeriodSelected = dateRange.startDate && dateRange.endDate;

  return (
    <div className={styles.expenses__page}>
      <h1 className={styles.expenses__title}>Анализ расходов</h1>
      <div className={styles.expenses__content}>
        <div className={`${styles.calendar_container} ${activeView === 'calendar' ? styles.active : styles.hidden}`}>
          <AnalysisCalendar 
            onDateRangeChange={handleDateRangeChange} 
            onToggleView={handleToggleView}
            isPeriodSelected={isPeriodSelected}
            isMobileActive={activeView === 'calendar'}
          />
        </div>
        <div className={`${styles.expenses_container} ${activeView === 'expenses' ? styles.active : styles.hidden}`}>
          <AnalysisExpenses 
            startDate={dateRange.startDate} 
            endDate={dateRange.endDate}
            onToggleView={handleToggleView}
            isMobileActive={activeView === 'expenses'}
          />
        </div>
      </div>
    </div>
  );
};