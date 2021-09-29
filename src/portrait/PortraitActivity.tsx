import React, { useRef, useCallback, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { useDimensions } from '@react-native-community/hooks';
import { RouteProp, useNavigation } from '@react-navigation/native';
import { useFocus } from '@msantang78/react-native-pager';
import { observer, useLocalStore } from 'mobx-react';
import Icon from 'react-native-vector-icons/Ionicons';

import type ActivityModel from '../newsfeed/ActivityModel';
import MediaView from '../common/components/MediaView';
import OwnerBlock from '../newsfeed/activity/OwnerBlock';
import ThemedStyles from '../styles/ThemedStyles';
import ActivityActionSheet from '../newsfeed/activity/ActivityActionSheet';

import FloatingBackButton from '../common/components/FloatingBackButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Actions from '../newsfeed/activity/Actions';
import Activity from '../newsfeed/activity/Activity';

import CommentsStore from '../comments/v2/CommentsStore';
import sessionService from '../common/services/session.service';
import videoPlayerService from '../common/services/video-player.service';
import ExplicitOverlay from '../common/components/explicit/ExplicitOverlay';

import LockV2 from '../wire/v2/lock/Lock';
import { AppStackParamList } from '../navigation/NavigationTypes';
import CommentBottomSheet from '../comments/v2/CommentBottomSheet';
import BoxShadow from '../common/components/BoxShadow';
import i18n from '../common/services/i18n.service';
import { withErrorBoundary } from '../common/components/ErrorBoundary';
import MText from '../common/components/MText';

type ActivityRoute = RouteProp<AppStackParamList, 'Activity'>;

type PropsType = {
  entity: ActivityModel;
  forceAutoplay?: boolean;
  hasPaginator: boolean;
  onPressNext: () => void;
  onPressPrev: () => void;
};

const volumeIconSize = Platform.select({ ios: 30, android: 26 });
const isIOS = Platform.OS === 'ios';

const PortraitActivity = observer((props: PropsType) => {
  const windowHeight = useWindowDimensions().height;

  // Local store
  const store = useLocalStore(() => ({
    comments: new CommentsStore(props.entity),
    displayComment: false,
    showComments() {
      store.displayComment = true;
    },
    hideComments() {
      store.displayComment = false;
    },
    toggleVolume() {
      videoPlayerService.current?.toggleVolume();
    },
  }));

  const focused = useFocus();
  const insets = useSafeAreaInsets();
  const window = useDimensions().window;
  const theme = ThemedStyles.style;
  const entity: ActivityModel = props.entity;
  const mediaRef = useRef<MediaView>(null);
  const remindRef = useRef<Activity>(null);
  const commentsRef = useRef<any>(null);
  const navigation = useNavigation();
  const hasMedia = entity.hasMedia();
  const hasRemind = !!entity.remind_object;
  const { current: cleanBottom } = useRef({
    paddingBottom: insets.bottom ? insets.bottom - 10 : 0,
  });
  const { current: cleanTop } = useRef({
    paddingTop: insets.top
      ? insets.top + (props.hasPaginator ? 20 : 0)
      : props.hasPaginator
      ? 28
      : 0,
  });

  const onPressComment = useCallback(() => {
    if (commentsRef.current?.expand) {
      commentsRef.current.expand();
    }
  }, [commentsRef]);

  useEffect(() => {
    let time: any;
    if (focused) {
      time = setTimeout(() => {
        if (store) {
          store.showComments();
        }
      }, 500);
      const user = sessionService.getUser();

      // if we have some video playing we pause it and reset the current video
      videoPlayerService.setCurrent(null);

      if (
        ((user.plus && !user.disable_autoplay_videos) || props.forceAutoplay) &&
        mediaRef.current
      ) {
        mediaRef.current.playVideo();
      }
    } else {
      mediaRef.current?.pauseVideo();
      store.hideComments();
    }
    return () => {
      if (time) {
        clearTimeout(time);
      }
    };
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
          style={[theme.colorPrimaryText, styles.backButton]}
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

  const shadowOpt = {
    width: window.width,
    height: 70 + (props.hasPaginator ? 26 : 0),
    color: '#000',
    border: 5,
    opacity: 0.15,
    x: 0,
    y: 0,
  };

  const ownerBlockShadow = Platform.select({
    ios: ownerBlock,
    android: <BoxShadow setting={shadowOpt}>{ownerBlock}</BoxShadow>, // Android fallback for shadows
  });

  const touchableStyle = {
    top: 90 + insets.top,
    height: windowHeight - ((isIOS ? 200 : 230) + insets.top + insets.bottom),
  };

  const tappingArea = (
    <>
      <TouchableOpacity
        activeOpacity={1}
        style={[styles.touchLeft, touchableStyle]}
        onPress={props.onPressPrev}
      />
      <TouchableOpacity
        activeOpacity={1}
        style={[styles.touchRight, touchableStyle]}
        onPress={props.onPressNext}
      />
    </>
  );

  return (
    <View style={[window, theme.flexContainer, theme.bgSecondaryBackground]}>
      <View style={theme.flexContainer}>
        {ownerBlockShadow}
        {showNSFW && tappingArea}
        <View
          pointerEvents="box-none"
          style={[theme.justifyCenter, theme.flexContainer, styles.content]}>
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
                  />
                </View>
              ) : (
                <>{lock}</>
              )}
              {hasRemind && (
                <View
                  style={[
                    styles.remind,
                    theme.margin2x,
                    theme.borderHair,
                    theme.bcolorPrimaryBackground,
                  ]}>
                  <Activity
                    ref={remindRef}
                    hideTabs={true}
                    entity={entity.remind_object as ActivityModel}
                    navigation={navigation}
                    isReminded={true}
                    hydrateOnNav={true}
                  />
                </View>
              )}
            </>
          )}
        </View>
        {entity.hasVideo() && (
          <View
            style={[
              theme.positionAbsoluteBottomRight,
              theme.padding2x,
              styles.volume,
            ]}>
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
        <Actions
          entity={entity}
          showCommentsOutlet={false}
          onPressComment={onPressComment}
        />
      </View>
      {!showNSFW && tappingArea}
      <CommentBottomSheet
        commentsStore={store.comments}
        ref={commentsRef}
        hideContent={Boolean(!store.displayComment)}
      />
    </View>
  );
});

export default withErrorBoundary(PortraitActivity);

const styles = StyleSheet.create({
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
  volume: {
    opacity: 0.8,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  header: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    borderBottomWidth: 0,
  },
  linear: {
    position: 'absolute',
    bottom: 0,
    height: 40,
    width: '100%',
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
