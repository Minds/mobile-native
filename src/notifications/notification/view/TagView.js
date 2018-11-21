import React, {
  Component
} from 'react';

import {
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

import entityService from '../../../common/services/entity.service';

/**
 * Tag Notification Component
 */
export default class TagView extends Component {
  /**
   * Navigate to activity
   */
  navToActivity = () => {
    const isComment = this.props.entity.entityObj.type == 'comment';
    if (isComment) {
      if (this.props.entity.params && this.props.entity.params.parent) {
        if (this.props.entity.params.parent.subtype === 'blog') {
          this.props.navigation.push('BlogView', { guid: this.props.entity.entityObj.parent_guid });
        } else {
          entityService.getEntity(this.props.entity.entityObj.parent_guid)
            .then((entity) => {
              this.props.navigation.push('Activity', { entity: entity });
            })
            .catch(err => {
              console.log('error', err);
              throw "Ooops";
            });
        }
      }
    } else {
      this.props.navigation.push('Activity', { entity: this.props.entity.entityObj, hydrate: true });
    }
  }

  render() {
    const entity = this.props.entity;
    const styles = this.props.styles;

    const isComment = entity.entityObj.type === 'comment';

    return (
      <TouchableOpacity style={styles.bodyContents} onPress={this.navToActivity}>
        <Text>{entity.fromObj.name} {isComment ? 'tagged you in a comment' : 'tagged you in a post' } </Text>
      </TouchableOpacity>
    )
  }
}
