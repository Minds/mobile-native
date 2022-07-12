import React, { Component } from 'react';
import { reaction } from 'mobx';
import { observer } from 'mobx-react';

import { View, LayoutChangeEvent, Pressable } from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';
import * as entities from 'entities';

import ExplicitText from '../../common/components/explicit/ExplicitText';
import settingsStore from '../../settings/SettingsStore';
import OwnerBlock from './OwnerBlock';
import ActivityActionSheet from './ActivityActionSheet';
import MediaView from '../../common/components/MediaView';
import Translate from '../../common/components/translate/Translate';
import ExplicitOverlay from '../../common/components/explicit/ExplicitOverlay';
import Lock from '../../wire/v2/lock/Lock';
import Pinned from '../../common/components/Pinned';
import blockListService from '../../common/services/block-list.service';
import i18n from '../../common/services/i18n.service';
import ActivityModel from '../ActivityModel';
import ThemedStyles from '../../styles/ThemedStyles';
import sessionService from '../../common/services/session.service';
import NavigationService from '../../navigation/NavigationService';
import { showNotification } from '../../../AppMessages';
import DeletedRemind from './DeletedRemind';
import BottomContent from './BottomContent';
import {
  borderLessContainerStyle,
  containerStyle,
  onlyContentContainerStyle,
  remindBlockContainerStyle,
  remindContainerStyle,
  remindedContainerStyle,
  shortTextStyle,
  styles,
  textStyle,
} from './styles';
import MText from '../../common/components/MText';

const FONT_THRESHOLD = 300;

type PropsType = {
  entity: ActivityModel;
  navigation: any;
  hydrateOnNav?: boolean;
  isReminded?: boolean;
  autoHeight?: boolean;
  hideTabs?: boolean;
  hideRemind?: boolean;
  parentMature?: boolean;
  onLayout?: Function;
  storeUserTap?: boolean;
  showOnlyContent?: boolean;
  borderless?: boolean;
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

  setRemind = r => (this.remind = r);

  /**
   * Nav to activity full screen
   */
  navToActivity = () => {
    if (!this.props.navigation || this.props.entity.remind_deleted) {
      return;
    }
    const navOpts = {
      entity: this.props.entity,
      hydrate: false,
    };

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
   * On did mount
   */
  componentDidMount() {
    this.autoPlayDispose = reaction(
      () => this.props.entity.is_visible,
      visible => {
        const type = this.props.entity.custom_type || this.props.entity.subtype;
        if (type === 'video') {
          if (visible) {
            const user = sessionService.getUser();
            if (
              !user.disable_autoplay_videos &&
              !settingsStore.dataSaverEnabled &&
              !(
                // do not autoplay minds+ videos for non plus users
                (
                  !user.plus &&
                  this.props.entity.getLockType &&
                  this.props.entity.getLockType() === 'plus'
                )
              )
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
    if (this.props.entity.remind_deleted) {
      return;
    }
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

    const fontStyle = isShortText ? shortTextStyle : textStyle;

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
              style={fontStyle}
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

    return (
      <View
        style={
          this.props.isReminded
            ? remindedContainerStyle
            : this.props.showOnlyContent
            ? onlyContentContainerStyle
            : this.props.borderless
            ? borderLessContainerStyle
            : containerStyle
        }
        onLayout={this.onLayout}>
        <Pinned entity={this.props.entity} />
        {!this.props.showOnlyContent && this.showOwner()}
        {showNSFW ? (
          <ExplicitOverlay entity={this.props.entity} />
        ) : (
          <Pressable
            onPress={this.navToActivity}
            onLongPress={this.copyText}
            onLayout={this.onLayout}
            testID="ActivityView">
            <View
              style={
                this.props.showOnlyContent
                  ? styles.onlyContentbodyContainer
                  : styles.bodyContainer
              }>
              {lock}
              {/* Shows ontop only for rich embed or reminds */}
              {this.props.entity.perma_url || this.props.entity.remind_object
                ? message
                : undefined}
              {this.showRemind()}
              {this.props.entity.remind_deleted && <DeletedRemind />}
              <MediaView
                ref={this.setMediaViewRef}
                entity={entity}
                onPress={this.navToActivity}
                imageStyle={theme.flexContainer}
                autoHeight={this.props.autoHeight}
              />
              {!(
                this.props.entity.perma_url ||
                this.props.entity.remind_object ||
                this.props.entity.remind_deleted
              )
                ? message
                : undefined}
            </View>
            <BottomContent
              entity={entity}
              showOnlyContent={this.props.showOnlyContent}
              hideTabs={this.props.hideTabs}
            />
          </Pressable>
        )}
      </View>
    );
  }

  setMediaViewRef = o => {
    this.mediaView = o;
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
    const rightToolbar: React.ReactNode = (
      <ActivityActionSheet
        entity={this.props.entity}
        navigation={this.props.navigation}
        onTranslate={this.showTranslate}
        testID={
          this.props.entity.text === 'e2eTest' ? 'ActivityMoreButton' : ''
        }
      />
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

    if (remind_object && !this.props.hideRemind) {
      if (blockListService.has(remind_object.owner_guid)) {
        return (
          <View style={remindBlockContainerStyle}>
            <MText style={styles.blockedNoticeDesc}>
              {i18n.t('activity.remindBlocked')}
              <MText
                onPress={this.navToRemindChannel}
                style={ThemedStyles.style.bold}>
                {' '}
                @{remind_object.ownerObj.username}
              </MText>
            </MText>
          </View>
        );
      }

      return (
        <View style={remindContainerStyle}>
          <Activity
            ref={this.setRemind}
            hideTabs={true}
            entity={remind_object}
            navigation={this.props.navigation}
            isReminded={true}
            parentMature={this.props.entity.shouldBeBlured()}
            hydrateOnNav={true}
            showOnlyContent={this.props.showOnlyContent}
          />
        </View>
      );
    }
  }
}
