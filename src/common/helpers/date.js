export default function formatDate(timestamp, format=null) {
  const t = new Date(timestamp * 1000);

  const months = [
    'JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'
  ]

  return months[t.getMonth()] + ' ' + t.getDate() + ', ' + t.getFullYear() 
    + ' ' + t.getHours() + ':' + t.getMinutes();
}