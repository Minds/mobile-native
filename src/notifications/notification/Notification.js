import React, {
  Component
} from 'react';

import {
  Text,
  StyleSheet,
  Image,
  View
} from 'react-native';

import {
  MINDS_URI,
} from '../../config/Config';

import CommentView from './view/CommentView';
import FriendsView from './view/FriendsView';
import GroupActivityView from './view/GroupActivityView';
import CustomMessageView from './view/CustomMessageView';

export default class Notification extends Component {

  state = {
    avatarSrc: { uri: MINDS_URI + 'icon/' + this.props.entity.owner_guid }
  };

  render() {

    let body;
    const entity = this.props.entity;

    switch (entity.notification_view) {

      case "friends":
        body = <GroupActivityView entity={entity} />
        break;
      case "group_invite":
        break;
      case "group_kick":
        break;
      case "group_activity":
        body = <GroupActivityView entity={entity} />
        break;
      case "custom_message":
        body = <CustomMessageView entity={entity} />
        break;
      case "comment":
        body = <CommentView entity={entity} />
        break;
      default:
        body = (
          <View style={styles.bodyContents}>
            <Text>Could not load notification {entity.notification_view}</Text>
          </View>
        )
    }

    return (
        <View style={styles.container}>
          <Image source={this.state.avatarSrc} style={styles.avatar}/>
          <View style={styles.body}>
            { body }
            <Text style={styles.timestamp}>{this.formatDate(this.props.entity.time_created)}</Text>
          </View>
        </View>
    );
  }

  formatDate(timestamp) {
    const t = new Date(timestamp * 1000);
    return t.toDateString();
  }

}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    paddingTop: 16,
    paddingLeft: 8,
    paddingBottom: 16,
    paddingRight: 8,
    borderBottomColor: '#EEE',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  avatar: {
    height: 36,
    width: 36,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#EEE',
  },
  body: {
    marginLeft: 8,
    flex: 1,
  },
  bodyContents: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  link: {
    fontWeight: 'bold',
  },
  timestamp: {
    fontSize: 11,
    color: '#888',
  },
});