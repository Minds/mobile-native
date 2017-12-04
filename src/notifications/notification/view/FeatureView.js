import React, {
  Component
} from 'react';

import {
  Text,
  View
} from 'react-native';

/**
 * Feature Notification Component
 */
export default class FeatureView extends Component {

  render() {
    const entity = this.props.entity;
    const styles = this.props.styles;

    //TODO: navigate to group entity.params.group.guid on click
    return (
      <View style={styles.bodyContents}>
        <Text><Text style={styles.link}>{entity.entityObj.title}</Text>was featured</Text>
      </View>
    )
  }
}