//@ts-nocheck
import moment from 'moment-timezone';

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function frendlyTime(date) {
  const now = moment();
  const diff = moment.duration(date.diff(now));

  return diff.humanize(true);
}

export default function formatDate(
  timestamp,
  format: 'date' | 'nameDay' | 'time' | 'friendly' | 'datetime' = 'datetime',
  timezone = '',
) {
  let options;

  let date = moment(timestamp * 1000);

  if (timezone) date.tz(timezone);

  switch (format) {
    case 'date':
      options = 'MMM Do, YYYY';
      break;
    case 'nameDay':
      if (date.isSame(moment().subtract(1, 'day'), 'day')) {
        return 'Yesterday';
      }
      options = 'ddd MMM Do';
      break;
    case 'time':
      options = 'hh:mm';
      break;
    case 'friendly':
      return frendlyTime(date);
    case 'datetime':
    default:
      options = 'MMM DD, YYYY, HH:mm';
  }

  return date.format(options);

  // const months = [
  //   'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
  // ]

  // let min = ('' + t.getMinutes()).length == 1 ? '0' + t.getMinutes(): t.getMinutes();
  // return months[t.getMonth()] + ' ' + t.getDate() + ', ' + t.getFullYear()
  //   + ' ' + t.getHours() + ':' + min;
}
