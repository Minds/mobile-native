import React, { Component } from 'react';

import { Text, TouchableWithoutFeedback, Image, View } from 'react-native';

import { MINDS_CDN_URI } from '../../config/Config';

import BoostAcceptedView from './view/BoostAcceptedView';
import BoostCompletedView from './view/BoostCompletedView';
import BoostGiftView from './view/BoostGiftView';
import BoostPeerAcceptedView from './view/BoostPeerAcceptedView';
import BoostPeerRequestView from './view/BoostPeerRequestView';
import BoostPeerRejectedView from './view/BoostPeerRejectedView';
import BoostRejectedView from './view/BoostRejectedView';
import BoostRevokedView from './view/BoostRevokedView';
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
import GroupQueueAddView from './view/GroupQueueAddView';
import GroupQueueApproveView from './view/GroupQueueApproveView';
import GroupQueueRejectView from './view/GroupQueueRejectView';
import LikeView from './view/LikeView';
import MissedCallView from './view/MissedCallView';
import RemindView from './view/RemindView';
import TagView from './view/TagView';
import WelcomeBoostView from './view/WelcomeBoostView';
import WelcomeChatView from './view/WelcomeChatView';
import WelcomeDiscoverView from './view/WelcomeDiscoverView';
import WelcomePostView from './view/WelcomePostView';
import WelcomePointsView from './view/WelcomePointsView';
import WireHappenedView from './view/WireHappenedView';
import ReportActionedView from './view/ReportActionedView';
import MessengerInviteView from './view/MessengerInviteView';
import RewardsStateIncreaseView from './view/RewardsStateIncreaseView';
import RewardsStateDecreaseView from './view/RewardsStateDecreaseView';
import RewardsStateDecreaseTodayView from './view/RewardStateDecreaseTodayView';
import RewardsSummaryView from './view/RewardsSummaryView';
import ReferralCompleteView from './view/ReferralCompleteView';
import ReferralPendingView from './view/ReferralPendingView';
import ReferralPingView from './view/ReferralPingView';

import styles from './style';
import ThemedStyles from '../../styles/ThemedStyles';

export type NotificationType = {
  fromObj: {
    guid: string;
    name: string;
    subscribed: boolean;
  };
  from: any;
  entityObj: any;
  entity: any;
  to: any;
  params: {
    state: any;
    reward_factor: string;
    action: string;
    parent: any;
    user: any;
    focusedCommentUrn: string;
    message: string;
    is_reply: boolean;
    channel: string;
    bid: number;
    reason: number;
    type: string;
    amount: string;
    from_username: string;
    to_username: string;
    subscribed: boolean;
    from_guid: string;
    group: any;
    points: number;
    impressions: number;
  };
  time_created: string;
};

type PropsType = {
  entity: NotificationType;
  navigation: any;
};

/**
 * Main Notification row Component
 */
export default class Notification extends Component<PropsType> {
  /**
   * Navigate To channel
   */
  navToChannel = () => {
    // only active if receive the navigation property
    if (this.props.navigation) {
      this.props.navigation.push('Channel', {
        guid: this.props.entity.fromObj.guid,
      });
    }
  };

  // Notifications are stateless, therefore they don't need to be rendered more than once
  shouldComponentUpdate() {
    return false;
  }

  render() {
    // set border for notification using themes
    styles.container = {
      ...styles.container,
      ...ThemedStyles.style.borderBottomHair,
      ...ThemedStyles.style.borderPrimary,
      ...ThemedStyles.style.backgroundSecondary,
    };

    // set color for timestamp text using themes
    styles.timestamp = {
      ...styles.timestamp,
      ...ThemedStyles.style.colorSecondaryText,
    };

    // set border for avatar using themes
    styles.avatar = {
      ...styles.avatar,
      ...ThemedStyles.style.borderHair,
      ...ThemedStyles.style.borderPrimary,
    };

    const entity = this.props.entity;

    const body = this.getBody(entity);

    const avatarSrc = {
      uri: MINDS_CDN_URI + 'icon/' + this.props.entity.fromObj.guid + '/medium',
    };

    return (
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={this.navToChannel}>
          <Image source={avatarSrc} style={styles.avatar} />
        </TouchableWithoutFeedback>
        {body}
      </View>
    );
  }

  /**
   * Get child component based in entity.notification_view
   * @param {object} entity
   */
  getBody(entity) {
    switch (entity.notification_view) {
      case 'boost_accepted':
        return (
          <BoostAcceptedView
            entity={entity}
            navigation={this.props.navigation}
            styles={styles}
          />
        );

      case 'boost_completed':
        return (
          <BoostCompletedView
            entity={entity}
            navigation={this.props.navigation}
            styles={styles}
          />
        );

      case 'boost_gift':
        return (
          <BoostGiftView
            entity={entity}
            navigation={this.props.navigation}
            styles={styles}
          />
        );

      case 'boost_peer_accepted':
        return (
          <BoostPeerAcceptedView
            entity={entity}
            navigation={this.props.navigation}
            styles={styles}
          />
        );

      case 'boost_peer_rejected':
        return (
          <BoostPeerRejectedView
            entity={entity}
            navigation={this.props.navigation}
            styles={styles}
          />
        );

      case 'boost_peer_request':
        return (
          <BoostPeerRequestView
            entity={entity}
            navigation={this.props.navigation}
            styles={styles}
          />
        );

      case 'boost_rejected':
        return (
          <BoostRejectedView
            entity={entity}
            navigation={this.props.navigation}
            styles={styles}
          />
        );

      case 'boost_revoked':
        return (
          <BoostRevokedView
            entity={entity}
            navigation={this.props.navigation}
            styles={styles}
          />
        );

      case 'boost_submitted_p2p':
        return (
          <BoostSubmittedP2pView
            entity={entity}
            navigation={this.props.navigation}
            styles={styles}
          />
        );

      case 'boost_submitted':
        return (
          <BoostSubmittedView
            entity={entity}
            navigation={this.props.navigation}
            styles={styles}
          />
        );

      case 'comment':
        return (
          <CommentView
            entity={entity}
            navigation={this.props.navigation}
            styles={styles}
          />
        );

      case 'custom_message':
        return (
          <CustomMessageView
            entity={entity}
            navigation={this.props.navigation}
            styles={styles}
          />
        );

      case 'downvote':
        return (
          <DownvoteView
            entity={entity}
            navigation={this.props.navigation}
            styles={styles}
          />
        );

      case 'feature':
        return (
          <FeatureView
            entity={entity}
            navigation={this.props.navigation}
            styles={styles}
          />
        );

      case 'friends':
        return (
          <FriendsView
            entity={entity}
            navigation={this.props.navigation}
            styles={styles}
          />
        );

      case 'group_activity':
        return (
          <GroupActivityView
            entity={entity}
            navigation={this.props.navigation}
            styles={styles}
          />
        );

      case 'group_invite':
        return (
          <GroupInviteView
            entity={entity}
            navigation={this.props.navigation}
            styles={styles}
          />
        );

      case 'group_kick':
        return (
          <GroupKickView
            entity={entity}
            navigation={this.props.navigation}
            styles={styles}
          />
        );

      case 'group_queue_add':
        return (
          <GroupQueueAddView
            entity={entity}
            navigation={this.props.navigation}
            styles={styles}
          />
        );

      case 'group_queue_approve':
        return (
          <GroupQueueApproveView
            entity={entity}
            navigation={this.props.navigation}
            styles={styles}
          />
        );

      case 'group_queue_reject':
        return (
          <GroupQueueRejectView
            entity={entity}
            navigation={this.props.navigation}
            styles={styles}
          />
        );

      case 'like':
        return (
          <LikeView
            entity={entity}
            navigation={this.props.navigation}
            styles={styles}
          />
        );

      case 'messenger_invite':
        return (
          <MessengerInviteView
            entity={entity}
            navigation={this.props.navigation}
            styles={styles}
          />
        );

      case 'missed_call':
        return (
          <MissedCallView
            entity={entity}
            navigation={this.props.navigation}
            styles={styles}
          />
        );

      case 'remind':
        return (
          <RemindView
            entity={entity}
            navigation={this.props.navigation}
            styles={styles}
          />
        );

      case 'tag':
        return (
          <TagView
            entity={entity}
            navigation={this.props.navigation}
            styles={styles}
          />
        );

      case 'welcome_boost':
        return (
          <WelcomeBoostView
            entity={entity}
            navigation={this.props.navigation}
            styles={styles}
          />
        );

      case 'welcome_chat':
        return (
          <WelcomeChatView
            entity={entity}
            navigation={this.props.navigation}
            styles={styles}
          />
        );

      case 'welcome_discover':
        return (
          <WelcomeDiscoverView
            entity={entity}
            navigation={this.props.navigation}
            styles={styles}
          />
        );

      case 'welcome_points':
        return (
          <WelcomePointsView
            entity={entity}
            navigation={this.props.navigation}
            styles={styles}
          />
        );

      case 'welcome_post':
        return (
          <WelcomePostView
            entity={entity}
            navigation={this.props.navigation}
            styles={styles}
          />
        );

      case 'wire_happened':
        return (
          <WireHappenedView
            entity={entity}
            navigation={this.props.navigation}
            styles={styles}
          />
        );

      case 'referral_complete':
        return (
          <ReferralCompleteView
            entity={entity}
            navigation={this.props.navigation}
            styles={styles}
          />
        );

      case 'referral_pending':
        return (
          <ReferralPendingView
            entity={entity}
            navigation={this.props.navigation}
            styles={styles}
          />
        );

      case 'referral_ping':
        return (
          <ReferralPingView
            entity={entity}
            navigation={this.props.navigation}
            styles={styles}
          />
        );

      case 'report_actioned':
        return (
          <ReportActionedView
            entity={entity}
            navigation={this.props.navigation}
            styles={styles}
          />
        );

      case 'rewards_state_increase':
        return (
          <RewardsStateIncreaseView
            navigation={this.props.navigation}
            styles={styles}
            entity={entity}
          />
        );

      case 'rewards_state_decrease':
        return (
          <RewardsStateDecreaseView
            navigation={this.props.navigation}
            styles={styles}
            entity={entity}
          />
        );

      case 'rewards_state_decrease_today':
        return (
          <RewardsStateDecreaseTodayView
            navigation={this.props.navigation}
            styles={styles}
            entity={entity}
          />
        );

      case 'rewards_summary':
        return (
          <RewardsSummaryView
            navigation={this.props.navigation}
            styles={styles}
            entity={entity}
          />
        );

      default:
        return (
          <View style={styles.bodyContents}>
            <Text>Could not load notification {entity.notification_view}</Text>
          </View>
        );
    }
  }
}
