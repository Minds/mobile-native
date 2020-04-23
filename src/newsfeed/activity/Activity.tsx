import React, { Component } from 'react';

import { observer } from 'mobx-react';

import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  LayoutChangeEvent,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

import ExplicitText from '../../common/components/explicit/ExplicitText';
import OwnerBlock from './OwnerBlock';
import RemindOwnerBlock from './RemindOwnerBlock';
import Actions from './Actions';
import formatDate from '../../common/helpers/date';
import ActivityActionSheet from './ActivityActionSheet';
import ActivityEditor from './ActivityEditor';
import ActivityMetrics from './metrics/ActivityMetrics';
import MediaView from '../../common/components/MediaView';
import Translate from '../../common/components/Translate';
import ExplicitOverlay from '../../common/components/explicit/ExplicitOverlay';
import Lock from '../../wire/lock/Lock';
import { CommonStyle } from '../../styles/Common';
import Pinned from '../../common/components/Pinned';
import blockListService from '../../common/services/block-list.service';
import i18n from '../../common/services/i18n.service';
import ActivityModel from '../ActivityModel';
import BlockedChannel from '../../common/components/BlockedChannel';
import ThemedStyles from '../../styles/ThemedStyles';

type PropsType = {
  entity: ActivityModel;
  navigation: any;
  hydrateOnNav?: boolean;
  isReminded?: boolean;
  autoHeight?: boolean;
  isLast?: boolean;
  hideTabs?: boolean;
  onLayout?: Function;
};

type StateType = {
  editing: boolean;
};

/**
 * Activity
 */
@observer
export default class Activity extends Component<PropsType, StateType> {
  /**
   * Translate reference
   */
  translate: Translate | null = null;

  /**
   * Remind reference
   */
  remind: Activity | null = null;

  /**
   * Remind reference
   */
  mediaView: MediaView | null = null;

  /**
   * initial state
   */
  state = {
    editing: false,
  } as StateType;
  /**
   * Nav to activity full screen
   */
  navToActivity = () => {
    const navOpts = { entity: this.props.entity, hydrate: false };

    if (this.props.entity.remind_object || this.props.hydrateOnNav) {
      navOpts.hydrate = true;
    }

    this.props.navigation.push('Activity', navOpts);
  };

  /**
   * Navigate To channel
   */
  navToRemindChannel = () => {
    // only active if receive the navigation property
    if (this.props.navigation && this.props.entity.remind_object) {
      this.props.navigation.push('Channel', {
        guid: this.props.entity.remind_object.ownerObj.guid,
      });
    }
  };

  /**
   * On layout
   */
  onLayout = (e: LayoutChangeEvent) => {
    if (this.props.onLayout) {
      this.props.onLayout(e);
    }

    if (this.props.entity.listRef && this.props.entity._list) {
      const offsetToScrollTo =
        this.props.entity._list.scrollOffset + e.nativeEvent.layout.height;
      setTimeout(() => {
        this.props.entity.listRef?.scrollToOffset({
          offset: offsetToScrollTo,
          animated: true,
        });
        this.props.entity.listRef = undefined;
      }, 1000);
    }
  };

  /**
   * Render
   */
  render() {
    const entity = ActivityModel.checkOrCreate(this.props.entity);

    if (blockListService.blocked.has(entity.ownerObj.guid)) {
      return (
        <BlockedChannel entity={entity} navigation={this.props.navigation} />
      );
    }

    const hasText = !!entity.text;
    const lock =
      entity.paywall && entity.paywall === '1' ? (
        <Lock entity={entity} navigation={this.props.navigation} />
      ) : null;

    const message = this.state.editing ? (
      //Passing the store in newsfeed (could be channel also)
      <ActivityEditor entity={entity} toggleEdit={this.toggleEdit} />
    ) : (
      <View style={hasText ? styles.messageContainer : styles.emptyMessage}>
        {hasText ? (
          <ExplicitText
            entity={entity}
            navigation={this.props.navigation}
            style={styles.message}
          />
        ) : null}
        {hasText ? (
          <Translate
            ref={(r) => (this.translate = r)}
            entity={entity}
            style={styles.message}
          />
        ) : null}
      </View>
    );

    const show_overlay =
      entity.shouldBeBlured() &&
      !entity.is_parent_mature &&
      !(entity.shouldBeBlured() && entity.is_parent_mature);
    const overlay = show_overlay ? (
      <ExplicitOverlay entity={this.props.entity} />
    ) : null;

    const borderBottom = this.props.isReminded
      ? []
      : [ThemedStyles.style.borderBottomHair, ThemedStyles.style.borderPrimary];

    return (
      <View
        style={[
          styles.container,
          ...borderBottom,
          ThemedStyles.style.backgroundSecondary,
        ]}
        onLayout={this.onLayout}
        testID="ActivityView">
        <Pinned entity={this.props.entity} />
        {this.showOwner()}
        {lock}
        {message}
        <View>
          {this.showRemind()}

          <MediaView
            ref={(o) => {
              this.mediaView = o;
            }}
            entity={entity}
            navigation={this.props.navigation}
            style={styles.media}
            autoHeight={this.props.autoHeight}
          />
          {overlay}
        </View>
        {this.showActions()}
        {this.renderScheduledMessage()}
        {this.renderPendingMessage()}
        {this.renderActivitySpacer()}
        {this.renderActivityMetrics()}
      </View>
    );
  }

  /**
   * Render activity spacer
   */
  renderActivitySpacer = () => {
    return this.props.isLast ? <View style={styles.activitySpacer} /> : null;
  };

  /**
   * Render entity metrics
   */
  renderActivityMetrics = () => {
    return !this.props.hideTabs &&
      !this.props.entity.isScheduled() &&
      !this.props.entity.isPending() ? (
      <ActivityMetrics entity={this.props.entity} />
    ) : null;
  };

  /**
   * Show message if entity is scheduled
   */
  renderScheduledMessage = () => {
    return this.props.entity.isScheduled()
      ? this.renderYellowBanner(
          `${i18n.t('activity.scheduled')} ${formatDate(
            this.props.entity.time_created,
          )}.`,
        )
      : null;
  };

  /**
   * Show message if entity is awaiting moderation
   */
  renderPendingMessage = () => {
    return this.props.entity.isPending()
      ? this.renderYellowBanner(i18n.t('activity.pendingModeration'))
      : null;
  };

  /**
   * Render a banner with a message bellow the activity
   */
  renderYellowBanner = (message) => {
    return (
      <View style={[styles.yellowBanner, CommonStyle.padding]}>
        <Text style={[styles.yellowBannerText, CommonStyle.paddingLeft]}>
          {message}
        </Text>
      </View>
    );
  };

  /**
   * Pause video if exist
   */
  pauseVideo() {
    this.mediaView?.pauseVideo();
  }

  toggleEdit = (value) => {
    this.setState({ editing: value });
  };

  /**
   * Show translation
   */
  showTranslate = async () => {
    if (this.translate) {
      const lang = await this.translate.show();
      if (this.remind && lang) this.remind.showTranslate();
    } else {
      if (this.remind) this.remind.showTranslate();
    }
  };

  /**
   * Show Owner
   */
  showOwner() {
    if (!this.props.entity.remind_object) {
      const rightToolbar: React.ReactNode = (
        <View style={styles.rightToolbar}>
          <ActivityActionSheet
            toggleEdit={this.toggleEdit}
            entity={this.props.entity}
            navigation={this.props.navigation}
            onTranslate={this.showTranslate}
            testID={
              this.props.entity.text === 'e2eTest' ? 'ActivityMoreButton' : ''
            }
          />
        </View>
      );
      return (
        <OwnerBlock
          entity={this.props.entity}
          navigation={this.props.navigation}
          rightToolbar={this.props.hideTabs ? null : rightToolbar}>
          <TouchableOpacity
            onPress={() => this.navToActivity()}
            style={ThemedStyles.style.rowJustifyStart}>
            <Text
              style={[
                styles.timestamp,
                CommonStyle.paddingRight,
                ThemedStyles.style.colorSecondaryText,
              ]}>
              {formatDate(this.props.entity.time_created, 'friendly')}
            </Text>
            {this.props.entity.boosted && (
              <View style={styles.boostTagContainer}>
                <Icon
                  name="md-trending-up"
                  style={ThemedStyles.style.colorSecondaryText}
                />
                <Text
                  style={[
                    styles.boostTagLabel,
                    ThemedStyles.style.colorSecondaryText,
                  ]}>
                  {i18n.t('boosted').toUpperCase()}
                </Text>
              </View>
            )}
            {!!this.props.entity.edited && (
              <View style={styles.boostTagContainer}>
                <Text
                  style={[
                    styles.boostTagLabel,
                    ThemedStyles.style.colorSecondaryText,
                  ]}>
                  · {i18n.t('edited').toUpperCase()}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </OwnerBlock>
      );
    } else {
      return (
        <View>
          <RemindOwnerBlock
            entity={this.props.entity}
            navigation={this.props.navigation}
          />
          <View style={styles.rightToolbar}>
            {!this.props.hideTabs && (
              <ActivityActionSheet
                toggleEdit={this.toggleEdit}
                entity={this.props.entity}
                navigation={this.props.navigation}
                onTranslate={this.showTranslate}
                testID={
                  this.props.entity.text === 'e2eTest'
                    ? 'ActivityMoreButton'
                    : ''
                }
              />
            )}
          </View>
        </View>
      );
    }
  }

  /**
   * Show remind activity
   */
  showRemind() {
    const remind_object = this.props.entity.remind_object;

    if (remind_object) {
      if (blockListService.has(remind_object.owner_guid)) {
        return (
          <View
            style={[
              styles.blockedNoticeView,
              CommonStyle.margin2x,
              CommonStyle.borderRadius2x,
              CommonStyle.padding2x,
            ]}>
            <Text style={[CommonStyle.textCenter, styles.blockedNoticeDesc]}>
              {i18n.t('activity.remindBlocked')}
              <Text
                onPress={() => this.navToRemindChannel()}
                style={[CommonStyle.bold]}>
                {' '}
                @{remind_object.ownerObj.username}
              </Text>
            </Text>
          </View>
        );
      }

      if (this.props.entity.shouldBeBlured()) {
        remind_object.is_parent_mature = true;
      }

      return (
        <View style={styles.remind}>
          <Activity
            ref={(r) => (this.remind = r)}
            hideTabs={true}
            entity={remind_object}
            navigation={this.props.navigation}
            isReminded={true}
            hydrateOnNav={true}
          />
        </View>
      );
    }
  }

  /**
   * Show actions
   */
  showActions() {
    if (!this.props.hideTabs) {
      return (
        //@ts-ignore user store is injected
        <Actions
          entity={this.props.entity}
          navigation={this.props.navigation}
        />
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    overflow: 'visible',
  },
  messageContainer: {
    padding: 10,
    paddingTop: 0,
  },
  message: {
    fontFamily: 'Roboto',
    fontSize: 15,
  },
  emptyMessage: {
    padding: 0,
  },
  media: {
    flex: 1,
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
  },
  remind: {
    //  flex:1,
  },
  rightToolbar: {
    alignSelf: 'flex-end',
    position: 'absolute',
    right: 10,
    top: 20,
  },
  boostTagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  boostTagLabel: {
    fontWeight: '400',
    marginLeft: 2,
    fontSize: 10,
  },
  activitySpacer: {
    flex: 1,
    height: 70,
  },
  blockedNoticeView: {
    backgroundColor: '#eee',
  },
  blockedNoticeDesc: {
    opacity: 0.7,
  },
  yellowBannerText: {
    fontSize: 11,
    color: '#000',
  },
  yellowBanner: {
    backgroundColor: '#ffecb3',
  },
});
