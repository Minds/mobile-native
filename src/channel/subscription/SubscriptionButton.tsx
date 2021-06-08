//@ts-nocheck
import React, { Component } from 'react';

import { Alert } from 'react-native';
import { observer } from 'mobx-react';

import type UserModel from '../UserModel';

import Button from '../../common/components/Button';
import i18n from '../../common/services/i18n.service';
import Icon from 'react-native-vector-icons/Ionicons';
import ThemedStyles from '../../styles/ThemedStyles';

type PropsType = {
  channel: UserModel;
};

/**
 * Subscription request
 */
@observer
class SubscriptionButton extends Component<PropsType> {
  /**
   * On press
   */
  onPress = () => {
    const { channel } = this.props;

    if (channel.isOpen() || channel.subscribed) {
      if (channel.subscribed) {
        Alert.alert(i18n.t('attention'), i18n.t('channel.confirmUnsubscribe'), [
          {
            text: i18n.t('yesImSure'),
            onPress: () => channel.toggleSubscription(),
          },
          { text: i18n.t('no') },
        ]);
      } else {
        channel.toggleSubscription();
      }
    } else if (channel.pending_subscribe) {
      channel.cancelSubscribeRequest();
    } else {
      channel.subscribeRequest();
    }
  };

  /**
   * Render
   */
  render() {
    const { channel, ...otherProps } = this.props;

    let text,
      icon = null;

    if (channel.isOpen()) {
      text = channel.subscribed
        ? i18n.t('channel.unsubscribe')
        : i18n.t('channel.subscribe');
    } else {
      text = channel.subscribed
        ? i18n.t('channel.unsubscribe')
        : !channel.pending_subscribe
        ? i18n.t('channel.requestSubscription')
        : i18n.t('pending');
      if (channel.pending_subscribe) {
        icon = <Icon name="ios-close" style={iconStyle} size={23} />;
      }
    }

    return (
      <Button text={text} onPress={this.onPress} {...otherProps}>
        {icon}
      </Button>
    );
  }
}

const iconStyle = ThemedStyles.combine('paddingLeft', 'colorLink');

export default SubscriptionButton;
