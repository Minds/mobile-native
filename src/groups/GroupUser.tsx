import React from 'react';

import {
  StyleSheet
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';

import DiscoveryUser from '../discovery/DiscoveryUser';


/**
 * Group user component
 */
export default
class GroupUser extends DiscoveryUser {

  /**
   * Handle right button press
   */
  handlePress = () => {
    this.props.onRightIconPress(this.props.row.item)
  }

  /**
   * Render right button
   */
  renderRightButton() {
    const item = this.props.row.item;
    if (!(this.props.isOwner || this.props.isModerator) ||
      item.isOwner() ||
      this.props.isModerator && this.props.row.item['is:owner']) {
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