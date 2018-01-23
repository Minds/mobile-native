import React, {
  Component
} from 'react';

import {
  Text,
  View
} from 'react-native';

/**
 * Group Invite Notification Component
 */
export default class GroupInviteView extends Component {

  /**
   * Navigate to group
   */
  navToGroup = () => {
    this.props.navigation.navigate('GroupView', { guid: this.props.entity.params.group.guid });
  }

  render() {
    const entity = this.props.entity;
    const styles = this.props.styles;

    return (
      <View style={styles.bodyContents}>
        <Text onPress={this.navToGroup}>{entity.params.user} invited you to join <Text>{entity.params.group.name}</Text></Text>
      </View>
    )
  }
}