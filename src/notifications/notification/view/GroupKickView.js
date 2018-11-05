import React, {
  Component
} from 'react';

import {
  Text,
  View
} from 'react-native';

/**
 * Group Kick Notification Component
 */
export default class GroupKickView extends Component {

  /**
   * Navigate to group
   */
  navToGroup = () => {
    this.props.navigation.push('GroupView', { guid: this.props.entity.params.group.guid });
  }

  render() {
    const entity = this.props.entity;
    const styles = this.props.styles;

    return (
      <View style={styles.bodyContents}>
        <Text onPress={this.navToGroup}>You were kicked off from <Text>{entity.params.group.name}</Text></Text>
      </View>
    )
  }
}