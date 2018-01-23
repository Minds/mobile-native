import React, {
  Component
} from 'react';

import {
  Text,
  View
} from 'react-native';

/**
 * Tag Notification Component
 */
export default class TagView extends Component {
  /**
   * Navigate to activity
   */
  navToActivity = () => {
    this.props.navigation.navigate('Activity', { entity: this.props.entity.entityObj });
  }

  render() {
    const entity = this.props.entity;
    const styles = this.props.styles;

    const isComment = entity.entityObj.type != 'comment';

    return (
      <View style={styles.bodyContents}>
        <Text onPress={this.navToActivity}>{entity.fromObj.name} {isComment ? 'tagged you in a comment' : 'tagged you in a post' } </Text>
      </View>
    )
  }
}