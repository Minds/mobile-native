import React from 'react';
import Banner from './Banner';
import sp from '~/services/serviceProvider';

type PropsType = {
  isPending: boolean | undefined;
};

const Pending = ({ isPending }: PropsType) => {
  if (!isPending) {
    return null;
  }
  const message = sp.i18n.t('activity.pendingModeration');
  return <Banner message={message} />;
};

export default Pending;
