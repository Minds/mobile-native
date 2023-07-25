import moment from 'moment';

export const dateFormat = (val: number) =>
  moment(val * 1000).format('ddd, MMM do');
export const timeFormat = (val: number) => moment(val * 1000).format('HH:mm');
