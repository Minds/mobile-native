import React from 'react';
import formatDate from '../../../common/helpers/date';
import i18n from '../../../common/services/i18n.service';
import Banner from './Banner';

type PropsType = {
  isScheduled: boolean;
  time_created: string;
};

const Scheduled = ({ isScheduled, time_created }: PropsType) => {
  if (!isScheduled) {
    return null;
  }
  const message = `${i18n.t('activity.scheduled')} ${formatDate(
    time_created,
  )}.`;
  return <Banner message={message} />;
};

export default Scheduled;
