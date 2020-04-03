//@ts-nocheck
import React, {
  PureComponent
} from 'react';

import {
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

import entityService from '../../../common/services/entity.service';
import logService from '../../../common/services/log.service';

import i18n from '../../../common/services/i18n.service';

/**
 * Tag Notification Component
 */
export default class TagView extends PureComponent {
  /**
   * Navigate to activity
   */
  navToActivity = () => {
    const isComment = this.props.entity.entityObj.type == 'comment';
    if (isComment) {
      if (this.props.entity.params && this.props.entity.params.parent) {
        if (this.props.entity.params.parent.type === 'group') {
          this.props.navigation.push('GroupView', { guid: this.props.entity.params.parent.guid, focusedUrn: this.props.entity.params.focusedCommentUrn, tab: 'conversation' });
        } else if (this.props.entity.params.parent.subtype === 'blog') {
          this.props.navigation.push('BlogView', { guid: this.props.entity.params.parent.guid, focusedUrn: this.props.entity.params.focusedCommentUrn });
        } else {
          entityService.getEntity(this.props.entity.params.parent.guid)
            .then((entity) => {
              this.props.navigation.push('Activity', { entity, focusedUrn: this.props.entity.params.focusedCommentUrn });
            })
            .catch(err => {
              logService.exception('[TagView]', err);
              throw "Oops, an error has occurred navigating.";
            });
        }
      }
    } else {
      this.props.navigation.push('Activity', { entity: this.props.entity.entityObj, hydrate: true });
    }
  }

  /**
   * Render
   */
  render() {
    const entity = this.props.entity;
    const styles = this.props.styles;

    const isComment = entity.entityObj.type === 'comment';
    const isConversation = this.props.entity.params.parent && this.props.entity.params.parent.type === 'group';

    return (
      <TouchableOpacity style={styles.bodyContents} onPress={this.navToActivity}>
        <Text>{entity.fromObj.name} {isComment ? (isConversation ? i18n.t('notification.tagConversation') : i18n.t('notification.tagComment')) : i18n.t('notification.tagPost')}</Text>
      </TouchableOpacity>
    )
  }
}
