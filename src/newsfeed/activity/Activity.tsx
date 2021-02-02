import React, { Component } from 'react';
import { reaction } from 'mobx';
import { observer } from 'mobx-react';

import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  LayoutChangeEvent,
  Clipboard,
} from 'react-native';

import * as entities from 'entities';

import ExplicitText from '../../common/components/explicit/ExplicitText';
import settingsStore from '../../settings/SettingsStore';
import OwnerBlock from './OwnerBlock';
import Actions from './Actions';
import formatDate from '../../common/helpers/date';
import ActivityActionSheet from './ActivityActionSheet';
import ActivityMetrics from './metrics/ActivityMetrics';
import MediaView from '../../common/components/MediaView';
import Translate from '../../common/components/translate/Translate';
import ExplicitOverlay from '../../common/components/explicit/ExplicitOverlay';
import Lock from '../../wire/v2/lock/Lock';
import { CommonStyle } from '../../styles/Common';
import Pinned from '../../common/components/Pinned';
import blockListService from '../../common/services/block-list.service';
import i18n from '../../common/services/i18n.service';
import ActivityModel from '../ActivityModel';
import ThemedStyles from '../../styles/ThemedStyles';
import type FeedStore from '../../common/stores/FeedStore';
import sessionService from '../../common/services/session.service';
import NavigationService from '../../navigation/NavigationService';
import { showNotification } from '../../../AppMessages';
import DeletedRemind from './DeletedRemind';

const FONT_THRESHOLD = 300;

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
  storeUserTap?: boolean;
};

/**
 * Activity
 */
@observer
export default class Activity extends Component<PropsType> {
  /**
   * Disposer for autoplay reaction
   */
  autoPlayDispose: any;

  /**
   * Translate reference
   */
  translate = React.createRef<typeof Translate>();

  /**
   * Remind reference
   */
  remind: Activity | null = null;

  /**
   * Remind reference
   */
  mediaView: MediaView | null = null;

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
      this.props.navigation.push('ActivityFullScreenNav', {
        screen: 'ActivityFullScreen',
        params: navOpts,
      });
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
   * On did mount
   */
  componentDidMount() {
    this.autoPlayDispose = reaction(
      () => this.props.entity.is_visible,
      (visible) => {
        const type = this.props.entity.custom_type || this.props.entity.subtype;
        if (type === 'video') {
          if (visible) {
            const user = sessionService.getUser();
            if (
              !user.disable_autoplay_videos &&
              !settingsStore.dataSaverEnabled
            ) {
              const state = NavigationService.getCurrentState();

              // sound only for ActivityScreen (Full screen)
              const sound = state.name === 'Activity' ? true : undefined; // undefined to use the latest option from the video player service
              this.playVideo(sound);
            }
          } else {
            // no longer visible we pause it
            this.pauseVideo();
          }
        }
      },
      { fireImmediately: true },
    );
  }

  /**
   * On unmount
   */
  componentWillUnmount() {
    if (this.autoPlayDispose) {
      this.autoPlayDispose();
    }
  }

  copyText = () => {
    const entity = this.props.entity;
    Clipboard.setString(
      entities.decodeHTML(
        entity.title ? entity.title + '\n' + entity.text : entity.text,
      ),
    );
    showNotification(i18n.t('copied'), 'info');
  };

  /**
   * Render
   */
  render() {
    const theme = ThemedStyles.style;
    const entity = ActivityModel.checkOrCreate(this.props.entity);
    const hasText = !!entity.text || !!entity.title;
    const hasMedia = entity.hasMedia();
    const hasRemind = !!entity.remind_object;

    const isShortText =
      !hasMedia && !hasRemind && entity.text.length < FONT_THRESHOLD;

    const fontStyle = isShortText
      ? [theme.fontXL, theme.fontMedium]
      : theme.fontL;

    const lock = entity.paywall ? (
      <Lock entity={entity} navigation={this.props.navigation} />
    ) : null;

    const message = (
      <View style={hasText ? styles.messageContainer : styles.emptyMessage}>
        {hasText ? (
          <>
            <ExplicitText
              entity={entity}
              navigation={this.props.navigation}
              style={[styles.message, fontStyle]}
            />
            <Translate
              ref={this.translate}
              entity={entity}
              style={styles.message}
            />
          </>
        ) : null}
      </View>
    );

    const showNSFW =
      entity.shouldBeBlured() &&
      !this.props.parentMature &&
      !(entity.shouldBeBlured() && this.props.parentMature) &&
      !entity.mature_visibility;

    const borderBottom = this.props.isReminded
      ? []
      : [theme.borderBottom8x, theme.borderBackgroundTertiary];

    return (
      <TouchableOpacity
        delayPressIn={60}
        activeOpacity={0.8}
        style={[styles.container, ...borderBottom, theme.backgroundPrimary]}
        onPress={this.navToActivity}
        onLongPress={this.copyText}
        onLayout={this.onLayout}
        testID="ActivityView">
        <Pinned entity={this.props.entity} />
        {this.showOwner()}
        {showNSFW ? (
          <ExplicitOverlay entity={this.props.entity} />
        ) : (
          <>
            <View style={styles.bodyContainer}>
              {lock}
              {/* Shows ontop only for rich embed or reminds */}
              {this.props.entity.perma_url || this.props.entity.remind_object
                ? message
                : undefined}
              {this.showRemind()}
              {this.props.entity.remind_deleted && <DeletedRemind />}
              <MediaView
                ref={(o) => {
                  this.mediaView = o;
                }}
                entity={entity}
                onPress={this.navToActivity}
                style={styles.media}
                autoHeight={this.props.autoHeight}
              />
              {!(this.props.entity.perma_url || this.props.entity.remind_object)
                ? message
                : undefined}
            </View>
            <ActivityMetrics entity={this.props.entity} />
            {this.showActions()}
            {this.renderScheduledMessage()}
            {this.renderPendingMessage()}
            {this.renderActivitySpacer()}
          </>
        )}
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

  /**
   * Play video if exist
   */
  playVideo(sound) {
    this.mediaView?.playVideo(sound);
  }

  /**
   * Show translation
   */
  showTranslate = async () => {
    if (this.translate.current) {
      //@ts-ignore
      const lang = await this.translate.current?.show();
      if (this.remind && lang) this.remind.showTranslate();
    } else {
      if (this.remind) this.remind.showTranslate();
    }
  };

  /**
   * Show Owner
   */
  showOwner() {
    const theme = ThemedStyles.style;
    const rightToolbar: React.ReactNode = (
      <View>
        <ActivityActionSheet
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
        rightToolbar={this.props.hideTabs ? null : rightToolbar}
        storeUserTap={this.props.storeUserTap}
      />
    );
  }

  /**
   * Show remind activity
   */
  showRemind() {
    const remind_object = this.props.entity.remind_object;
    const theme = ThemedStyles.style;

    if (remind_object) {
      if (blockListService.has(remind_object.owner_guid)) {
        return (
          <View
            style={[
              theme.backgroundTertiary,
              theme.margin2x,
              theme.borderRadius2x,
              theme.padding2x,
            ]}>
            <Text style={[theme.textCenter, styles.blockedNoticeDesc]}>
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
            theme.margin2x,
            theme.borderHair,
            theme.borderPrimary,
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
  bodyContainer: {
    minHeight: 150,
    justifyContent: 'center',
  },
  messageContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
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
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
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
