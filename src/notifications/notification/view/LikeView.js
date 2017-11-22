import React, { Component } from 'react';

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
          <View>
            <Text>{entity.fromObj.name} down voted <Text style={styles.link}> your comment </Text></Text>
          </View>
        )
      case "activity":
        return (
          <View>
            entity.entityObj.title && <Text> {entity.fromObj.name} down voted <Text style={styles.link}>{ entity.entityObj.title }</Text></Text>
            !entity.entityObj.title && <Text> {entity.fromObj.name} down voted <Text style={styles.link}>your activity</Text></Text>
          </View>
        )
      case "object":
        return (
          <View>
            <Text>{entity.fromObj.name}</Text>
            entity.entityObj.title && <Text style={styles.link}>{entity.entityObj.title}</Text>
            !entity.entityObj.title && <Text style={styles.link}> your {entity.entityObj.subtype}</Text>
          </View>
        )
      default:
        return (
          <View>
            <Text>... oops.</Text>
          </View>
        )
    }
  }
}