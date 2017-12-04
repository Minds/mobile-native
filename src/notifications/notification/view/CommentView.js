import React, {
  Component
} from 'react';

import {
  NavigationActions
} from 'react-navigation';

import {
  Text,
  View
} from 'react-native';

/**
 * Comment Notification Component
 */
export default class CommentView extends Component {

  render() {
    const entity = this.props.entity;
    const styles = this.props.styles;
    const user_guid = '';

    const body = this.getBody(entity, user_guid);

    return (
      <View>
        <Text>{entity.fromObj.name}</Text>
        <Text>commented on</Text>
        { body }
      </View>
    );
  }

  /**
   * Get body based in entity.entityObj.type
   * @param {object} entity
   */
  getBody(entity, user_guid) {
    switch (entity.entityObj.type) {
      case "activity":
        if (entity.entityObj.owner_guid == user_guid) {
          return <Text>your activity</Text>
        } else {
          return <Text>{entity.entityObj.ownerObj.name}'s activity</Text>
        }
      case "object":
        if (entity.entityObj.title) {
          return <Text>{entity.entityObj.title}</Text>
        } else if (entity.entityObj.owner_guid == user_guid) {
          return <Text>your {entity.entityObj.subtype}</Text>
        } else {
          return <Text>{entity.entityObj.ownerObj.name}'s {entity.entityObj.subtype}</Text>
        }
      default:
        return <Text>... oops.</Text>
    }
  }
}