import React, {
  Component
} from 'react';

import {
  Text,
  StyleSheet,
  Image,
  View
} from 'react-native';

import { MINDS_URI } from '../../config/Config';

import BoostAcceptedView from './view/BoostAcceptedView';
import BoostCompletedView from './view/BoostCompletedView';
import BoostGiftView from './view/BoostGiftView';
import BoostPeerAcceptedView from './view/BoostPeerAcceptedView';
import BoostPeerRequestView from './view/BoostPeerRequestView';
import BoostRejectedView from './view/BoostRejectedView';
import BoostSubmittedP2pView from './view/BoostSubmittedP2pView';
import BoostSubmittedView from './view/BoostSubmittedView';
import CommentView from './view/CommentView';
import CustomMessageView from './view/CustomMessageView';
import DownvoteView from './view/DownvoteView';
import FeatureView from './view/FeatureView';
import FriendsView from './view/FriendsView';
import GroupActivityView from './view/GroupActivityView';
import GroupInviteView from './view/GroupInviteView';
import GroupKickView from './view/GroupKickView';
import LikeView from './view/LikeView';
import MissedCallView from './view/MissedCallView';
import RemindView from './view/RemindView';
import TagView from './view/TagView';
import WelcomeBoostView from './view/WelcomeBoostView';
import WelcomeChatView from './view/WelcomeChatView';
import WelcomeDiscoverView from './view/WelcomeDiscoverView';
import WelcomePostView from './view/WelcomePostView';
import WelcomePointsView from './view/WelcomePointsView';

/**
 * Main Notification row Component
 */
export default class Notification extends Component {

  state = {
    avatarSrc: { uri: MINDS_URI + 'icon/' + this.props.entity.owner_guid }
  };

  // Notifications are stateless, therefore they don't need to be rendered more than once
  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }

  render() {
    const entity = this.props.entity;

    const body = this.getBody(entity);

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

  /**
   * Get child component based in entity.notification_view
   * @param {object} entity
   */
  getBody(entity) {
    switch (entity.notification_view) {

      case "boost_accepted":
        return <BoostAcceptedView entity={entity} styles={styles} />

      case "boost_completed":
        return <BoostCompletedView entity={entity} styles={styles} />

      case "boost_gift":
        return <BoostGiftView entity={entity} styles={styles} />

      case "boost_peer_accepted":
        return <BoostPeerAcceptedView entity={entity} styles={styles} />

      case "boost_peer_rejected":
        return <BoostPeerRejectedView entity={entity} styles={styles} />

      case "boost_peer_request":
        return <BoostPeerRequestView entity={entity} styles={styles} />

      case "boost_rejected":
        return <BoostRejectedView entity={entity} styles={styles} />

      case "boost_submitted_p2p":
        return <BoostSubmittedP2pView entity={entity} styles={styles} />

      case "boost_submitted":
        return <BoostSubmittedView entity={entity} styles={styles} />

      case "comment":
        return <CommentView entity={entity} styles={styles} />

      case "custom_message":
        return <CustomMessageView entity={entity} styles={styles} />

      case "downvote":
        return <DownvoteView entity={entity} styles={styles} />

      case "feature":
        return <FeatureView entity={entity} styles={styles} />

      case "friends":
        return <FriendsView entity={entity} styles={styles} />

      case "group_activity":
        return <GroupActivityView entity={entity} styles={styles} />

      case "group_invite":
        return <GroupInviteView entity={entity} styles={styles} />

      case "group_kick":
        return <GroupKickView entity={entity} styles={styles} />

      case "like":
        return <LikeView entity={entity} styles={styles} />

      case "missed_call":
        return <MissedCallView entity={entity} styles={styles} />

      case "remind":
        return <RemindView entity={entity} styles={styles} />

      case "tag":
        return <Tag entity={entity} styles={styles} />

      case "welcome_boost":
        return <WelcomeBoostView entity={entity} styles={styles} />

      case "welcome_chat":
        return <WelcomeChatView entity={entity} styles={styles} />

      case "welcome_discover":
        return <WelcomeDiscoverView entity={entity} styles={styles} />

      case "welcome_points":
        return <WelcomePointsView entity={entity} styles={styles} />

      case "welcome_post":
        return <WelcomePostView entity={entity} styles={styles} />


      default:
        return (
          <View style={styles.bodyContents}>
            <Text>Could not load notification {entity.notification_view}</Text>
          </View>
        )
    }
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
  bold: {
    fontWeight: 'bold',
  },
  link: {
    fontWeight: 'bold',
  },
  timestamp: {
    fontSize: 11,
    color: '#888',
  },
});