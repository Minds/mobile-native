import React, {
  Component
} from 'react';

import {
  Text,
  View
} from 'react-native';

/**
 * Group Queue Add Component
 */
export default class GroupQueueAddView extends Component {

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
        <Text onPress={this.navToGroup}>Your post for <Text style={styles.link}>{entity.params.group.name}</Text> is awaiting approval from group administrators</Text>
      </View>
    )
  }
}