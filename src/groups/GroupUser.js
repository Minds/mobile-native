import React, {
  Component
} from 'react';

import {
  StyleSheet
} from 'react-native';

import {
  observer,
  inject
} from 'mobx-react/native'
import Icon from 'react-native-vector-icons/MaterialIcons';

import DiscoveryUser from '../discovery/DiscoveryUser';


/**
 * Group user component
 */
@inject('user')
export default class GroupUser extends DiscoveryUser.wrappedComponent {

  /**
   * Handle right button press
   */
  handlePress = () => {
    this.props.onRightIconPress(this.props.entity.item)
  }

  /**
   * Render right button
   */
  renderRightButton() {
    const item = this.props.entity.item;
    if (!(this.props.isOwner || this.props.isModerator) ||
      this.props.user.me.guid === item.guid ||
      this.props.isModerator && this.props.entity.item['is:owner']) {
      return;
    }

    return <Icon style={styles.icon} size={24} color={'#888'} name="more-vert" onPress={this.handlePress} />
  };
}

const styles = StyleSheet.create({
  icon: {
    paddingRight:5
  }
})