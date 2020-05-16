import React, { Component } from 'react';
import { Linking, Text, View } from 'react-native';
import { MINDS_LINK_URI } from '../../../config/Config';

import sessionService from '../../../common/services/session.service';
import type { PropsType } from './NotificationTypes';
import NotificationBody from '../NotificationBody';

/**
 * Report Actioned Notification Component
 */
export default class ReportActionedView extends Component<PropsType> {
  navToReports = () => {
    Linking.openURL(MINDS_LINK_URI + 'settings/reported-content/');
  };

  /**
   * Render
   */
  render() {
    const styles = this.props.styles;
    const entity = this.props.entity;

    const isOwn = entity.entityObj.owner_guid === sessionService.guid;

    let text;

    if (entity.entityObj.type === 'activity') {
      if (isOwn && !entity.entityObj.title) {
        text = <Text>Your post has been {entity.params.action}</Text>;
      } else if (isOwn && entity.entityObj.title) {
        text = (
          <Text>
            Your post {entity.entityObj.title} has been {entity.params.action}
          </Text>
        );
      }
    } else if (entity.entityObj.type === 'comment') {
      if (isOwn) {
        text = <Text>Your comment has been {entity.params.action}</Text>;
      }
    } else {
      text = <Text>There was an error viewing this notification.</Text>;
    }

    return (
      <NotificationBody
        styles={styles}
        onPress={this.navToReports}
        entity={entity}>
        <View style={styles.bodyContents}>{text}</View>
      </NotificationBody>
    );
  }
}
