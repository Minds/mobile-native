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
      if (this.props.entity.params && this.props.entity.params.parent && this.props.entity.params.parent.type === 'object') {
        entityService.getEntity(this.props.entity.entityObj.parent_guid )
          .then((entity) => {
            this.props.navigation.navigate('Activity', { entity: entity });
          })
          .catch(err => {
            console.log('error');
            throw "Ooops";
          })
      } else {
        this.props.navigation.navigate('Activity', { entity: this.props.entity.entityObj });
      }
    } else {
      this.props.navigation.navigate('Activity', { entity: this.props.entity.entityObj });
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