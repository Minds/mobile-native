import { useNavigation } from '@react-navigation/native';
import { observer, useLocalStore } from 'mobx-react';
import React, { useCallback, useEffect, useRef } from 'react';
import { Dimensions, Platform, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { pushCommentBottomSheet } from '~/comments/v2/CommentBottomSheet';
import CommentsStore from '~/comments/v2/CommentsStore';
import { withErrorBoundary } from '~/common/components/ErrorBoundary';
import FloatingBackButton from '~/common/components/FloatingBackButton';
import MText from '~/common/components/MText';
import MediaView from '~/common/components/MediaView';
import ExplicitOverlay from '~/common/components/explicit/ExplicitOverlay';
import i18n from '~/common/services/i18n.service';
import sessionService from '~/common/services/session.service';
import videoPlayerService from '~/common/services/video-player.service';
import type ActivityModel from '~/newsfeed/ActivityModel';
import Actions from '~/newsfeed/activity/Actions';
import Activity from '~/newsfeed/activity/Activity';
import ActivityActionSheet from '~/newsfeed/activity/ActivityActionSheet';
import OwnerBlock from '~/newsfeed/activity/OwnerBlock';
import ThemedStyles from '~/styles/ThemedStyles';
import LockV2 from '~/wire/v2/lock/Lock';
import ActivityContainer from '~/newsfeed/activity/ActivityContainer';

import { useCarouselFocus } from '../PortraitViewerScreen';

type PropsType = {
  entity: ActivityModel;
  forceAutoplay?: boolean;
  hasPaginator: boolean;
  onPressNext: () => void;
  onPressPrev: () => void;
  onLongPress?: () => void;
  onPressOut?: () => void;
  onVideoProgress?: (progress: number) => void;
};

const window = Dimensions.get('window');

const volumeIconSize = Platform.select({ ios: 30, android: 26 });
const isIOS = Platform.OS === 'ios';

const PortraitActivity = observer((props: PropsType) => {
  // Local store
  const store = useLocalStore(() => ({
    comments: new CommentsStore(props.entity),
    toggleVolume() {
      videoPlayerService.current?.toggleVolume();
    },
  }));

  const focused = useCarouselFocus();
  const insets = useSafeAreaInsets();

  const theme = ThemedStyles.style;
  const entity: ActivityModel = props.entity;
  const mediaRef = useRef<MediaView>(null);
  const remindRef = useRef<Activity>(null);
  const navigation = useNavigation();
  const hasMedia = entity.hasMedia();
  const hasRemind = !!entity.remind_object;
  const { current: cleanBottom } = useRef({
    paddingBottom: insets.bottom ? insets.bottom - 10 : 0,
    backgroundColor: ThemedStyles.getColor('PrimaryBackground'),
  });
  const { current: cleanTop } = useRef({
    paddingTop: insets.top
      ? insets.top + (props.hasPaginator ? 20 : 0)
      : props.hasPaginator
      ? 28
      : 0,
  });

  const onPressComment = useCallback(() => {
    pushCommentBottomSheet({
      commentsStore: store.comments,
    });
  }, [store.comments]);

  useEffect(() => {
    if (focused) {
      const user = sessionService.getUser();

      if (
        ((user.plus && !user.disable_autoplay_videos) || props.forceAutoplay) &&
        mediaRef.current
      ) {
        mediaRef.current.playVideo();
      }
    } else {
      mediaRef.current?.pauseVideo();
    }
  }, [focused, props.forceAutoplay, store]);

  const showNSFW = entity.shouldBeBlured() && !entity.mature_visibility;

  const lock = entity.paywall ? (
    <LockV2 entity={entity} navigation={navigation} />
  ) : null;

  const ownerBlock = (
    <OwnerBlock
      entity={entity}
      navigation={navigation}
      containerStyle={[theme.bgPrimaryBackground, styles.header, cleanTop]}
      leftToolbar={
        <FloatingBackButton
          size={35}
          onPress={navigation.goBack}
          style={styles.backButton}
        />
      }
      rightToolbar={
        <View style={theme.rowJustifyCenter}>
          <ActivityActionSheet entity={entity} navigation={navigation} />
        </View>
      }>
      <View style={theme.rowJustifyStart}>
        <MText
          numberOfLines={1}
          style={[theme.fontM, theme.colorSecondaryText, theme.paddingRight]}>
          {i18n.date(parseInt(entity.time_created, 10) * 1000, 'friendly')}
          {!!entity.edited && (
            <MText style={[theme.fontS, theme.colorSecondaryText]}>
              {' '}
              · {i18n.t('edited').toUpperCase()}
            </MText>
          )}
        </MText>
      </View>
    </OwnerBlock>
  );

  const touchableStyle = {
    top: 90 + insets.top,
    height: window.height - ((isIOS ? 200 : 230) + insets.top + insets.bottom),
  };

  const tappingArea = (
    <>
      <TouchableOpacity
        activeOpacity={1}
        style={[styles.touchLeft, touchableStyle]}
        onLongPress={props.onLongPress}
        onPressOut={props.onPressOut}
        delayLongPress={100}
        onPress={props.onPressPrev}
      />
      <TouchableOpacity
        activeOpacity={1}
        style={[styles.touchRight, touchableStyle]}
        onLongPress={props.onLongPress}
        onPressOut={props.onPressOut}
        delayLongPress={100}
        onPress={props.onPressNext}
      />
    </>
  );

  return (
    <View style={styles.mainContainer}>
      <View style={theme.flexContainer}>
        {ownerBlock}
        {showNSFW && tappingArea}
        <View pointerEvents="box-none" style={styles.content}>
          {showNSFW ? (
            <ExplicitOverlay entity={entity} />
          ) : (
            <>
              {hasMedia ? (
                <View>
                  {lock}
                  <MediaView
                    ref={mediaRef}
                    hideOverlay={true}
                    entity={entity}
                    navigation={navigation}
                    autoHeight={true}
                    ignoreDataSaver={true}
                    onVideoProgress={props.onVideoProgress}
                  />
                </View>
              ) : (
                <>{lock}</>
              )}
              {hasRemind && (
                <ActivityContainer entity={entity}>
                  <Activity
                    ref={remindRef}
                    hideTabs={true}
                    entity={entity.remind_object as ActivityModel}
                    navigation={navigation}
                    isReminded={true}
                    hydrateOnNav={true}
                  />
                </ActivityContainer>
              )}
            </>
          )}
        </View>
        {entity.hasVideo() && (
          <View style={styles.volume}>
            <Icon
              onPress={store.toggleVolume}
              name={
                videoPlayerService.currentVolume === 0
                  ? 'ios-volume-mute'
                  : 'ios-volume-high'
              }
              size={volumeIconSize}
              style={theme.colorWhite}
            />
          </View>
        )}
      </View>
      <View style={cleanBottom}>
        <Actions entity={entity} onPressComment={onPressComment} />
      </View>
      {!showNSFW && tappingArea}
    </View>
  );
});

export default withErrorBoundary(PortraitActivity);

const styles = ThemedStyles.create({
  mainContainer: [window, 'flexContainer', 'bgSecondaryBackground'],
  backButton: {
    position: undefined,
    top: undefined,
    width: 40,
    height: 40,
    paddingTop: Platform.select({
      ios: 2,
      android: 0,
    }),
    marginLeft: -17,
  },
  volume: ['positionAbsoluteBottomRight', 'padding2x', 'opacity75'],
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  header: [
    'bgPrimaryBackground',
    {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.22,
      shadowRadius: 2.22,
      borderBottomWidth: 0,
    },
  ],
  linear: {
    position: 'absolute',
    bottom: 0,
    height: 40,
    width: '100%',
  },
  touchLeft: {
    position: 'absolute',
    left: 0,
    width: '50%',
  },
  touchRight: {
    position: 'absolute',
    right: 0,
    width: '50%',
  },
});
