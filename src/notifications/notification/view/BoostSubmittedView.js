import React, { Component } from 'react';

import {
  Text,
  View
} from 'react-native';

/**
 * BoostSubmitted Notification Component
 */
export default class BoostSubmittedView extends Component {


  render() {
    const entity = this.props.entity;
    const styles = this.props.styles;

    const isComment = entity.entityObj.type != 'comment';

    const description = this.getDescription(entity);

    return (
      <View style={styles.bodyContents}>
        <Text>{entity.params.impressions} views {description}</Text>
      </View>
    )
  }

  getDescription() {

    if (!entity.entityObj) return '';

    let desc = 'for ';

    if (entity.entityObj.title) {
      desc += entity.entityObj.title;
    } else if (entity.entityObj.name) {
      desc += entity.entityObj.name;
    } else if (entity.entityObj.type !== 'user') {
      desc += 'your post';
    } else {
      desc += 'your channel';
    }
    return desc;
  }
}