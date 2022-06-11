// @ts-nocheck
import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import cx from 'classnames';
import dayjs from 'dayjs';
import { debounce } from '../helpers';
// import "assets/scss/styles.scss";
import DateInputGroup from './DateInputGroup';
import Dialog from './Dialog';
import DialogWrapper from './DialogWrapper';
import { FC } from 'react';
import { HTMLAttributes } from 'react';

export interface ISingleDatePicker extends HTMLAttributes<HTMLOrSVGElement> {
  startDate?: Date;
  startDatePlaceholder?: string;
  disabled?: boolean;
  startWeekDay?: 'monday' | 'sunday';
  minDate?: Date;
  maxDate?: Date;
  dateFormat?: string;
  monthFormat?: string;
  weekDayFormat?: string;
  highlightToday?: boolean;
  isOpen?: boolean;
  onCloseCalendar?: Function;
  singleCalendar?: boolean;
}

export const SingleDatePicker: FC<ISingleDatePicker> = ({
  startDate = null,
  startDatePlaceholder = 'Date',
  className = '',
  disabled = false,
  onChange,
  onFocus,
  startWeekDay = 'monday',
  minDate = null,
  maxDate = null,
  dateFormat = '',
  monthFormat = '',
  highlightToday = false,
  isOpen = false,
  onCloseCalendar,
  singleCalendar,
  weekDayFormat = 'dd',
}) => {
  const [complsOpen, setComplsOpen] = useState(false);
  const containerRef = useRef(null);
  const [fromDate, setFromDate] = useState();
  const fromDateRef = useRef();
  const [hoverDate, setHoverDate] = useState();
  const [isMobile, setIsMobile] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(false);

  function handleResize() {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  }

  useLayoutEffect(() => {
    handleResize();
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);

      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  function handleDocumentClick(e) {
    if (
      containerRef.current &&
      containerRef.current.contains(e.target) === false &&
      window.innerWidth >= 768
    ) {
      setComplsOpen(false);
    }
  }

  function notifyChange() {
    const _startDate = fromDateRef.current
      ? fromDateRef.current.toDate()
      : null;
    onChange(_startDate);
  }

  const debounceNotifyChange = debounce(notifyChange, 20);

  function updateFromDate(dateValue, shouldNotifyChange = false) {
    setFromDate(dateValue);
    fromDateRef.current = dateValue;
    if (shouldNotifyChange) {
      debounceNotifyChange();
    }
  }

  useEffect(() => {
    setComplsOpen(isOpen);
    setIsFirstTime(true);
    if (startDate) {
      updateFromDate(dayjs(startDate), false);
    }

    document.addEventListener('click', handleDocumentClick);

    return () => document.removeEventListener('click', handleDocumentClick);
  }, []);

  useEffect(() => {
    const _startDateJs = startDate ? dayjs(startDate) : null;
    fromDateRef.current = _startDateJs;
    setFromDate(_startDateJs);
  }, [startDate]);

  useEffect(() => {
    if (!complsOpen && isFirstTime) {
      onCloseCalendar && onCloseCalendar(startDate);
    }
  }, [complsOpen]);

  useEffect(() => {
    setComplsOpen(isOpen);
  }, [isOpen]);

  function toggleDialog() {
    setComplsOpen(!complsOpen);
  }

  function handleClickDateInput() {
    if (disabled) return;

    if (!complsOpen) {
      setComplsOpen(true);
    }

    onFocus('Start Date');
  }

  function onSelectDate(date) {
    if (
      (minDate && dayjs(minDate).isAfter(date, 'date')) ||
      (maxDate && dayjs(maxDate).isBefore(date, 'date'))
    ) {
      return;
    }
    updateFromDate(date, true);
  }

  function onHoverDate(date) {
    setHoverDate(date);
  }

  function handleReset() {
    updateFromDate(null, true);
    setHoverDate(null);
  }

  function onDateInputFocus() {
    handleClickDateInput();
  }

  return (
    <div className="react-google-flight-datepicker">
      <div
        className={cx('date-picker', className, {
          disabled,
        })}
        ref={containerRef}
      >
        <DateInputGroup
          handleClickDateInput={handleClickDateInput}
          showCalendarIcon
          fromDate={fromDate}
          minDate={minDate}
          maxDate={maxDate}
          handleChangeDate={onSelectDate}
          startDatePlaceholder={startDatePlaceholder}
          dateFormat={dateFormat}
          onFocus={onDateInputFocus}
          isSingle
        />
        <DialogWrapper isMobile={isMobile}>
          <Dialog
            complsOpen={complsOpen}
            toggleDialog={toggleDialog}
            handleClickDateInput={handleClickDateInput}
            inputFocus="from"
            onSelectDate={onSelectDate}
            onHoverDate={onHoverDate}
            fromDate={fromDate}
            hoverDate={hoverDate}
            handleReset={handleReset}
            handleChangeDate={onSelectDate}
            startDatePlaceholder={startDatePlaceholder}
            startWeekDay={startWeekDay}
            minDate={minDate}
            maxDate={maxDate}
            dateFormat={dateFormat}
            monthFormat={monthFormat}
            isMobile={isMobile}
            highlightToday={highlightToday}
            isSingle
            weekDayFormat={weekDayFormat}
            singleCalendar={singleCalendar}
          />
        </DialogWrapper>
      </div>
    </div>
  );
};

export default SingleDatePicker;
