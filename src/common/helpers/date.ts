//@ts-nocheck
import moment from 'moment-timezone';

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function frendlyTime(date) {
  const now = moment();

  const diff = moment.duration(now.diff(date));

  if (diff.years() > 0) {
    return `${diff.years()}y ago`;
  }

  if (diff.weeks() > 0) {
    return `${diff.weeks()}w ago`;
  }

  if (diff.days() > 0) {
    return `${diff.days()}d ago`;
  }

  if (diff.hours() > 0) {
    return `${diff.hours()}h ago`;
  }

  if (diff.minutes() > 0) {
    return `${diff.minutes()}m ago`;
  }

  return `${diff.seconds()}s ago`;
}

export default function formatDate(
  timestamp,
  format = 'datetime',
  timezone = '',
) {
  let options;

  let date = moment(timestamp * 1000);

  if (timezone) date.tz(timezone);

  switch (format) {
    case 'date':
      options = 'MMM DD, YYYY';
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
