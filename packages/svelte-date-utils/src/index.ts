import { AdapterDate } from './AdapterDate.js';
import { createDateUtils } from './createDateUtils.js';

export { AdapterDate } from './AdapterDate.js';
export type { AdapterDateOptions } from './AdapterDate.js';
export { createDateUtils } from './createDateUtils.js';
export type { DateUtils, TimeLike, YearLike } from './createDateUtils.js';
export type { DateAdapter } from './types.js';

/**
 * The helpers on the native `Date`, with the names and behavior of `@wojtekmaj/date-utils`.
 * For date-fns or Luxon, call `createDateUtils` with `AdapterDateFns` or `AdapterLuxon`
 * from `svelte-date-utils/date-fns` or `svelte-date-utils/luxon`.
 */
export const dateUtils = createDateUtils(new AdapterDate());

export const {
  getYear,
  getMonth,
  getMonthHuman,
  getDate,
  getHours,
  getMinutes,
  getSeconds,
  getMilliseconds,
  getCenturyStart,
  getPreviousCenturyStart,
  getNextCenturyStart,
  getCenturyEnd,
  getPreviousCenturyEnd,
  getNextCenturyEnd,
  getCenturyRange,
  getDecadeStart,
  getPreviousDecadeStart,
  getNextDecadeStart,
  getDecadeEnd,
  getPreviousDecadeEnd,
  getNextDecadeEnd,
  getDecadeRange,
  getYearStart,
  getPreviousYearStart,
  getNextYearStart,
  getYearEnd,
  getPreviousYearEnd,
  getNextYearEnd,
  getYearRange,
  getMonthStart,
  getPreviousMonthStart,
  getNextMonthStart,
  getMonthEnd,
  getPreviousMonthEnd,
  getNextMonthEnd,
  getMonthRange,
  getDayStart,
  getPreviousDayStart,
  getNextDayStart,
  getDayEnd,
  getPreviousDayEnd,
  getNextDayEnd,
  getDayRange,
  getDaysInMonth,
  getHoursMinutes,
  getHoursMinutesSeconds,
  getISOLocalMonth,
  getISOLocalDate,
  getISOLocalDateTime,
} = dateUtils;
