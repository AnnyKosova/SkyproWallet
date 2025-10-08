import React, { useState, useEffect, useCallback, useRef } from 'react';
import styles from './style.module.css';

export const AnalysisCalendar = ({ onDateRangeChange, onToggleView, isPeriodSelected, }) => {
  const [currentDate] = useState(new Date());
  const [selectedStartDate, setSelectedStartDate] = useState(new Date());
  const [selectedEndDate, setSelectedEndDate] = useState(new Date());
  const hasScrolledToCurrentMonth = useRef(false);

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
    // Прокручиваем только при первой загрузке
    if (!hasScrolledToCurrentMonth.current) {
      scrollToCurrentMonth();
      hasScrolledToCurrentMonth.current = true;
    }
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

  const handleToggleButtonClick = () => {
    if (isPeriodSelected && onToggleView) {
      onToggleView('expenses');
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
        <div className={styles.calendar_title_link}
         onClick={handleToggleButtonClick}>
            <svg 
              viewBox="0 0 14 14" 
              width="14" 
              height="14" 
              fill="none"
              // Убрали customFrame и исправили другие атрибуты
            >
              <g id="vuesax/bold/arrow-left">
                <g id="arrow-left">
                  <path 
                    d="M9.44413 1.16675L4.55579 1.16675C2.43246 1.16675 1.16663 2.43258 1.16663 4.55591L1.16663 9.43841C1.16663 11.5676 2.43246 12.8334 4.55579 12.8334L9.43829 12.8334C11.5616 12.8334 12.8275 11.5676 12.8275 9.44425L12.8275 4.55591C12.8333 2.43258 11.5675 1.16675 9.44413 1.16675ZM10.5 7.43758L4.55579 7.43758L6.31163 9.19341C6.48079 9.36258 6.48079 9.64258 6.31163 9.81175C6.22413 9.89925 6.11329 9.94008 6.00246 9.94008C5.89163 9.94008 5.78079 9.89925 5.69329 9.81175L3.19079 7.30925C3.10913 7.22758 3.06246 7.11675 3.06246 7.00008C3.06246 6.88341 3.10913 6.77258 3.19079 6.69091L5.69329 4.18841C5.86246 4.01925 6.14246 4.01925 6.31163 4.18841C6.48079 4.35758 6.48079 4.63758 6.31163 4.80675L4.55579 6.56258L10.5 6.56258C10.7391 6.56258 10.9375 6.76091 10.9375 7.00008C10.9375 7.23925 10.7391 7.43758 10.5 7.43758Z" 
                    fill="rgb(153,153,153)" 
                    fillRule="nonzero" 
                  />
                </g>
              </g>
            </svg>
            <p>Анализ расходов</p>
        </div>
        <div className={styles.calendar_title_mobile}>Выбор периода</div>
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
      <div className={styles.mobile_button_fb}
        disabled={!isPeriodSelected}>
      <button 
        className={styles.mobile_toggle_button}
        onClick={handleToggleButtonClick}
      >
        Выбрать период
      </button>
      </div>
    </div>
  );
};