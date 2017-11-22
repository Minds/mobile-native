import React, { Component } from 'react';

import {
  Text,
  View
} from 'react-native';

/**
 * Tag Notification Component
 */
export default class TagView extends Component {


  render() {
    const entity = this.props.entity;
    const styles = this.props.styles;

    const isComment = entity.entityObj.type != 'comment';

    return (
      <View style={styles.bodyContents}>
        <Text>{entity.fromObj.name} {isComment ? 'tagged you in a comment' : 'tagged you in a post' } </Text>
      </View>
    )
  }
}