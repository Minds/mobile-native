import React, {
  Component
} from 'react';

import {
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

/**
 * Tag Notification Component
 */
export default class TagView extends Component {
  /**
   * Navigate to activity
   */
  navToActivity = () => {
    const isComment = this.props.entity.entityObj.type == 'comment';
    if (isComment) {
      this.props.navigation.navigate('Comments', { entity: this.props.entity.entityObj });
    } else {
      this.props.navigation.navigate('Activity', { entity: this.props.entity.entityObj });
    }
  }

  render() {
    const entity = this.props.entity;
    const styles = this.props.styles;

    const isComment = entity.entityObj.type != 'comment';

    return (
      <TouchableOpacity style={styles.bodyContents} onPress={this.navToActivity}>
        <Text>{entity.fromObj.name} {isComment ? 'tagged you in a comment' : 'tagged you in a post' } </Text>
      </TouchableOpacity>
    )
  }
}