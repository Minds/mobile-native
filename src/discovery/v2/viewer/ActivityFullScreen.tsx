import React, { useRef, useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, Platform, InteractionManager } from 'react-native';
import { useDimensions } from '@react-native-community/hooks';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useFocus } from '@msantang78/react-native-pager';
import { LinearGradient } from 'expo-linear-gradient';
import { observer, useLocalStore } from 'mobx-react';
import { ScrollView } from 'react-native-gesture-handler';
import * as entities from 'entities';
import type BottomSheet from '@gorhom/bottom-sheet';
import { TouchableOpacity } from '@gorhom/bottom-sheet';
import Clipboard from '@react-native-clipboard/clipboard';

import type ActivityModel from '../../../newsfeed/ActivityModel';
import MediaView from '../../../common/components/MediaView';
import OwnerBlock from '../../../newsfeed/activity/OwnerBlock';
import ThemedStyles, { useStyle } from '../../../styles/ThemedStyles';
import ActivityActionSheet from '../../../newsfeed/activity/ActivityActionSheet';
import i18n from '../../../common/services/i18n.service';

import FloatingBackButton from '../../../common/components/FloatingBackButton';
import ExplicitText from '../../../common/components/explicit/ExplicitText';
import Translate from '../../../common/components/translate/Translate';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Actions from '../../../newsfeed/activity/Actions';
import Activity from '../../../newsfeed/activity/Activity';
import CommentsStore from '../../../comments/v2/CommentsStore';
import sessionService from '../../../common/services/session.service';
import videoPlayerService from '../../../common/services/video-player.service';
import ExplicitOverlay from '../../../common/components/explicit/ExplicitOverlay';
import featuresService from '../../../common/services/features.service';
import LockV2 from '../../../wire/v2/lock/Lock';
import Lock from '../../../wire/lock/Lock';
import { showNotification } from '../../../../AppMessages';
import { AppStackParamList } from '../../../navigation/NavigationTypes';
import BoxShadow from '../../../common/components/BoxShadow';
import ActivityMetrics from '../../../newsfeed/activity/metrics/ActivityMetrics';
import CommentBottomSheet from '../../../comments/v2/CommentBottomSheet';
import InteractionsBar from '../../../common/components/interactions/InteractionsBar';
import InteractionsActionSheet from '../../../common/components/interactions/InteractionsBottomSheet';
import { GroupContext } from '~/groups/GroupViewScreen';

type ActivityRoute = RouteProp<AppStackParamList, 'Activity'>;

const TEXT_SHORT_THRESHOLD = 110;
const TEXT_MEDIUM_THRESHOLD = 300;

type PropsType = {
  entity: ActivityModel;
  showCommentsOnFocus?: boolean;
  forceAutoplay?: boolean;
};

const ActivityOwner = ({
  entity,
  navigation,
  onTranslate,
}: {
  entity: ActivityModel;
  navigation: any;
  onTranslate: () => void;
}) => {
  const insets = useSafeAreaInsets();
  const { current: cleanTop } = useRef({
    paddingTop: insets.top - 10 || 2,
  });
  const containerStyle = useStyle(
    'bgPrimaryBackground',
    styles.header,
    cleanTop,
  );
  const right = React.useMemo(
    () => (
      <View style={ThemedStyles.style.rowJustifyCenter}>
        <ActivityActionSheet
          entity={entity}
          navigation={navigation}
          onTranslate={onTranslate}
        />
      </View>
    ),
    [entity, navigation, onTranslate],
  );

  return (
    <OwnerBlock
      entity={entity}
      navigation={navigation}
      containerStyle={containerStyle}
      leftToolbar={
        <FloatingBackButton
          onPress={navigation.goBack}
          style={backButtonStyle}
        />
      }
      rightToolbar={right}
    />
  );
};

const ActivityFullScreen = observer((props: PropsType) => {
  // Local store
  const store = useLocalStore(() => ({
    comments: new CommentsStore(props.entity),
    scrollViewHeight: 0,
    contentHeight: 0,
    displayComment: !props.showCommentsOnFocus,
    showComments() {
      store.displayComment = true;
    },
    hideComments() {
      store.displayComment = false;
    },
    onContentSizeChange(width, height) {
      store.contentHeight = height;
    },
    onScrollViewSizeChange(e) {
      store.scrollViewHeight = e.nativeEvent.layout.height;
    },
    get contentFit() {
      if (!store.scrollViewHeight || !store.contentHeight) {
        return false;
      }
      return store.scrollViewHeight + 50 > store.contentHeight;
    },
  }));
  const route = useRoute<ActivityRoute>();
  const focused = useFocus();
  const insets = useSafeAreaInsets();
  const window = useDimensions().window;
  const theme = ThemedStyles.style;
  const entity: ActivityModel = props.entity;
  const mediaRef = useRef<MediaView>(null);
  const remindRef = useRef<Activity>(null);
  const translateRef = useRef<typeof Translate>(null);
  const commentsRef = useRef<BottomSheet>(null);
  const upVotesInteractionsRef = useRef<any>(null);
  const downVotesInteractionsRef = useRef<any>(null);
  const remindsInteractionsRef = useRef<any>(null);
  const quotesInteractionsRef = useRef<any>(null);
  const navigation = useNavigation();
  const hasMedia = entity.hasMedia();
  const hasRemind = !!entity.remind_object;
  const showText = !!entity.text || !!entity.title;
  const { current: cleanBottom } = useRef({
    paddingBottom: insets.bottom - 10,
  });
  const [fullRenderReady, setFullRenderReady] = useState(false);

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      setFullRenderReady(true);
    });
  }, []);

  const onPressComment = useCallback(() => {
    if (commentsRef.current?.expand) {
      commentsRef.current.expand();
    }
  }, [commentsRef]);

  useEffect(() => {
    let time: any;
    if (focused) {
      if (props.showCommentsOnFocus) {
        time = setTimeout(() => {
          if (store) {
            store.showComments();
          }
        }, 300);
      }
      const user = sessionService.getUser();

      // if we have some video playing we pause it and reset the current video
      videoPlayerService.setCurrent(null);

      if (
        ((user.plus && !user.disable_autoplay_videos) || props.forceAutoplay) &&
        mediaRef.current
      ) {
        mediaRef.current.playVideo(
          !videoPlayerService.isSilent ? true : undefined,
        );
      }
    } else {
      mediaRef.current?.pauseVideo();
      if (props.showCommentsOnFocus) {
        store.hideComments();
      }
    }
    return () => {
      if (time) {
        clearTimeout(time);
      }
    };
  }, [focused, props.forceAutoplay, props.showCommentsOnFocus, store]);

  const isShortText =
    !hasMedia && !hasRemind && entity.text.length < TEXT_SHORT_THRESHOLD;

  const isMediumText = isShortText
    ? false
    : !hasMedia && !hasRemind && entity.text.length < TEXT_MEDIUM_THRESHOLD;

  const fontStyle = isMediumText
    ? mediumFontStyle
    : isShortText
    ? shortTextStyle
    : theme.fontLM;

  const backgroundColor = ThemedStyles.getColor('SecondaryBackground');
  const startColor = backgroundColor + '00';
  const endColor = backgroundColor + 'FF';
  const gradientColors = useRef([startColor, endColor]).current;

  const showNSFW = entity.shouldBeBlured() && !entity.mature_visibility;

  const showUpVotes = useCallback(() => {
    upVotesInteractionsRef.current?.show('upVotes');
  }, [upVotesInteractionsRef]);
  const showDownVotes = useCallback(() => {
    downVotesInteractionsRef.current?.show('downVotes');
  }, [downVotesInteractionsRef]);
  const showReminds = useCallback(() => {
    remindsInteractionsRef.current?.show('reminds');
  }, [remindsInteractionsRef]);
  const showQuotes = useCallback(() => {
    quotesInteractionsRef.current?.show('quotes');
  }, [quotesInteractionsRef]);

  const copyText = useCallback(() => {
    Clipboard.setString(
      entities.decodeHTML(
        entity.title ? entity.title + '\n' + entity.text : entity.text,
      ),
    );
    showNotification(i18n.t('copied'), 'info');
  }, [entity]);

  /**
   * On press translate in actions menu
   */
  const onTranslate = useCallback(async () => {
    if (translateRef.current) {
      //@ts-ignore
      const lang = await translateRef.current?.show();
      if (remindRef.current && lang) {
        remindRef.current.showTranslate();
      }
    } else {
      if (remindRef.current) {
        remindRef.current.showTranslate();
      }
    }
  }, [translateRef]);

  const LockCmp = featuresService.has('paywall-2020') ? LockV2 : Lock;

  const lock = entity.paywall ? (
    <LockCmp entity={entity} navigation={navigation} />
  ) : null;

  const shadowOpt = {
    width: window.width,
    height: 60 + (entity.remind_users ? 42 : 0),
    color: '#000',
    border: 5,
    opacity: 0.15,
    x: 0,
    y: 0,
  };

  const ownerBlockShadow = React.useMemo(
    () =>
      Platform.select({
        ios: (
          <ActivityOwner
            entity={entity}
            navigation={navigation}
            onTranslate={onTranslate}
          />
        ),
        android: (
          <BoxShadow setting={shadowOpt}>
            <ActivityOwner
              entity={entity}
              navigation={navigation}
              onTranslate={onTranslate}
            />
          </BoxShadow>
        ), // Android fallback for shadows
      }),
    [entity, navigation, onTranslate, shadowOpt],
  );

  const containerStyle = useStyle(
    window,
    'flexContainer',
    'bgPrimaryBackground',
  );

  return (
    <GroupContext.Provider value={route.params.group || null}>
      <View style={containerStyle}>
        <View style={theme.flexContainer}>
          {ownerBlockShadow}
          <ScrollView
            style={theme.flexContainer}
            onLayout={store.onScrollViewSizeChange}
            onContentSizeChange={store.onContentSizeChange}
            contentContainerStyle={
              store.contentFit ? contentFitStyle : contentNotFitStyle
            }>
            {showNSFW ? (
              <ExplicitOverlay entity={entity} />
            ) : (
              <>
                {hasMedia ? (
                  <View>
                    {lock}
                    <MediaView
                      ref={mediaRef}
                      entity={entity}
                      navigation={navigation}
                      autoHeight
                      ignoreDataSaver
                    />
                  </View>
                ) : (
                  <>{lock}</>
                )}
                <TouchableOpacity
                  accessibilityLabel="touchableTextCopy"
                  onLongPress={copyText}
                  style={textCopyTouchableStyle}>
                  {showText && (
                    <>
                      <ExplicitText
                        entity={entity}
                        navigation={navigation}
                        style={fontStyle}
                        selectable={false}
                        noTruncate={true}
                      />
                      <Translate
                        ref={translateRef}
                        entity={entity}
                        style={fontStyle}
                      />
                    </>
                  )}
                </TouchableOpacity>
                {hasRemind && (
                  <View style={remindContainerStyle}>
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
            <ActivityMetrics entity={props.entity} fullDate />
          </ScrollView>
          {!store.contentFit && (
            <LinearGradient colors={gradientColors} style={styles.linear} />
          )}
        </View>
        <View style={cleanBottom}>
          <InteractionsBar
            onShowUpVotesPress={showUpVotes}
            onShowDownVotesPress={showDownVotes}
            onShowRemindsPress={showReminds}
            onShowQuotesPress={showQuotes}
            entity={entity}
          />
          <Actions
            entity={entity}
            hideCount
            showCommentsOutlet={false}
            onPressComment={onPressComment}
          />
        </View>

        {fullRenderReady && (
          <>
            <InteractionsActionSheet
              entity={entity}
              ref={upVotesInteractionsRef}
            />
            <InteractionsActionSheet
              entity={entity}
              ref={downVotesInteractionsRef}
            />
            <InteractionsActionSheet
              entity={entity}
              ref={remindsInteractionsRef}
            />
            <InteractionsActionSheet
              entity={entity}
              ref={quotesInteractionsRef}
            />
          </>
        )}

        {fullRenderReady && (
          <CommentBottomSheet
            ref={commentsRef}
            hideContent={Boolean(!store.displayComment)}
            autoOpen={
              Boolean(route.params?.focusedUrn) ||
              (Boolean(route.params?.scrollToBottom) &&
                Boolean(commentsRef.current))
            }
            commentsStore={store.comments}
          />
        )}
      </View>
    </GroupContext.Provider>
  );
});

export default ActivityFullScreen;

/**
 * Styles
 */
const styles = StyleSheet.create({
  backButton: {
    position: undefined,
    top: undefined,
    width: 50,
    paddingTop: 0,
    marginLeft: -20,
    marginRight: -5,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
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
});

const mediumFontStyle = ThemedStyles.combine('fontXXL', 'fontMedium');

const textCopyTouchableStyle = ThemedStyles.combine(
  'paddingHorizontal4x',
  'paddingVertical4x',
);
const shortTextStyle = ThemedStyles.combine('fontXXXL', 'fontMedium');

const backButtonStyle = ThemedStyles.combine(
  'colorPrimaryText',
  styles.backButton,
);

const contentFitStyle = ThemedStyles.combine(
  'justifyCenter',
  'fullWidth',
  styles.content,
);
const contentNotFitStyle = ThemedStyles.combine('fullWidth', styles.content);

const remindContainerStyle = ThemedStyles.combine(
  styles.remind,
  'margin2x',
  'borderHair',
  'bcolorPrimaryBackground',
);
