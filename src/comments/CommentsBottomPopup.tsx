import React, {
  useRef,
  useEffect,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from 'react';
import BottomSheet from 'reanimated-bottom-sheet';
import ThemedStyles from '../styles/ThemedStyles';
import { StyleSheet, View, Text, TouchableHighlight } from 'react-native';

import { observer, useLocalStore } from 'mobx-react';
import Animated from 'react-native-reanimated';
import { useDimensions, useKeyboard } from '@react-native-community/hooks';
import CommentList from './CommentList';
import type BlogModel from '../blogs/BlogModel';
import type GroupModel from '../groups/GroupModel';
import type ActivityModel from '../newsfeed/ActivityModel';
import type CommentsStore from './CommentsStore';
import { useNavigation, useRoute } from '@react-navigation/native';
import i18n from '../common/services/i18n.service';
import { useValue } from 'react-native-redash';
import { IS_FROM_STORE } from '../config/Config';
import DisabledStoreFeature from '../common/components/DisabledStoreFeature';

type PropsType = {
  entity: ActivityModel | GroupModel | BlogModel;
  commentsStore: CommentsStore;
};

const headerHeight = 85;

// proportions of the screen that the bottom sheet will take for full/partial view
const partial = 0.57;
const full = 0.87;

/**
 * Comments Bottom Popup
 */
const CommentsBottomPopup = observer(
  forwardRef((props: PropsType, ref: any) => {
    const theme = ThemedStyles.style;
    const sheetRef = useRef<BottomSheet>(null);
    const route = useRoute();
    const navigation = useNavigation();
    const keyboard = useKeyboard();
    const { height } = useDimensions().window;

    const store = useLocalStore(
      () => ({
        showing: false,
        snap: 0,
        close() {
          store.showing = false;
          this.snap = 0;
          // called twice as a workaround
          sheetRef.current?.snapTo(0);
          sheetRef.current?.snapTo(0);
        },
        open(snap: 1 | 2 = 1) {
          store.showing = true;
          this.snap = snap;
          // called twice as a workaround
          sheetRef.current?.snapTo(snap);
          sheetRef.current?.snapTo(snap);
        },
      }),
      props,
    );

    /**
     * Imperative functionality of the component
     */
    useImperativeHandle(ref, () => ({
      open: store.open,
      close: store.close,
      store: store,
    }));

    useEffect(() => {
      if (keyboard.keyboardShown && store.showing && store.snap === 1) {
        store.open(2);
      }
    }, [keyboard.keyboardShown, store]);

    const fall = useValue(1);

    const fullHeight = height * full;
    const partialHeight = height * partial;

    const animatedSize = Animated.interpolate(fall, {
      inputRange: [0, 1 - partial / full, 1],
      outputRange: [
        fullHeight - headerHeight,
        partialHeight - headerHeight,
        partialHeight - headerHeight,
      ],
      extrapolate: Animated.Extrapolate.CLAMP,
    });

    const backgroundColor =
      ThemedStyles.theme === 1
        ? theme.backgroundPrimary
        : theme.backgroundSecondary;

    const renderContent = useCallback(
      () =>
        store.showing ? (
          <Animated.View style={[backgroundColor, { height: animatedSize }]}>
            {IS_FROM_STORE ? (
              <DisabledStoreFeature style={theme.flexContainer} />
            ) : (
              <CommentList
                entity={props.entity}
                scrollToBottom={true}
                store={props.commentsStore}
                route={route}
                navigation={navigation}
              />
            )}
          </Animated.View>
        ) : null,
      [
        animatedSize,
        backgroundColor,
        navigation,
        props.commentsStore,
        props.entity,
        route,
        store,
      ],
    );

    const renderHeader = useCallback(() => {
      const t = ThemedStyles.style;
      return store.showing ? (
        <View style={styles.headerContainer}>
          <View
            style={[
              backgroundColor,
              t.rowJustifyCenter,
              t.alignCenter,
              styles.header,
            ]}>
            <Text style={[t.fontXL, t.fontMedium]}>
              {i18n.t('comments.comments')}
            </Text>
          </View>
        </View>
      ) : null;
    }, [backgroundColor, store.showing]);

    return (
      <>
        {store.showing && (
          <TouchableHighlight
            style={[styles.overlay, theme.backgroundBlack]}
            onPress={store.close}>
            <View />
          </TouchableHighlight>
        )}
        <BottomSheet
          ref={sheetRef}
          callbackNode={fall}
          snapPoints={[0, partialHeight, fullHeight]}
          onCloseEnd={store.close}
          enabledContentGestureInteraction={false}
          enabledHeaderGestureInteraction={true}
          renderHeader={renderHeader}
          renderContent={renderContent}
          initialSnap={0}
          enabledContentTapInteraction={false}
          enabledInnerScrolling={false}
        />
      </>
    );
  }),
);

export default CommentsBottomPopup;

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.5,
  },
  headerContainer: {
    overflow: 'hidden',
    paddingTop: 20,
    zIndex: 2000,
  },
  header: {
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -10,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5.0,
    elevation: 8,
    padding: 20,
  },
});
