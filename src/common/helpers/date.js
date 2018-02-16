function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

export default function formatDate(timestamp, format = 'datetime') {
  const t = new Date(timestamp * 1000);

  let options;

  switch (format) {
    case 'date':
      options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }
      break;

    case 'time':
      options = {
        hour: '2-digit',
        minute: '2-digit',
      }
      break;

    case 'datetime':
    default:
      options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      };
  }

  return t.toLocaleString('en-US', options).toUpperCase();

  // const months = [
  //   'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
  // ]

  // let min = ('' + t.getMinutes()).length == 1 ? '0' + t.getMinutes(): t.getMinutes();
  // return months[t.getMonth()] + ' ' + t.getDate() + ', ' + t.getFullYear()
  //   + ' ' + t.getHours() + ':' + min;
}
