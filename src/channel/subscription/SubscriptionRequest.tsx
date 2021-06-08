//@ts-nocheck
import React from 'react';
import { View, Text } from 'react-native';
import type { Node } from 'react';

import type UserModel from '../UserModel';
import type SubscriptionRequestStore from './SubscriptionRequestStore';

import DiscoveryUser from '../../discovery/DiscoveryUser';
import Button from '../../common/components/Button';
import i18nService from '../../common/services/i18n.service';
import { observer } from 'mobx-react';
import ThemedStyles from '../../styles/ThemedStyles';

type PropsType = {
  row: any;
  subscriptionRequest: SubscriptionRequestStore;
};

/**
 * Subscription Request
 */
@observer
class SubscriptionRequest extends DiscoveryUser<PropsType> {
  /**
   * Get the channel from the props
   */
  getChannel(): UserModel {
    return this.props.row.item.subscriber;
  }

  /**
   * Accept the request
   */
  onAccept = () => {
    this.props.subscriptionRequest.accept(this.props.row.item);
  };

  /**
   * reject the request
   */
  onReject = () => {
    this.props.subscriptionRequest.decline(this.props.row.item);
  };

  /**
   * Render Right buttons
   */
  renderRightButton(): Node {
    if (this.props.row.item.status) {
      return (
        <View style={ThemedStyles.style.rowJustifyEnd}>
          <Text
            style={[
              this.props.row.item.status != 'requestAccepted'
                ? ThemedStyles.style.colorDanger
                : ThemedStyles.style.colorPrimary,
            ]}>
            {i18nService.t(`channel.${this.props.row.item.status}`)}
          </Text>
        </View>
      );
    }

    return (
      <View style={ThemedStyles.style.rowJustifyEnd}>
        <Button
          text={i18nService.t('accept')}
          onPress={this.onAccept}
          loading={this.props.row.item.inProgress}
          inverted
        />
        <Button
          text={i18nService.t('reject')}
          loading={this.props.row.item.inProgress}
          onPress={this.onReject}
        />
      </View>
    );
  }
}

export default SubscriptionRequest;
