import React, {
  Component
} from 'react';

import {
  Text,
  View
} from 'react-native';

/**
 * Like Notification Component
 */
export default class LikeView extends Component {

  render() {
    const entity = this.props.entity;
    const styles = this.props.styles;

    const body = this.getBody(entity);

    return (
      <View style={styles.bodyContents}>
        {body}
      </View>
    )
  }

  /**
   * Get body based in entity.entityObj.type
   * @param {object} entity
   */
  getBody(entity) {
    const styles = this.props.styles;

    if (!entity.entityObj) {
      return (
        <Text>This post was deleted</Text>
      )
    }

    switch (entity.entityObj.type) {
      case "comment":
        return (
            <Text>{entity.fromObj.name} down voted <Text style={styles.link}> your comment </Text></Text>
        )
      case "activity":
        if (entity.entityObj.title) {
          return (
            <Text> {entity.fromObj.name} down voted <Text style={styles.link}>{entity.entityObj.title}</Text></Text>
          )
        } else {
          return (
            <Text> {entity.fromObj.name} down voted <Text style={styles.link}>your activity</Text></Text>
          )
        }
      case "object":
        if (entity.entityObj.title) {
          return (
            <Text> {entity.fromObj.name} <Text style={styles.link}>{entity.entityObj.title}</Text></Text>
          )
        } else {
          return (
            <Text> {entity.fromObj.name} <Text style={styles.link}>your {entity.entityObj.subtype}</Text></Text>
          )
        }
      default:
        return (
            <Text>... oops.</Text>
        )
    }
  }
}