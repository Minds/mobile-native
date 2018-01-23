import React, {
  Component
} from 'react';

import {
  Text,
  View
} from 'react-native';

/**
 * Group Activity Notification Component
 */
export default class GroupActivityView extends Component {

  /**
   * Navigate to group
   */
  navToGroup = () => {
    this.props.navigation.navigate('GroupView', { guid: this.props.entity.entityObj.guid });
  }

  render() {
    const entity = this.props.entity;
    const styles = this.props.styles;

    return (
      <View style={styles.bodyContents}>
        <Text onPress={this.navToGroup}>
          <Text style={styles.link}>{entity.fromObj.name}</Text>
          <Text> posted in </Text>
          <Text style={styles.link}>{entity.params.group.name}</Text>
        </Text>
      </View>
    )
  }
}