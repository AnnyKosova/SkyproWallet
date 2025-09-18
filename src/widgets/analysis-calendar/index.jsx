import React, { useState, useEffect, useCallback } from 'react';
import styles from './style.module.css';

export const AnalysisCalendar = ({ onDateRangeChange }) => {
  const [currentDate] = useState(new Date());
  const [selectedStartDate, setSelectedStartDate] = useState(new Date());
  const [selectedEndDate, setSelectedEndDate] = useState(new Date());

  const monthNames = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];

  // Мемоизируем функцию для передачи дат
  const notifyDateRangeChange = useCallback(() => {
    if (onDateRangeChange) {
      onDateRangeChange(selectedStartDate, selectedEndDate);
    }
  }, [onDateRangeChange, selectedStartDate, selectedEndDate]);

  useEffect(() => {
    scrollToCurrentMonth();
    notifyDateRangeChange();
  }, [notifyDateRangeChange]);

  const scrollToCurrentMonth = () => {
    const monthsContainer = document.getElementById('calendar-months');
    const currentMonth = new Date().getMonth();
    const monthTitles = monthsContainer?.querySelectorAll(`.${styles.calendar_month_title}`);
    
    if (monthTitles && monthTitles.length > currentMonth) {
      monthTitles[currentMonth].scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const createMonthCalendar = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    let firstDayOfWeek = firstDay.getDay();
    if (firstDayOfWeek === 0) firstDayOfWeek = 7;

    let html = [];
    
    // Пустые ячейки для выравнивания
    for (let i = 1; i < firstDayOfWeek; i++) {
      html.push(<div key={`empty-${i}`} className={styles.calendar_empty}></div>);
    }
    
    // Дни месяца
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const dayDate = new Date(year, month, i);
      let dayClass = styles.calendar_day;
      
      if (dayDate.toDateString() === currentDate.toDateString()) {
        dayClass += ` ${styles.today}`;
      }
      
      if (isDateSelected(dayDate)) {
        dayClass += ` ${styles.selected}`;
      }
      
      html.push(
        <div
          key={`day-${i}`}
          className={dayClass}
          onClick={() => selectDate(new Date(year, month, i))}
        >
          {i}
        </div>
      );
    }
    
    return html;
  };

  const isDateSelected = (date) => {
    if (!selectedStartDate) return false;
    
    if (!selectedEndDate) {
      return date.toDateString() === selectedStartDate.toDateString();
    }
    
    return date >= selectedStartDate && date <= selectedEndDate;
  };

  const selectDate = (date) => {
    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
      setSelectedStartDate(date);
      setSelectedEndDate(null);
    } else {
      if (date < selectedStartDate) {
        setSelectedEndDate(selectedStartDate);
        setSelectedStartDate(date);
      } else {
        setSelectedEndDate(date);
      }
    }
  };

  const renderCalendarMonths = () => {
    const currentYear = new Date().getFullYear();
    const months = [];
    
    for (let month = 0; month < 12; month++) {
      const monthDate = new Date(currentYear, month, 1);
      months.push(
        <div key={month}>
          <div className={styles.calendar_month_title}>
            {monthNames[month]} {currentYear}
          </div>
          <div className={styles.calendar_grid}>
            {createMonthCalendar(monthDate)}
          </div>
        </div>
      );
    }
    
    return months;
  };

  return (
    <div className={styles.calendar_container}>
      <div className={styles.calendar_static_header}>
        <div className={styles.calendar_title}>Период</div>
        <div className={styles.week_days}>
          <div>Пн</div>
          <div>Вт</div>
          <div>Ср</div>
          <div>Чт</div>
          <div>Пт</div>
          <div>Сб</div>
          <div>Вс</div>
        </div>
      </div>

      <div className={styles.calendar_months_container} id="calendar-months">
        {renderCalendarMonths()}
      </div>
      
      <button className={styles.mobile_toggle_button}>
        Выбрать период
      </button>
    </div>
  );
};