import React, { useRef, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';

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
import { useDimensions } from '@react-native-community/hooks';
import { observer, useLocalStore } from 'mobx-react';
import ActivityEditor from '../../../newsfeed/activity/ActivityEditor';
import BottomOptionPopup, {
  useBottomOption,
  BottomOptionsStoreType,
} from '../../../common/components/BottomOptionPopup';
import CommentList from '../../../comments/CommentList';
import CommentsStore from '../../../comments/CommentsStore';
import { ScrollView } from 'react-native-gesture-handler';
import isIphoneX from '../../../common/helpers/isIphoneX';
import ExplicitOverlay from '../../../common/components/explicit/ExplicitOverlay';

const FONT_THRESHOLD = 300;

type PropsType = {
  entity: ActivityModel;
};

const ActivityFullScreen = observer((props: PropsType) => {
  const store = useLocalStore(() => ({
    isEditing: false,
    comments: new CommentsStore(),
    toggleEdit() {
      store.isEditing = !store.isEditing;
    },
  }));
  const route = useRoute();

  const bottomStore: BottomOptionsStoreType = useBottomOption();

  const insets = useSafeArea();
  const window = useDimensions().window;
  const theme = ThemedStyles.style;
  const entity: ActivityModel = props.entity;
  // entity.boosted = true;
  const mediaRef = useRef<MediaView>(null);
  const remindRef = useRef<Activity>(null);
  const translateRef = useRef<Translate>(null);
  const navigation = useNavigation();
  const hasMedia = entity.hasMedia();
  const hasRemind = !!entity.remind_object;
  const overlay = entity.shouldBeBlured() ? (
    <ExplicitOverlay
      entity={entity}
      closeContainerStyle={{ paddingTop: insets.top }}
    />
  ) : null;
  const showText = (!!entity.text || !!entity.title) && !store.isEditing;

  const isShortText =
    !hasMedia && !hasRemind && entity.text.length < FONT_THRESHOLD;

  const fontStyle = isShortText
    ? [theme.fontXL, theme.fontMedium]
    : theme.fontL;

  const backgroundColor = ThemedStyles.getColor('primary_background');
  const startColor = backgroundColor + '00';
  const endColor = backgroundColor + 'FF';

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
  }, []);

  const onPressComment = useCallback(() => {
    bottomStore.show(
      'Comments',
      '',
      <CommentList
        entity={entity}
        scrollToBottom={true}
        store={store.comments}
        navigation={navigation}
        keyboardVerticalOffset={isIphoneX ? -225 : -185}
        // onInputFocus={this.onFocus}
        route={route}
      />,
    );
  }, [bottomStore, entity, navigation, route, store.comments]);

  return (
    <View style={[window, theme.flexContainer]}>
      <View style={theme.flexContainer}>
        <ScrollView
          style={theme.flexContainer}
          contentContainerStyle={[
            theme.fullWidth,
            !isShortText ? styles.paddingBottom : null,
            hasMedia
              ? null
              : { paddingTop: insets.top + 40, minHeight: window.height - 200 },
          ]}>
          {hasMedia && (
            <MediaView
              ref={mediaRef}
              entity={entity}
              navigation={navigation}
              autoHeight={true}
            />
          )}
          <FloatingBackButton
            onPress={navigation.goBack}
            style={hasMedia ? theme.colorWhite : theme.colorPrimaryText}
          />
          <OwnerBlock
            entity={entity}
            navigation={navigation}
            rightToolbar={
              <View style={theme.rowJustifyCenter}>
                <ActivityActionSheet
                  toggleEdit={store.toggleEdit}
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
          <View
            style={[
              theme.paddingHorizontal4x,
              isShortText
                ? [theme.fullHeight, theme.rowJustifyCenter, theme.alignCenter]
                : null,
            ]}>
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
            {store.isEditing && (
              <ActivityEditor entity={entity} toggleEdit={store.toggleEdit} />
            )}
          </View>
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
        </ScrollView>
        {!isShortText && (
          <LinearGradient
            colors={[startColor, endColor]}
            style={styles.linear}
          />
        )}
      </View>
      <View
        style={[theme.rowJustifyStart, { paddingBottom: insets.bottom - 10 }]}>
        <Actions
          entity={entity}
          showCommentsOutlet={false}
          onPressComment={onPressComment}
        />
      </View>
      {overlay}
      <BottomOptionPopup
        height={window.height * 0.85}
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
  linear: {
    position: 'absolute',
    bottom: 0,
    height: '10%',
    width: '100%',
  },
  paddingBottom: {
    paddingBottom: 80,
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
