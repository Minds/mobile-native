import React, {
  Component
} from 'react';

import {
  NavigationActions
} from 'react-navigation';

import {
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

import _ from 'lodash';

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
      <TouchableOpacity onPress={this.navTo}>
        <Text >
          <Text style={styles.link}>{entity.fromObj.name}</Text>
          <Text> commented on </Text>
          { body }
        </Text>
      </TouchableOpacity>
    );
  }

  /**
   * Navigate to activity/blog
   */
  navTo = () => {
    switch (this.props.entity.entityObj.type ) {
      case 'activity':
        this.props.navigation.navigate('Activity', { entity: this.props.entity.entityObj, hydrate: true });
        break;
      case 'object':
        switch(this.props.entity.entityObj.subtype) {
          case 'blog':
            this.props.navigation.navigate('BlogView', { blog: this.props.entity.entityObj, hydrate: true });
            break;
          case 'image':
          case 'video':
            this.props.navigation.navigate('Activity', { entity: this.props.entity.entityObj, hydrate: true });
            break;
        }
        break;
    }
  }

  /**
   * Get body based in entity.entityObj.type
   * @param {object} entity
   */
  getBody(entity, user_guid) {
    const styles = this.props.styles;

    const title = entity.entityObj.title ? _.truncate(entity.entityObj.title, {
      'length': 30,
      'separator': ' ',
      'omission': '...'
    }) : null;

    switch (entity.entityObj.type) {
      case "activity":
        if (entity.entityObj.owner_guid == user_guid) {
          return <Text style={styles.link}>your activity</Text>
        } else {
          return <Text style={styles.link}>{entity.entityObj.ownerObj.name}'s activity</Text>
        }
      case "object":
        if (title) {
          return <Text style={styles.link}>{title}</Text>
        } else if (entity.entityObj.owner_guid == user_guid) {
          return <Text style={styles.link}>your {entity.entityObj.subtype}</Text>
        } else {
          return <Text style={styles.link}>{entity.entityObj.ownerObj.name}'s {entity.entityObj.subtype}</Text>
        }
      default:
        return <Text>... oops.</Text>
    }
  }
}
