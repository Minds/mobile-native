import React, { useCallback } from 'react';
import UserModel from '../../UserModel';
import { observer } from 'mobx-react';
import { Alert } from 'react-native';
import { Button, ButtonPropsType, Icon } from '~ui';
import serviceProvider from '~/services/serviceProvider';

export interface SubscribeProps {
  channel: UserModel;
  text?: string;
  testID?: string;
  /**
   * whether the subscribe button should only show a plus/check icon
   */
  mini?: boolean;
  /**
   * whether the feed should update to remove/add posts of the unsubscribed/subscribed user
   */
  shouldUpdateFeed?: boolean;
  /**
   * subscribe button was pressed
   */
  onSubscribed?: (user: UserModel) => void;
  disabled?: boolean;
  buttonProps?: Partial<ButtonPropsType>;
}

const HITSLOP = {
  hitSlop: 10,
};

const Subscribe = (props: SubscribeProps) => {
  const { channel, mini, onSubscribed } = props;
  const i18n = serviceProvider.i18n;
  const subscriptionText =
    props.text ??
    (channel.subscribed
      ? i18n.t('channel.subscribed')
      : i18n.t('channel.subscribe'));

  const onSubscriptionPress = useCallback(() => {
    if (channel.subscribed) {
      Alert.alert(i18n.t('attention'), i18n.t('channel.confirmUnsubscribe'), [
        {
          text: i18n.t('yesImSure'),
          onPress: () => channel.toggleSubscription(),
        },
        { text: i18n.t('no') },
      ]);
    } else {
      onSubscribed?.(channel);
      return channel.toggleSubscription();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channel.subscribed, channel.toggleSubscription, onSubscribed]);

  return (
    <Button
      mode="solid"
      type={channel.subscribed ? 'base' : 'action'}
      size="tiny"
      disabled={props.disabled}
      onPress={onSubscriptionPress}
      pressableProps={HITSLOP}
      icon={
        mini && (
          <Icon
            name={channel.subscribed ? 'check' : 'plus'}
            color={
              serviceProvider.styles.theme ? 'PrimaryBackground' : 'PrimaryText'
            }
            size="small"
            horizontal="S"
          />
        )
      }
      testID={props.testID}
      {...props.buttonProps}>
      {mini ? undefined : subscriptionText}
    </Button>
  );
};

export default observer(Subscribe);
