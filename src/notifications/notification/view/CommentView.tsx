import React, { PureComponent } from 'react';
import { Text } from 'react-native';

import _ from 'lodash';
import i18n from '../../../common/services/i18n.service';
import NotificationBody from '../NotificationBody';
import type { PropsType } from './NotificationTypes';

/**
 * Comment Notification Component
 */
export default class CommentView extends PureComponent<PropsType> {
  render() {
    const entity = this.props.entity;
    const styles = this.props.styles;
    const user_guid = '';

    const body = this.getBody(entity, user_guid);

    const is_reply = entity.params && entity.params.is_reply;

    return (
      <NotificationBody styles={styles} onPress={this.navTo} entity={entity}>
        <Text>
          <Text style={styles.link}>{entity.fromObj.name}</Text>
          <Text>
            {' '}
            {is_reply
              ? i18n.t('notification.repliedCommentOn')
              : i18n.t('notification.commentedOn')}{' '}
          </Text>
          {body}
        </Text>
      </NotificationBody>
    );
  }

  /**
   * Navigate to activity/blog
   */
  navTo = () => {
    switch (this.props.entity.entityObj.type) {
      case 'activity':
        this.props.navigation.push('Activity', {
          entity: this.props.entity.entityObj,
          hydrate: true,
          focusedUrn: this.props.entity.params.focusedCommentUrn,
        });
        break;
      case 'object':
        switch (this.props.entity.entityObj.subtype) {
          case 'blog':
            this.props.navigation.push('BlogView', {
              blog: this.props.entity.entityObj,
              hydrate: true,
              focusedUrn: this.props.entity.params.focusedCommentUrn,
            });
            break;
          case 'image':
          case 'video':
            this.props.navigation.push('Activity', {
              entity: this.props.entity.entityObj,
              hydrate: true,
              focusedUrn: this.props.entity.params.focusedCommentUrn,
            });
            break;
        }
        break;
      case 'group':
        this.props.navigation.push('GroupView', {
          guid: this.props.entity.entityObj.guid,
          tab: 'conversation',
          focusedUrn: this.props.entity.params.focusedCommentUrn,
        });
        break;
    }
  };

  /**
   * Get body based in entity.entityObj.type
   * @param {object} entity
   */
  getBody(entity, user_guid) {
    const styles = this.props.styles;

    const tempTitle = entity.entityObj.title
      ? entity.entityObj.title
      : entity.entityObj.name;

    const title = tempTitle
      ? _.truncate(tempTitle, {
          length: 30,
          separator: ' ',
          omission: '...',
        })
      : null;

    switch (entity.entityObj.type) {
      case 'activity':
        if (entity.entityObj.owner_guid == user_guid) {
          return (
            <Text style={styles.link}>
              {i18n.t('notification.yourActivity')}
            </Text>
          );
        } else {
          return (
            <Text style={styles.link}>
              {i18n.t('notification.nameActivity', {
                name: entity.entityObj.ownerObj.name,
              })}
            </Text>
          );
        }
      case 'object':
        if (title) {
          return <Text style={styles.link}>{title}</Text>;
        } else if (entity.entityObj.owner_guid == user_guid) {
          return (
            <Text style={styles.link}>
              {i18n.t('your')} {this.getSubtypeTranslation()}
            </Text>
          );
        } else {
          return (
            <Text style={styles.link}>
              {i18n.t('notification.comment', {
                name: entity.entityObj.ownerObj.name,
                subtype: this.getSubtypeTranslation(),
              })}
            </Text>
          );
        }
      case 'group': {
        return (
          <Text style={styles.link}>
            {i18n.t('notification.groupComment', { title })}
          </Text>
        );
      }
      default:
        return <Text>... oops.</Text>;
    }
  }

  getSubtypeTranslation() {
    return i18n.t('subtype.' + this.props.entity.entityObj.subtype);
  }
}
