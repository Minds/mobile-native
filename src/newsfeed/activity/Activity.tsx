import React, { Component, PropsWithChildren, useState } from 'react';
import { reaction } from 'mobx';
import { observer } from 'mobx-react';

import { View, LayoutChangeEvent, Pressable } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import * as entities from 'entities';

import ExplicitText from '~/common/components/explicit/ExplicitText';
import OwnerBlock from './OwnerBlock';
import ActivityActionSheet from './ActivityActionSheet';
import MediaView from '~/common/components/MediaView';
import Translate from '~/common/components/translate/Translate';
import ExplicitOverlay from '~/common/components/explicit/ExplicitOverlay';
import Lock from '~/wire/v2/lock/Lock';
import Pinned from '~/common/components/Pinned';
import ActivityModel from '../ActivityModel';
import { showNotification } from '~/../AppMessages';
import DeletedRemind from './DeletedRemind';
import BottomContent from './BottomContent';
import {
  borderLessContainerStyle,
  containerStyle,
  onlyContentContainerStyle,
  remindBlockContainerStyle,
  remindedContainerStyle,
  shortTextStyle,
  styles,
  textStyle,
} from './styles';
import MText from '~/common/components/MText';
import ActivityContainer from './ActivityContainer';
import { withAnalyticsContext } from '~/common/contexts/analytics.context';
import { useFeedStore } from '~/common/contexts/feed-store.context';
import FadeView from '~/common/components/FadeView';
import { withActivityContext } from './contexts/Activity.context';
import undoable from './hocs/undoable';
const FONT_THRESHOLD = 300;
import sp from '~/services/serviceProvider';
import { useMemoStyle } from '~/styles/hooks';

export type ActivityProps = {
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
  hideMetrics?: boolean;
  displayBoosts?: 'none' | 'distinct';
  emphasizeGroup?: boolean;
  maxContentHeight?: number;
  onDownvote?: () => void;
  quietDownvote?: boolean;
  explicitVoteButtons?: boolean;
  hidePostOnDownvote?: boolean;
};

/**
 * Activity
 */
@withAnalyticsContext<ActivityProps>(props => {
  const analyticsService = sp.resolve('analytics');
  const feedStore = useFeedStore();
  const clientMetaContext =
    feedStore?.metadataService &&
    analyticsService.buildClientMetaContext(
      feedStore?.metadataService.getClientMetadata(props.entity),
    );

  const contexts = [analyticsService.buildEntityContext(props.entity)];

  if (clientMetaContext) {
    contexts.push(clientMetaContext);
  }
  return contexts;
})
@undoable()
@withActivityContext(props => ({
  quietDownvote: true,
  explicitVoteButtons: props.explicitVoteButtons,
  hidePostOnDownvote: props.hidePostOnDownvote,
  onDownvote: props.onDownvote,
}))
@observer
export default class Activity extends Component<ActivityProps> {
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
    if (this.props.entity.hasSiteMembershipPaywallThumbnail) {
      showNotification(
        'This post is for members only. Please view it in a web browser to proceed.',
      );
      return;
    }

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
            const user = sp.session.getUser();
            if (
              !user.disable_autoplay_videos &&
              !sp.resolve('settings').dataSaverEnabled &&
              !(
                // do not autoplay minds+ videos for non plus users
                (
                  !user.plus &&
                  this.props.entity.getLockType &&
                  this.props.entity.getLockType() === 'plus'
                )
              )
            ) {
              const state = sp.navigation.getCurrentState();

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
    const title = entity.link_title || entity.title;
    Clipboard.setStringAsync(
      entities.decodeHTML(title ? title + '\n' + entity.text : entity.text),
    );
    showNotification(sp.i18n.t('copied'), 'info');
  };

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
    return this.props.entity.ownerObj ? (
      <OwnerBlock
        entity={this.props.entity}
        navigation={this.props.navigation}
        rightToolbar={this.props.hideTabs ? null : rightToolbar}
        storeUserTap={this.props.storeUserTap}
        displayBoosts={this.props.displayBoosts}
        emphasizeGroup={this.props.emphasizeGroup}
      />
    ) : null;
  }

  /**
   * Show remind activity
   */
  showRemind() {
    const remind_object = this.props.entity.remind_object;

    if (remind_object && !this.props.hideRemind) {
      if (sp.resolve('blockList').has(remind_object.owner_guid)) {
        return (
          <View style={remindBlockContainerStyle}>
            <MText style={styles.blockedNoticeDesc}>
              {sp.i18n.t('activity.remindBlocked')}
              <MText
                onPress={this.navToRemindChannel}
                style={sp.styles.style.bold}>
                {' '}
                @{remind_object.ownerObj.username}
              </MText>
            </MText>
          </View>
        );
      }

      return (
        <ActivityContainer entity={this.props.entity}>
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
        </ActivityContainer>
      );
    }
  }

  /**
   * Render
   */
  render() {
    const entity = ActivityModel.checkOrCreate(this.props.entity);
    const hasText = !!entity.text || !!entity.title || !!entity.link_title;
    const hasMedia = entity.hasMedia();
    const hasRemind = !!entity.remind_object;

    /* Shows ontop only for rich embed or reminds */
    const shouldShowMessageOnTop = Boolean(
      this.props.entity.perma_url || this.props.entity.remind_object,
    );
    const shouldShowMessageOnBottom = !(
      this.props.entity.perma_url ||
      this.props.entity.remind_object ||
      this.props.entity.remind_deleted
    );

    const isShortText =
      !hasMedia && !hasRemind && entity.text.length < FONT_THRESHOLD;

    const fontStyle = isShortText ? shortTextStyle : textStyle;

    const lock = entity.paywall ? (
      <Lock entity={entity} navigation={this.props.navigation} />
    ) : null;

    if (!hasText) {
      // We reset the translate reference if there is no text, this prevents to have an old reference when recycling
      //@ts-ignore
      this.translate.current = null;
    }

    const message = (
      <View style={hasText ? styles.messageContainer : styles.emptyMessage}>
        {hasText ? (
          <>
            <ExplicitText
              entity={entity}
              navigation={this.props.navigation}
              selectable={false}
              style={fontStyle}
            />
            <Translate
              key={`translate-${entity.guid}`} // force render if entity change (solve issues when recycling)
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

    const content = (
      <View
        style={
          this.props.showOnlyContent
            ? null
            : this.props.maxContentHeight
            ? styles.bodyContainer
            : styles.bodyContainerCentered
        }>
        {lock}
        {shouldShowMessageOnTop ? message : undefined}
        <MediaView
          ref={this.setMediaViewRef}
          entity={entity}
          onPress={this.navToActivity}
          autoHeight={this.props.autoHeight}
          onVideoOverlayPress={
            this.props.maxContentHeight ? this.navToActivity : undefined
          }
        />
        {this.showRemind()}
        {this.props.entity.remind_deleted && <DeletedRemind />}
        {shouldShowMessageOnBottom ? message : undefined}
      </View>
    );

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
          <>
            <Pressable
              onPress={this.navToActivity}
              onLongPress={
                entity.hasSiteMembershipPaywallThumbnail
                  ? undefined
                  : this.copyText
              }
              onLayout={this.onLayout}
              testID="ActivityView">
              {this.props.maxContentHeight ? (
                <MaxHeightFadeView maxHeight={this.props.maxContentHeight}>
                  {content}
                </MaxHeightFadeView>
              ) : (
                content
              )}
            </Pressable>
            <BottomContent
              entity={entity}
              showOnlyContent={this.props.showOnlyContent}
              hideTabs={this.props.hideTabs}
              hideMetrics={this.props.hideMetrics}
            />
          </>
        )}
      </View>
    );
  }
}

const MaxHeightFadeView = ({
  maxHeight,
  children,
}: PropsWithChildren<{ maxHeight?: number }>) => {
  const [exceeds, setExceeds] = useState(!!maxHeight);

  const fadeViewStyle = useMemoStyle(
    () => [
      {
        height: maxHeight,
        justifyContent: exceeds ? 'flex-start' : 'center',
        overflow: 'hidden',
      },
    ],
    [maxHeight, exceeds],
  );

  const handleChildrenLayout = (event: LayoutChangeEvent) => {
    if (maxHeight) {
      setExceeds(event.nativeEvent.layout.height > maxHeight);
    }
  };

  return (
    <FadeView fades={exceeds ? ['bottom'] : []} style={fadeViewStyle}>
      <View
        onLayout={handleChildrenLayout}
        style={{ justifyContent: exceeds ? 'flex-start' : 'center' }}>
        {children}
      </View>
    </FadeView>
  );
};
