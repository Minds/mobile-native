// @flow
import React, {
  Component
} from 'react';

import { Alert } from 'react-native';
import type { Node } from 'react';
import { observer } from 'mobx-react';

import type UserModel from '../UserModel';

import Button from '../../common/components/Button';
import i18n from '../../common/services/i18n.service';
import { CommonStyle as CS } from '../../styles/Common';

import Icon from 'react-native-vector-icons/MaterialIcons';
import ListItemButton from '../../common/components/ListItemButton';

type PropsType = {
  channel: UserModel
};

/**
 * Subscription request
 */
export default
@observer
class SubscriptionButtonNew extends Component<PropsType> {

  /**
   * On press
   */
  onPress = () => {
    const { channel } = this.props;

    if (channel.isOpen() || channel.subscribed) {
      if (channel.subscribed) {
        Alert.alert(
          i18n.t('attention'),
          i18n.t('channel.confirmUnsubscribe'),
          [{ text: i18n.t('yesImSure'), onPress: () => channel.toggleSubscription() }, { text: i18n.t('no')}]
        );
      } else {
        channel.toggleSubscription();
      }
    } else if (channel.pending_subscribe) {
      channel.cancelSubscribeRequest();
    } else {
      channel.subscribeRequest();
    }
  }

  /**
   * Render
   */
  render(): Node {
    const {
      channel,
      ...otherProps
    } = this.props;

    let name, color = null;

    if (channel.isOpen()) {
      if (channel.subscribed) {
        name = 'check';
        color = CS.colorDone;
      } else {
        name = 'add';
        color = CS.colorActionNew;
      }
    } else {
      if (channel.subscribed) {
        name = 'check';
        color = CS.colorDone;
      } else if (channel.pending_subscribe) {
        name = 'close';
        color = CS.colorActionNew;
      } else {
        name = 'add';
        color = CS.colorActionNew;
      }
    }

    return (
      <ListItemButton onPress={this.onPress} {...this.props}>
        <Icon name={name} size={26} style={color} />
      </ListItemButton>
    )
  }
}
