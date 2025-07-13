import React, { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarFilterProps {
  startDate: string;
  endDate: string;
  onDateRangeChange: (start: string, end: string) => void;
}

export const CalendarFilter: React.FC<CalendarFilterProps> = ({
  startDate,
  endDate,
  onDateRangeChange
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectingStart, setSelectingStart] = useState(true);

  const formatDate = (date: string) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString();
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const handleDateClick = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    
    if (selectingStart) {
      onDateRangeChange(dateString, endDate);
      setSelectingStart(false);
    } else {
      onDateRangeChange(startDate, dateString);
      setSelectingStart(true);
      setIsOpen(false);
    }
  };

  const isDateInRange = (date: Date) => {
    if (!startDate || !endDate) return false;
    const start = new Date(startDate);
    const end = new Date(endDate);
    return date >= start && date <= end;
  };

  const isDateSelected = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return dateString === startDate || dateString === endDate;
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const days = getDaysInMonth(currentMonth);
  const monthYear = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="calendar-filter">
      <label className="filter-label">
        <Calendar size={16} />
        Date Range
      </label>
      
      <div className="date-input-container">
        <button
          className="date-input"
          onClick={() => setIsOpen(!isOpen)}
        >
          {startDate && endDate 
            ? `${formatDate(startDate)} - ${formatDate(endDate)}`
            : 'Select date range'
          }
        </button>
      </div>

      {isOpen && (
        <div className="calendar-dropdown">
          <div className="calendar-header">
            <button onClick={() => navigateMonth('prev')}>
              <ChevronLeft size={16} />
            </button>
            <span className="month-year">{monthYear}</span>
            <button onClick={() => navigateMonth('next')}>
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="calendar-grid">
            <div className="weekdays">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="weekday">{day}</div>
              ))}
            </div>
            
            <div className="days">
              {days.map((date, index) => (
                <div key={index} className="day-cell">
                  {date && (
                    <button
                      className={`day ${isDateSelected(date) ? 'selected' : ''} ${isDateInRange(date) ? 'in-range' : ''}`}
                      onClick={() => handleDateClick(date)}
                    >
                      {date.getDate()}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="calendar-footer">
            <span className="selection-hint">
              {selectingStart ? 'Select start date' : 'Select end date'}
            </span>
            <button
              className="clear-btn"
              onClick={() => {
                onDateRangeChange('', '');
                setIsOpen(false);
                setSelectingStart(true);
              }}
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
};