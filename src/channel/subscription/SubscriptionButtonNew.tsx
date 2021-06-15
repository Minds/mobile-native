//@ts-nocheck
import React, { Component } from 'react';

import { Alert } from 'react-native';
import { observer } from 'mobx-react';

import UserModel from '../UserModel';

import i18n from '../../common/services/i18n.service';
import Icon from 'react-native-vector-icons/MaterialIcons';
import ListItemButton from '../../common/components/ListItemButton';
import ThemedStyles from '../../styles/ThemedStyles';

type PropsType = {
  channel: UserModel;
};

/**
 * Subscription request
 */
@observer
class SubscriptionButtonNew extends Component<PropsType> {
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
    const { channel } = this.props;
    const theme = ThemedStyles.style;

    let name,
      color = null;

    if (channel.isOpen()) {
      if (channel.subscribed) {
        name = 'check';
        color = theme.colorDone;
      } else {
        name = 'add';
        color = theme.colorIcon;
      }
    } else {
      if (channel.subscribed) {
        name = 'check';
        color = theme.colorDone;
      } else if (channel.pending_subscribe) {
        name = 'close';
        color = theme.colorIcon;
      } else {
        name = 'add';
        color = theme.colorIcon;
      }
    }

    return (
      <ListItemButton onPress={this.onPress} {...this.props}>
        <Icon name={name} size={26} style={color} />
      </ListItemButton>
    );
  }
}

export default SubscriptionButtonNew;
