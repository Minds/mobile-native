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

  render() {
    const entity = this.props.entity;
    const styles = this.props.styles;

    //TODO: navigate to group entity.params.group.guid on click
    return (
      <View style={styles.bodyContents}>
        <Text>You were kicked off from <Text>{entity.params.group.name}</Text></Text>
      </View>
    )
  }
}