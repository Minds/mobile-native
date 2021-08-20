import React from 'react';
import Button from '../../../common/components/Button';
import i18n from '../../../common/services/i18n.service';
import UserModel from '../../UserModel';
import { observer } from 'mobx-react';

const Subscribe = (props: { channel: UserModel; testID?: string }) => {
  const subscriptionText = props.channel.subscribed
    ? i18n.t('channel.subscribed')
    : i18n.t('channel.subscribe');

  return (
    <Button
      action={!props.channel.subscribed}
      activeOpacity={0.7}
      text={subscriptionText}
      onPress={props.channel!.toggleSubscription}
      xSmall
      testID={props.testID}
    />
  );
};

export default observer(Subscribe);
