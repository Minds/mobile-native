import React, { Component } from 'react';

import { observer } from 'mobx-react';

import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  LayoutChangeEvent,
} from 'react-native';

import ExplicitText from '../../common/components/explicit/ExplicitText';
import OwnerBlock from './OwnerBlock';
import Actions from './Actions';
import formatDate from '../../common/helpers/date';
import ActivityActionSheet from './ActivityActionSheet';
import ActivityEditor from './ActivityEditor';
import ActivityMetrics from './metrics/ActivityMetrics';
import MediaView from '../../common/components/MediaView';
import Translate from '../../common/components/Translate';
import ExplicitOverlay from '../../common/components/explicit/ExplicitOverlay';
import Lock from '../../wire/v2/lock/Lock';
import { CommonStyle } from '../../styles/Common';
import Pinned from '../../common/components/Pinned';
import blockListService from '../../common/services/block-list.service';
import i18n from '../../common/services/i18n.service';
import ActivityModel from '../ActivityModel';
import BlockedChannel from '../../common/components/BlockedChannel';
import ThemedStyles from '../../styles/ThemedStyles';
import type FeedStore from '../../common/stores/FeedStore';

type PropsType = {
  entity: ActivityModel;
  navigation: any;
  hydrateOnNav?: boolean;
  isReminded?: boolean;
  autoHeight?: boolean;
  isLast?: boolean;
  hideTabs?: boolean;
  parentMature?: boolean;
  onLayout?: Function;
  showCommentsOutlet?: boolean;
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
    if (!this.props.navigation) {
      return;
    }
    const navOpts = {
      entity: this.props.entity,
      hydrate: false,
      feed: undefined as FeedStore | undefined,
      current: 0,
    };

    if (this.props.entity.remind_object || this.props.hydrateOnNav) {
      navOpts.hydrate = true;
    }

    if (this.props.entity.__list && !this.props.isReminded) {
      const index = this.props.entity.__list.entities.findIndex(
        (e) => e === this.props.entity,
      );
      navOpts.feed = this.props.entity.__list;
      navOpts.current = index;
      this.props.navigation.push('ActivityFullScreen', navOpts);
      return;
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
    const lock = <Lock entity={entity} navigation={this.props.navigation} />;

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
      !this.props.parentMature &&
      !(entity.shouldBeBlured() && this.props.parentMature);
    const overlay = show_overlay ? (
      <ExplicitOverlay entity={this.props.entity} />
    ) : null;

    const borderBottom = this.props.isReminded
      ? []
      : [ThemedStyles.style.borderBottomHair, ThemedStyles.style.borderPrimary];

    return (
      <TouchableOpacity
        delayPressIn={60}
        activeOpacity={0.8}
        style={[
          styles.container,
          ...borderBottom,
          ThemedStyles.style.backgroundSecondary,
        ]}
        onPress={this.navToActivity}
        onLayout={this.onLayout}
        testID="ActivityView">
        <Pinned entity={this.props.entity} />
        {this.showOwner()}
        {lock}
        {/* Shows ontop only for rich embed or reminds */}
        {this.props.entity.perma_url || this.props.entity.remind_object
          ? message
          : undefined}
        <View style={show_overlay ? styles.nsfwContainer : null}>
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
          {!(this.props.entity.perma_url || this.props.entity.remind_object)
            ? message
            : undefined}
          {overlay}
        </View>
        {this.showActions()}
        {this.renderScheduledMessage()}
        {this.renderPendingMessage()}
        {this.renderActivitySpacer()}
        {/* {this.renderActivityMetrics()} */}
      </TouchableOpacity>
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
    const rightToolbar: React.ReactNode = (
      <View>
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
        <View style={ThemedStyles.style.rowJustifyStart}>
          <Text
            style={[
              styles.timestamp,
              CommonStyle.paddingRight,
              ThemedStyles.style.colorSecondaryText,
            ]}>
            {formatDate(this.props.entity.time_created, 'friendly')}
          </Text>

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
        </View>
      </OwnerBlock>
    );
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

      return (
        <View
          style={[
            styles.remind,
            ThemedStyles.style.margin2x,
            ThemedStyles.style.borderHair,
            ThemedStyles.style.borderBackgroundPrimary,
          ]}>
          <Activity
            ref={(r) => (this.remind = r)}
            hideTabs={true}
            entity={remind_object}
            navigation={this.props.navigation}
            isReminded={true}
            parentMature={this.props.entity.shouldBeBlured()}
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
        <Actions
          entity={this.props.entity}
          showCommentsOutlet={this.props.showCommentsOutlet}
        />
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    overflow: 'visible',
  },
  nsfwContainer: {
    minHeight: 250,
  },
  messageContainer: {
    padding: 10,
    paddingTop: 10,
  },
  message: {
    fontFamily: 'Roboto',
    fontSize: 16,
    lineHeight: 24,
  },
  emptyMessage: {
    padding: 0,
  },
  media: {
    flex: 1,
  },
  timestamp: {
    fontSize: 14,
    color: '#888',
  },
  remind: {
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 10,

    elevation: 5,
  },
  boostTagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  boostTagLabel: {
    fontWeight: '400',
    marginLeft: 2,
    fontSize: 14,
    letterSpacing: 0.75,
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
