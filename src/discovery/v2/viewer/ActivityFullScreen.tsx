import React, { useRef, useCallback, useEffect } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { useDimensions } from '@react-native-community/hooks';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { observer, useLocalStore } from 'mobx-react';
import { ScrollView } from 'react-native-gesture-handler';
import * as entities from 'entities';
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
import LockV2 from '../../../wire/v2/lock/Lock';
import { showNotification } from '../../../../AppMessages';
import { AppStackParamList } from '../../../navigation/NavigationTypes';
import BoxShadow from '../../../common/components/BoxShadow';
import ActivityMetrics from '../../../newsfeed/activity/metrics/ActivityMetrics';
import { pushCommentBottomSheet } from '../../../comments/v2/CommentBottomSheet';
import InteractionsBar from '../../../common/components/interactions/InteractionsBar';
import InteractionsBottomSheet from '../../../common/components/interactions/InteractionsBottomSheet';
import ActivityContainer from '~/newsfeed/activity/ActivityContainer';
import {
  useAnalytics,
  withAnalyticsContext,
} from '~/common/contexts/analytics.context';
import analyticsService from '~/common/services/analytics.service';
import MutualSubscribers from '../../../channel/components/MutualSubscribers';
import pushInteractionsBottomSheet from '../../../common/components/interactions/pushInteractionsBottomSheet';
import { GroupContextProvider } from '~/modules/groups/contexts/GroupContext';

type ActivityRoute = RouteProp<AppStackParamList, 'Activity'>;

const TEXT_SHORT_THRESHOLD = 110;
const TEXT_MEDIUM_THRESHOLD = 300;

type PropsType = {
  entity: ActivityModel;
  forceAutoplay?: boolean;
  noBottomInset?: boolean;
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
    <View style={containerStyle}>
      {entity.ownerObj.plus && !entity.ownerObj.subscribed && (
        <MutualSubscribers
          vertical="M"
          spacingType="padding"
          avatars={false}
          navigation={navigation}
          channel={entity.ownerObj}
          limit={2}
          language={'follow'}
          font="B3"
          onPress={() =>
            pushInteractionsBottomSheet({
              entity: entity.ownerObj,
              interaction: 'subscribersYouKnow',
            })
          }
        />
      )}

      <OwnerBlock
        entity={entity}
        navigation={navigation}
        leftToolbar={
          <FloatingBackButton
            onPress={navigation.goBack}
            style={backButtonStyle}
          />
        }
        rightToolbar={right}
      />
    </View>
  );
};

const ActivityFullScreen = observer((props: PropsType) => {
  const analytics = useAnalytics();
  // Local store
  const store = useLocalStore(() => ({
    comments: new CommentsStore(props.entity, analytics.contexts),
    scrollViewHeight: 0,
    contentHeight: 0,
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
  const insets = useSafeAreaInsets();
  const window = useDimensions().window;
  const theme = ThemedStyles.style;
  const entity: ActivityModel = props.entity;
  const mediaRef = useRef<MediaView>(null);
  const remindRef = useRef<Activity>(null);
  const translateRef = useRef<typeof Translate>(null);
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
    ...ThemedStyles.style.bgPrimaryBackground,
  });

  const openComments = useCallback(() => {
    pushCommentBottomSheet({
      commentsStore: store.comments,
    });
  }, [store]);

  useEffect(() => {
    if (route.params?.focusedCommentUrn || route.params?.scrollToBottom) {
      openComments();
    }
  }, [route.params]);

  useEffect(() => {
    const user = sessionService.getUser();

    // if we have some video playing we pause it and reset the current video
    videoPlayerService.setCurrent(null);

    if (
      (!user.disable_autoplay_videos || props.forceAutoplay) &&
      mediaRef.current
    ) {
      mediaRef.current.playVideo(
        !videoPlayerService.isSilent ? true : undefined,
      );
    }
  }, [props.forceAutoplay, store]);

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

  const lock = entity.paywall ? (
    <LockV2 entity={entity} navigation={navigation} />
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

  let remind: null | React.ReactNode = null;

  if (hasRemind) {
    remind = hasRemind ? (
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
    ) : null;
  }

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
    <GroupContextProvider group={route.params?.group || null}>
      <View testID="ActivityScreen" style={containerStyle}>
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
                        selectable={true}
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
                {hasRemind && remind}
              </>
            )}
            <ActivityMetrics entity={props.entity} fullDate />
          </ScrollView>
          {!store.contentFit && (
            <LinearGradient colors={gradientColors} style={styles.linear} />
          )}
        </View>
        <View
          style={
            props.noBottomInset
              ? ThemedStyles.style.bgPrimaryBackground
              : cleanBottom
          }>
          <InteractionsBar
            onShowUpVotesPress={showUpVotes}
            onShowDownVotesPress={showDownVotes}
            onShowRemindsPress={showReminds}
            onShowQuotesPress={showQuotes}
            entity={entity}
          />
          <Actions entity={entity} hideCount onPressComment={openComments} />
        </View>
        <InteractionsBottomSheet entity={entity} ref={upVotesInteractionsRef} />
        <InteractionsBottomSheet
          entity={entity}
          ref={downVotesInteractionsRef}
        />
        <InteractionsBottomSheet entity={entity} ref={remindsInteractionsRef} />
        <InteractionsBottomSheet entity={entity} ref={quotesInteractionsRef} />
      </View>
    </GroupContextProvider>
  );
});

export default withAnalyticsContext<PropsType>(props => [
  analyticsService.buildEntityContext(props.entity),
  analyticsService.buildClientMetaContext({
    medium: 'single',
    source: 'single',
    position: 1,
    campaign: props.entity?.boosted_guid ? props.entity.urn : undefined,
    served_by_guid: props.entity?.ownerObj?.guid,
  }),
])(ActivityFullScreen);

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
