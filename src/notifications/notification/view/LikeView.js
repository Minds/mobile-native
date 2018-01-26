import React, {
  Component
} from 'react';

import {
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

/**
 * Like Notification Component
 */
export default class LikeView extends Component {

  message = 'voted up';

  render() {
    const entity = this.props.entity;
    const styles = this.props.styles;

    const body = this.getBody(entity);

    return (
      <TouchableOpacity style={styles.bodyContents} onPress={this.navToActivity}>
        {body}
      </TouchableOpacity>
    )
  }

  /**
   * Navigate to group
   */
  navToGroup = () => {
    this.props.navigation.navigate('GroupView', { guid: this.props.entity.entityObj.guid });
  }

  /**
   * Navigate to activity
   */
  navToActivity = () => {
    this.props.navigation.navigate('Activity', { entity: this.props.entity.entityObj });
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
          <Text>{entity.fromObj.name} {this.message} <Text style={styles.link}> your comment </Text></Text>
        )
      case "activity":
        if (entity.entityObj.title) {
          return (
            <Text> {entity.fromObj.name} {this.message} <Text style={styles.link}>{entity.entityObj.title}</Text></Text>
          )
        } else {
          return (
            <Text> {entity.fromObj.name} {this.message} <Text style={styles.link}>your activity</Text></Text>
          )
        }
      case "object":
        if (entity.entityObj.title) {
          return (
            <Text> {entity.fromObj.name} {this.message} <Text style={styles.link}>{entity.entityObj.title}</Text></Text>
          )
        } else {
          return (
            <Text> {entity.fromObj.name} {this.message} <Text style={styles.link}>your {entity.entityObj.subtype}</Text></Text>
          )
        }
      default:
        return (
            <Text>... oops.</Text>
        )
    }
  }
}