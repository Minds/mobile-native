import React, { PureComponent } from 'react';
import { Text, View } from 'react-native';

import i18n from '../../../common/services/i18n.service';
import NotificationBody from '../NotificationBody';
import type { PropsType } from './NotificationTypes';

/**
 * Like Notification Component
 */
export default class LikeView extends PureComponent<PropsType> {
  translatedMessage: string;

  constructor(props) {
    super(props);
    this.translatedMessage = this.getMessage();
  }

  /**
   * Get translated message
   */
  getMessage() {
    return i18n.t('notification.votedUp');
  }

  render() {
    const entity = this.props.entity;
    const styles = this.props.styles;

    const body = this.getBody(entity);

    return (
      <NotificationBody
        styles={styles}
        onPress={this.navToActivity}
        entity={entity}>
        <View style={styles.bodyContents}>{body}</View>
      </NotificationBody>
    );
  }

  /**
   * Navigate to activity
   */
  navToActivity = () => {
    let params: any = {};
    let screen = 'Activity';
    switch (this.props.entity.entityObj.type) {
      case 'comment':
        if (
          this.props.entity.params.parent &&
          this.props.entity.params.parent.type === 'group'
        ) {
          screen = 'GroupView';
          params.group = this.props.entity.params.parent;
          params.hydrate = true;
          params.tab = 'conversation';
          params.focusedUrn = this.props.entity.params.focusedCommentUrn;
        } else {
          params.guid = this.props.entity.entity.entity_guid;
          params.focusedUrn = this.props.entity.params.focusedCommentUrn;
          screen = 'Activity';
        }

        break;
      case 'object':
        switch (this.props.entity.entityObj.subtype) {
          case 'blog':
            screen = 'BlogView';
            params.blog = this.props.entity.entityObj;
            params.hydrate = true;
            break;
          case 'image':
          case 'video':
            screen = 'Activity';
            params.entity = this.props.entity.entityObj;
            params.hydrate = true;
            break;
        }
        break;
      default:
        params.entity = this.props.entity.entityObj;
        params.hydrate = true;
        break;
    }
    this.props.navigation.push(screen, params);
  };

  /**
   * Get body based in entity.entityObj.type
   * @param {object} entity
   */
  getBody(entity) {
    const styles = this.props.styles;

    if (!entity.entityObj) {
      return <Text>{i18n.t('notification.deleted')}</Text>;
    }

    switch (entity.entityObj.type) {
      case 'comment':
        return (
          <Text>
            <Text style={styles.link}>{entity.fromObj.name}</Text>{' '}
            {this.translatedMessage}{' '}
            <Text style={styles.link}>
              {' '}
              {i18n.t('notification.yourComment')}{' '}
            </Text>
          </Text>
        );
      case 'activity':
        if (entity.entityObj.title) {
          return (
            <Text>
              <Text style={styles.link}>{entity.fromObj.name}</Text>{' '}
              {this.translatedMessage}{' '}
              <Text style={styles.link}>{entity.entityObj.title}</Text>
            </Text>
          );
        } else {
          return (
            <Text>
              <Text style={styles.link}>{entity.fromObj.name}</Text>{' '}
              {this.translatedMessage}{' '}
              <Text style={styles.link}>
                {i18n.t('notification.yourActivity')}
              </Text>
            </Text>
          );
        }
      case 'object':
        if (entity.entityObj.title) {
          return (
            <Text>
              <Text style={styles.link}>{entity.fromObj.name}</Text>{' '}
              {this.translatedMessage}{' '}
              <Text style={styles.link}>{entity.entityObj.title}</Text>
            </Text>
          );
        } else {
          return (
            <Text>
              <Text style={styles.link}>{entity.fromObj.name}</Text>{' '}
              {this.translatedMessage}{' '}
              <Text style={styles.link}>
                {i18n.t('your')} {i18n.t('subtype.' + entity.entityObj.subtype)}
              </Text>
            </Text>
          );
        }
      default:
        return <Text>... oops.</Text>;
    }
  }
}
