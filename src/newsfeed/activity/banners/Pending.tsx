import React from 'react';
import i18n from '../../../common/services/i18n.service';
import Banner from './Banner';

type PropsType = {
  isPending: boolean | undefined;
};

const Pending = ({ isPending }: PropsType) => {
  if (!isPending) {
    return null;
  }
  const message = i18n.t('activity.pendingModeration');
  return <Banner message={message} />;
};

export default Pending;
