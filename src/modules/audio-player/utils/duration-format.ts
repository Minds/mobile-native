import moment from 'moment';

export const formatDuration = (ms: number, friendly: boolean = false) => {
  const duration = moment(ms).utc();

  if (friendly) {
    return (
      `${duration.hours() ? `${duration.hours()}h ` : ''}${
        duration.minutes() ? `${duration.minutes()}m` : ''
      }` || '0m'
    );
  } else {
    const hours = duration.hours();
    if (hours > 0) {
      return duration.format('HH:mm:ss'); // Display hours, minutes, and seconds
    } else {
      return duration.format('mm:ss'); // Display only minutes and seconds
    }
  }
};
