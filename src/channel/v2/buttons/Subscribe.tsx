import React from 'react';
import Button from '../../../common/components/Button';
import i18n from '../../../common/services/i18n.service';
import { ChannelButtonsPropsType } from '../ChannelButtons';

const Subscribe = (props: ChannelButtonsPropsType) => {
  const subscriptionText = '+ ' + i18n.t('channel.subscribe');
  return (
    <Button
      text={subscriptionText}
      onPress={props.store.channel!.toggleSubscription}
      xSmall
    />
  );
};

export default Subscribe;
