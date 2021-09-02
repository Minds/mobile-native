import React, { useCallback } from 'react';
import Button from '../../../common/components/ButtonV2';
import i18n from '../../../common/services/i18n.service';
import UserModel from '../../UserModel';
import { observer } from 'mobx-react';
import { Alert } from 'react-native';

const Subscribe = (props: { channel: UserModel; testID?: string }) => {
  const subscriptionText = props.channel.subscribed
    ? i18n.t('channel.subscribed')
    : i18n.t('channel.subscribe');

  const onSubscriptionPress = useCallback(() => {
    if (props.channel.subscribed) {
      Alert.alert(i18n.t('attention'), i18n.t('channel.confirmUnsubscribe'), [
        {
          text: i18n.t('yesImSure'),
          onPress: () => props.channel.toggleSubscription(),
        },
        { text: i18n.t('no') },
      ]);
    } else {
      return props.channel.toggleSubscription();
    }
  }, [props.channel.subscribed, props.channel.toggleSubscription]);

  return (
    <Button
      action={!props.channel.subscribed}
      activeOpacity={0.7}
      text={subscriptionText}
      onPress={onSubscriptionPress}
      xSmall
      testID={props.testID}
    />
  );
};

export default observer(Subscribe);
