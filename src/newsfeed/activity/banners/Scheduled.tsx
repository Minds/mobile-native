import React from 'react';
import Banner from './Banner';
import sp from '~/services/serviceProvider';

type PropsType = {
  isScheduled: boolean;
  time_created: string;
};

const Scheduled = ({ isScheduled, time_created }: PropsType) => {
  if (!isScheduled) {
    return null;
  }
  const i18n = sp.i18n;
  const message = `${i18n.t('activity.scheduled')} ${i18n.date(
    Number(time_created) * 1000,
  )}.`;
  return <Banner message={message} />;
};

export default Scheduled;
