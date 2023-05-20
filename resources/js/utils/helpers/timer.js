import moment from "moment/moment";

const DATE_TIME_SECONDS_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const DATE_TIME_T_MINUTES_FORMAT = 'YYYY-MM-DDTHH:mm';
const YEAR_MONTH_DAY_FORMAT = 'YYYY-MM-DD';
const YEAR_MONTH_FORMAT = 'YYYY-MM';
const DATE_PICKER_YEAR_MONTH_FORMAT = 'YYYY/MM';
const TIME_SECONDS_FORMAT = 'HH:mm';
const VN_TIME_ZONE = 'Asia/Bangkok';
const DAY_SECONDS = 24 * 60 * 60;
const DATE_LIMIT_BEFORE = '2022-01-01';

const momentVN = (time, format = DATE_TIME_SECONDS_FORMAT) => {
  const timeMoment = time
    ? moment(time, format)
    : moment();
  const timeMomentByFormat = timeMoment.tz(VN_TIME_ZONE)
    .format(DATE_TIME_SECONDS_FORMAT);
  
  return moment(timeMomentByFormat, DATE_TIME_SECONDS_FORMAT);
}

const getTimerBySeconds = (secondsInput) => {
  let result = '';
  let secNum = parseInt(secondsInput, 10);
  let hours = Math.floor(secNum / 3600);
  let minutes = Math.floor((secNum - (hours * 3600)) / 60);
  let seconds = secNum - (hours * 3600) - (minutes * 60);
  
  if (hours > 0) {
    result += hours < 10 ? `0${hours}:` : `${hours}:`;
  }
  result += minutes < 10 ? `0${minutes}:` : `${minutes}:`;
  result += seconds < 10 ? `0${seconds}` : seconds;
  
  return result;
};

export {
  DATE_TIME_SECONDS_FORMAT,
  YEAR_MONTH_DAY_FORMAT,
  YEAR_MONTH_FORMAT,
  TIME_SECONDS_FORMAT,
  VN_TIME_ZONE,
  DAY_SECONDS,
  DATE_TIME_T_MINUTES_FORMAT,
  getTimerBySeconds,
  momentVN,
  DATE_LIMIT_BEFORE,
  DATE_PICKER_YEAR_MONTH_FORMAT
}