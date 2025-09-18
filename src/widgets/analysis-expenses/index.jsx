import React, { useState, useEffect } from 'react';
import styles from './style.module.css';

export const AnalysisExpenses = ({ startDate, endDate }) => {
  const [selectedStartDate, setSelectedStartDate] = useState(new Date());
  const [selectedEndDate, setSelectedEndDate] = useState(new Date());

  // Обновляем состояние при получении новых props
  useEffect(() => {
    if (startDate) {
      setSelectedStartDate(new Date(startDate));
    }
    if (endDate) {
      setSelectedEndDate(new Date(endDate));
    }
  }, [startDate, endDate]);

  const expensesData = [
    { category: 'Еда', amount: 21990, color: styles.color_food },
    { category: 'Транспорт', amount: 13050, color: styles.color_transport },
    { category: 'Жилье', amount: 11046, color: styles.color_housing },
    { category: 'Развлечения', amount: 10000, color: styles.color_entertainment },
    { category: 'Образование', amount: 5000, color: styles.color_education },
    { category: 'Другое', amount: 4106, color: styles.color_other }
  ];

  const formatDate = (date) => {
    const day = date.getDate();
    const month = date.toLocaleString('ru', { month: 'long' });
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  };

  const getPeriodDisplay = () => {
    if (selectedStartDate && selectedEndDate) {
      const startFormatted = formatDate(selectedStartDate);
      const endFormatted = formatDate(selectedEndDate);
      
      if (selectedStartDate.toDateString() === selectedEndDate.toDateString()) {
        return `Расходы за ${startFormatted}`;
      } else {
        return `Расходы за ${startFormatted} — ${endFormatted}`;
      }
    }
    return 'Выберите период';
  };

  const getTotalAmount = () => {
    const total = expensesData.reduce((sum, item) => sum + item.amount, 0);
    return `${total.toLocaleString('ru-RU')} ₽`;
  };

  const renderChartColumns = () => {
    const maxAmount = Math.max(...expensesData.map(item => item.amount));
    
    return expensesData.map((item, index) => {
      const heightPercentage = (item.amount / maxAmount) * 85;
      
      return (
        <div key={index} className={styles.chart_column}>
          <div className={styles.column_amount}>
            {item.amount.toLocaleString('ru-RU')} ₽
          </div>
          <div className={styles.column_container}>
            <div className={styles.column_bar_container}>
              <div 
                className={`${styles.column_bar} ${item.color}`}
                style={{ height: `${heightPercentage}%` }}
              ></div>
            </div>
          </div>
          <div className={styles.column_label}>{item.category}</div>
        </div>
      );
    });
  };

  return (
    <div className={styles.expenses_container}>
      <div className={styles.expenses_header}>
        <div className={styles.total_amount}>{getTotalAmount()}</div>
        <div className={styles.period_display}>{getPeriodDisplay()}</div>
      </div>

      <div className={styles.expenses_chart}>
        {renderChartColumns()}
      </div>
      
      <button className={styles.mobile_toggle_button}>
        Выбрать период расходов
      </button>
    </div>
  );
};