import React, { useRef, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, Clipboard } from 'react-native';
import { useDimensions } from '@react-native-community/hooks';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { useFocus } from '@crowdlinker/react-native-pager';
import { LinearGradient } from 'expo-linear-gradient';
import { observer, useLocalStore } from 'mobx-react';
import * as entities from 'entities';

import type ActivityModel from '../../../newsfeed/ActivityModel';
import MediaView from '../../../common/components/MediaView';
import OwnerBlock from '../../../newsfeed/activity/OwnerBlock';
import ThemedStyles from '../../../styles/ThemedStyles';
import ActivityActionSheet from '../../../newsfeed/activity/ActivityActionSheet';
import formatDate from '../../../common/helpers/date';
import i18n from '../../../common/services/i18n.service';

import FloatingBackButton from '../../../common/components/FloatingBackButton';
import ExplicitText from '../../../common/components/explicit/ExplicitText';
import Translate from '../../../common/components/Translate';
import { useSafeArea } from 'react-native-safe-area-context';
import Actions from '../../../newsfeed/activity/Actions';
import Activity from '../../../newsfeed/activity/Activity';

import BottomOptionPopup, {
  useBottomOption,
  BottomOptionsStoreType,
} from '../../../common/components/BottomOptionPopup';
import CommentList from '../../../comments/CommentList';
import CommentsStore from '../../../comments/CommentsStore';
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import sessionService from '../../../common/services/session.service';
import videoPlayerService from '../../../common/services/video-player.service';
import ExplicitOverlay from '../../../common/components/explicit/ExplicitOverlay';
import featuresService from '../../../common/services/features.service';

import LockV2 from '../../../wire/v2/lock/Lock';
import Lock from '../../../wire/lock/Lock';
import { showNotification } from '../../../../AppMessages';
import { AppStackParamList } from '../../../navigation/NavigationTypes';

type ActivityRoute = RouteProp<AppStackParamList, 'Activity'>;

const TEXT_SHORT_THRESHOLD = 110;
const TEXT_MEDIUM_THRESHOLD = 300;

type PropsType = {
  entity: ActivityModel;
};

const ActivityFullScreen = observer((props: PropsType) => {
  // Local store
  const store = useLocalStore(() => ({
    comments: new CommentsStore(),
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
  const focused = useFocus();
  const bottomStore: BottomOptionsStoreType = useBottomOption();
  const insets = useSafeArea();
  const window = useDimensions().window;
  const theme = ThemedStyles.style;
  const entity: ActivityModel = props.entity;
  const mediaRef = useRef<MediaView>(null);
  const remindRef = useRef<Activity>(null);
  const translateRef = useRef<Translate>(null);
  const navigation = useNavigation();
  const hasMedia = entity.hasMedia();
  const hasRemind = !!entity.remind_object;
  const showText = !!entity.text || !!entity.title;
  const { current: cleanBottom } = useRef({
    paddingBottom: insets.bottom - 10,
  });
  const { current: cleanTop } = useRef({
    paddingTop: insets.top || 10,
  });
  const buttonPopUpHeight = window.height * 0.85;

  // the offset of the keyboard avoiding view with the top of the screen
  const keyboardAvoidOffset = buttonPopUpHeight - 90 - window.height;

  const onPressComment = useCallback(() => {
    bottomStore.show(
      'Comments',
      '',
      <CommentList
        entity={entity}
        scrollToBottom={true}
        store={store.comments}
        navigation={navigation}
        keyboardVerticalOffset={keyboardAvoidOffset}
        // onInputFocus={this.onFocus}
        route={route}
      />,
    );
  }, [
    bottomStore,
    entity,
    keyboardAvoidOffset,
    navigation,
    route,
    store.comments,
  ]);

  useEffect(() => {
    if (focused) {
      const user = sessionService.getUser();

      // if we have some video playing we pause it and reset the current video
      videoPlayerService.setCurrent(null);

      if (user.plus && !user.disable_autoplay_videos && mediaRef.current) {
        mediaRef.current.playVideo(false);
      }
    } else {
      mediaRef.current?.pauseVideo();
    }
  }, [focused]);

  useEffect(() => {
    let openComentsTimeOut: NodeJS.Timeout | null = null;
    if (route && (route.params?.focusedUrn || route.params?.scrollToBottom)) {
      openComentsTimeOut = setTimeout(() => {
        onPressComment();
      }, 100);
    }
    return () => {
      if (openComentsTimeOut) {
        clearTimeout(openComentsTimeOut);
      }
    };
  }, [onPressComment, route]);

  const isShortText =
    !hasMedia && !hasRemind && entity.text.length < TEXT_SHORT_THRESHOLD;

  const isMediumText = isShortText
    ? false
    : !hasMedia && !hasRemind && entity.text.length < TEXT_MEDIUM_THRESHOLD;

  const fontStyle = isMediumText
    ? [theme.fontXXL, theme.fontMedium]
    : isShortText
    ? [theme.fontXXXL, theme.fontMedium]
    : theme.fontLM;

  const backgroundColor = ThemedStyles.getColor('secondary_background');
  const startColor = backgroundColor + '00';
  const endColor = backgroundColor + 'FF';

  const showNSFW = entity.shouldBeBlured() && !entity.mature_visibility;

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
      const lang = await translateRef.current.show();
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

  return (
    <View style={[window, theme.flexContainer, theme.backgroundSecondary]}>
      <View style={theme.flexContainer}>
        <OwnerBlock
          entity={entity}
          navigation={navigation}
          containerStyle={[theme.backgroundPrimary, styles.header, cleanTop]}
          leftToolbar={
            <FloatingBackButton
              onPress={navigation.goBack}
              style={[theme.colorPrimaryText, styles.backButton]}
            />
          }
          rightToolbar={
            <View style={theme.rowJustifyCenter}>
              <ActivityActionSheet
                entity={entity}
                navigation={navigation}
                onTranslate={onTranslate}
              />
            </View>
          }>
          <View style={theme.rowJustifyStart}>
            <Text
              style={[
                theme.fontM,
                theme.colorSecondaryText,
                theme.paddingRight,
              ]}>
              {formatDate(entity.time_created, 'friendly')}
            </Text>

            {!!entity.edited && (
              <View style={[theme.rowJustifyCenter, theme.alignCenter]}>
                <Text style={[theme.fontM, theme.colorSecondaryText]}>
                  · {i18n.t('edited').toUpperCase()}
                </Text>
              </View>
            )}
          </View>
        </OwnerBlock>
        <ScrollView
          style={theme.flexContainer}
          onLayout={store.onScrollViewSizeChange}
          onContentSizeChange={store.onContentSizeChange}
          contentContainerStyle={[
            store.contentFit ? theme.justifyCenter : null,
            theme.fullWidth,
            styles.content,
          ]}>
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
                    autoHeight={true}
                  />
                </View>
              ) : (
                <>{lock}</>
              )}
              <TouchableOpacity
                accessibilityLabel="touchableTextCopy"
                onLongPress={copyText}
                style={[theme.paddingHorizontal4x, theme.paddingVertical4x]}>
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
                <View
                  style={[
                    styles.remind,
                    theme.margin2x,
                    theme.borderHair,
                    theme.borderBackgroundPrimary,
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
        </ScrollView>
        {!store.contentFit && (
          <LinearGradient
            colors={[startColor, endColor]}
            style={styles.linear}
          />
        )}
      </View>
      <View style={cleanBottom}>
        <Actions
          entity={entity}
          showCommentsOutlet={false}
          onPressComment={onPressComment}
        />
      </View>
      <BottomOptionPopup
        backgroundColor={
          ThemedStyles.theme === 1
            ? theme.backgroundPrimary
            : theme.backgroundSecondary
        }
        height={buttonPopUpHeight}
        title={bottomStore.title}
        show={bottomStore.visible}
        onCancel={bottomStore.hide}
        onDone={bottomStore.hide}
        content={bottomStore.content}
        doneText=""
      />
    </View>
  );
});

export default ActivityFullScreen;
const styles = StyleSheet.create({
  backButton: {
    position: undefined,
    top: undefined,
    width: 50,
    paddingTop: Platform.select({
      ios: 5,
      android: 0,
    }),
    marginLeft: -17,
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
    elevation: 3,
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
