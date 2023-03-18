import {defaultValues} from 'constant';
import moment from 'moment';

export const isSecondsPassed = (millis) => Date.now() > millis;
export const getDateFromFullSystemDate = (date) => {
  if (date === null || date === '') return defaultValues.STRING;

  return date.split('T')[0];
};

export function getDateDifference(
  dateA = moment(),
  dateB = moment(),
  unit = 'days',
) {
  let a = moment(dateA);
  let b = moment(dateB);
  return a.diff(b, unit);
}

export function getDateOnRequiredFormat(
  date = moment(),
  format = dateFormats.year_month_day_dash,
  currentFormat = dateFormats.YYYY_MM_DD_T_HH_MM_SS_DASH,
) {
  let m = moment(date, currentFormat).format(format);
  // console.log('getDateOnRequiredFormat ', date, m);
  return m;
}

export function addDaysToDate(
  date = moment(),
  day = 1,
  format = dateFormats.YYYY_MM_DD_T_HH_MM_SS_DASH,
) {
  return moment(date).add(day, 'days');
}

export function getMessageItemDate(date, isToday = false) {
  return moment(date).calendar({
    sameDay: isToday ? '[Today]' : 'hh:mm a', // or [Today]
    nextDay: '[Tomorrow]',
    nextWeek: 'DD MMM',
    lastDay: '[Yesterday]',
    lastWeek: 'DD MMM',
    lastYear: 'DD MMM, YYYY',
    sameElse: 'DD MMM',
  });
}

export function getCurrentMonthStartAndEndDate(dt) {
  const date = dt ? new Date(dt) : new Date();
  const fd = new Date(date.getFullYear(), date.getMonth(), 1);
  const ld = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const firstDay = moment(fd).format(dateFormats.year_month_day_dash);
  const lastDay = moment(ld).format(dateFormats.year_month_day_dash);
  return {firstDay, lastDay};
}

export function getRemainingDays(startDate, endDate) {
  let start = startDate;
  let end = endDate;
  return Math.floor(Math.abs(start - end) / (1000 * 60 * 60 * 24));
}
export function isToday(date) {
  return (
    moment(date).format(dateFormats.year_month_day_dash) ===
    moment().format(dateFormats.year_month_day_dash)
  );
}

export const dateFormats = {
  month_day_of_month: 'MMM DD',
  month_number: 'MMM',
  year_number: 'YYYY',
  month_day_of_month: 'MMM DD',
  year_month_day_dash: 'YYYY-MM-DD',
  year_month_day_slash: 'YYYY/MM/DD',
  YYYY_MM_DD_T_HH_MM_SS_DASH: "YYYY-MM-DD'T'HH:mm:ss",
  YYYY_MM_DD_T_HH_MM_SS_Z_DASH: "YYYY-MM-DD'T'HH:mm:ss'z'",
  YYYY_MM_DD_S_HH_MM_DASH: 'YYYY-MM-DD HH:mm',
  day_of_week: 'dddd',
  hour_min_24_hr: 'HH:mm',
  hour_min_12_hr: 'hh:mm', //08:23  12 Hrs format
  hour_min_12_hr_meridian: 'hh:mm a', //08:23 12 Hrs format with AM
  min_sec: 'mm:ss',
  ddd_HH_MM_SS_DD_MM_YYYY_SLASH: 'ddd hh:mm DD/MM/YYYY',
  DD_MM_YYYY_dddd_SLASH: 'dd/MM/yyyy, dddd',
  ddd_DD_MMM_SPACE: 'ddd DD MMM',
  MMM_D_COMMA_YYYY: 'MMM D, YYYY',
  MM_TEXT_DD_NUMBER_YYYY_NUMBER_HH_MM_12HRS_AM_PM: 'MMM d, yyyy hh:mm a',
  HH_MM_12HRS_AM_PM_MM_TEXT_DD_NUMBER: 'hh:mm a, MMM DD',
  DD_MMM_YYYY_DASH: 'DD-MMM-YYYY', //01-Dec-2020
};
