import moment from 'moment';

const chatDate = (value: string | number, short: boolean): string => {
  if (typeof value === 'string') {
    value = parseInt(value);
  }

  let date = moment.unix(value);

  if (date.clone().startOf('day').isSame(moment().clone().startOf('day'))) {
    return date.format('h:mma');
  }

  if (date.clone().startOf('year').isSame(moment().clone().startOf('year'))) {
    return date.format(short ? 'MMM DD' : 'MMM DD h:mma');
  }

  return date.format(short ? 'MMM D YYYY' : 'MMM D YYYY h:mma');
};

export default chatDate;
