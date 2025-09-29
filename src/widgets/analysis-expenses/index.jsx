// index.jsx
import React, { useState, useEffect } from 'react';
import styles from './style.module.css';
import { TransactionsAPI } from './api_transactions';
import { useAuth } from '@/shared/context/AuthContext';

export const AnalysisExpenses = ({ startDate, endDate }) => {
  const [selectedStartDate, setSelectedStartDate] = useState(new Date());
  const [selectedEndDate, setSelectedEndDate] = useState(new Date());
  const [expensesData, setExpensesData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const { token, isAuthenticated } = useAuth();

  // Функция для получения данных с сервера
  const fetchExpensesData = async (start, end) => {
    if (!start || !end) return;
    
    // Проверяем наличие токена
    if (!token) {
      setError('Токен авторизации не найден');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const api = new TransactionsAPI(token);
      const transactions = await api.getTransactionsByPeriod(start, end);
      
      // Группируем транзакции по категориям и суммируем суммы
      const categorizedExpenses = groupTransactionsByCategory(transactions);
      
      // Сортируем по убыванию суммы и назначаем цвета
      const sortedExpenses = sortAndColorizeExpenses(categorizedExpenses);
      
      setExpensesData(sortedExpenses);
    } catch (err) {
      setError(err.message);
      console.error('Ошибка загрузки данных:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Группировка транзакций по категориям
  const groupTransactionsByCategory = (transactions) => {
    const categoriesMap = {};
    
    transactions.forEach(transaction => {
      const category = transaction.category;
      if (!categoriesMap[category]) {
        categoriesMap[category] = 0;
      }
      categoriesMap[category] += transaction.sum;
    });
    
    return Object.entries(categoriesMap).map(([category, amount]) => ({
      category: getRussianCategoryName(category),
      amount,
      originalCategory: category
    }));
  };

  // Сортировка и назначение цветов
  const sortAndColorizeExpenses = (expenses) => {
    if (expenses.length === 0) return [];
    
    const sorted = [...expenses].sort((a, b) => b.amount - a.amount);
    
    // Цвета от красного (максимальные траты) к зеленому (минимальные траты)
    const colorClasses = [
      styles.color_max,    // Красный для максимальных трат
      styles.color_high,
      styles.color_medium,
      styles.color_low,
      styles.color_min     // Зеленый для минимальных трат
    ];
    
    return sorted.map((expense, index) => {
      const colorIndex = Math.min(index, colorClasses.length - 1);
      return {
        ...expense,
        color: colorClasses[colorIndex]
      };
    });
  };

  // Перевод категорий на русский
  const getRussianCategoryName = (englishCategory) => {
    const categoryMap = {
      'food': 'Еда',
      'transport': 'Транспорт',
      'housing': 'Жилье',
      'joy': 'Развлечения',
      'education': 'Образование',
      'other': 'Другое',
      'health': 'Здоровье',
      'clothes': 'Одежда',
      'communal': 'Коммунальные'
    };
    
    return categoryMap[englishCategory] || englishCategory;
  };

  // Обновляем состояние при получении новых props
  useEffect(() => {
    if (startDate) {
      setSelectedStartDate(new Date(startDate));
    }
    if (endDate) {
      setSelectedEndDate(new Date(endDate));
    }
  }, [startDate, endDate]);

  // Загружаем данные при изменении периода или токена
  useEffect(() => {
    if (selectedStartDate && selectedEndDate && token) {
      fetchExpensesData(selectedStartDate, selectedEndDate);
    }
  }, [selectedStartDate, selectedEndDate, token]);

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
    // Проверяем авторизацию
    if (!isAuthenticated || !token) {
      return (
        <div className={styles.no_data}>
          Для просмотра статистики необходимо авторизоваться
        </div>
      );
    }

    if (expensesData.length === 0) {
      return (
        <div className={styles.no_data}>
          {isLoading ? 'Загрузка данных...' : 'Нет данных за выбранный период'}
        </div>
      );
    }

    const maxAmount = Math.max(...expensesData.map(item => item.amount));
    
    return expensesData.map((item, index) => {
      const heightPercentage = maxAmount > 0 ? (item.amount / maxAmount) * 85 : 0;
      
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

  if (error) {
    return (
      <div className={styles.expenses_container}>
        <div className={styles.error_message}>
          Ошибка загрузки данных: {error}
        </div>
      </div>
    );
  }

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