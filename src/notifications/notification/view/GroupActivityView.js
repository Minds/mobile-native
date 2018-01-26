import React, {
  Component
} from 'react';

import {
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

/**
 * Group Activity Notification Component
 */
export default class GroupActivityView extends Component {

  /**
   * Navigate to group
   */
  navToGroup = () => {
    this.props.navigation.navigate('Activity', { entity: this.props.entity.entityObj });
  }

  render() {
    const entity = this.props.entity;
    const styles = this.props.styles;

    return (
      <TouchableOpacity style={styles.bodyContents} onPress={this.navToGroup}>
        <Text>
          <Text style={styles.link}>{entity.fromObj.name}</Text>
          <Text> posted in </Text>
          <Text style={styles.link}>{entity.params.group.name}</Text>
        </Text>
      </TouchableOpacity>
    )
  }
}