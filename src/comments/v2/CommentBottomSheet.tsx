import React, { forwardRef } from 'react';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackgroundProps,
} from '@gorhom/bottom-sheet';
import { Dimensions, View } from 'react-native';

import ThemedStyles from '../../styles/ThemedStyles';
import Handle from './Handle';
import CommentList from './CommentList';
import CommentsStore from './CommentsStore';
import {
  createStackNavigator,
  StackNavigationOptions,
  TransitionPresets,
} from '@react-navigation/stack';
import { useRoute } from '@react-navigation/native';
import CommentInput from './CommentInput';
import { useLocalStore } from 'mobx-react';
import { GOOGLE_PLAY_STORE } from '../../config/Config';

const BottomSheetLocalStore = ({ onChange }) => ({
  isOpen: 0,
  setOpen(isOpen: number) {
    if (this.isOpen !== isOpen) {
      this.isOpen = isOpen;
    }
    onChange && onChange(isOpen);
  },
});

const { height: windowHeight } = Dimensions.get('window');

const snapPoints = [-150, Math.floor(windowHeight * 0.85)];

/**
 * Custom background
 * (fixes visual issues on Android dark mode)
 */
const CustomBackground = ({ style }: BottomSheetBackgroundProps) => {
  return <View style={style} />;
};

type PropsType = {
  commentsStore: CommentsStore;
  hideContent: boolean;
  title?: string;
  onChange?: (isOpen: number) => void;
};

const Stack = createStackNavigator();

const ScreenReplyComment = () => {
  const route = useRoute<any>();
  const store = React.useMemo(() => {
    const s = new CommentsStore(route.params.entity);
    s.setParent(route.params.comment);
    return s;
  }, [route.params.comment, route.params.entity]);
  React.useEffect(() => {
    if (route.params.open) {
      store.setShowInput(true);
    }
  }, []);

  return <CommentList store={store} />;
};

const CommentBottomSheet = (props: PropsType, ref: any) => {
  const localStore = useLocalStore(BottomSheetLocalStore, {
    onChange: props.onChange,
  });
  const { current: focusedUrn } = React.useRef(
    props.commentsStore.getFocusedUrn(),
  );
  const route = useRoute<any>();

  React.useEffect(() => {
    if (
      !GOOGLE_PLAY_STORE &&
      ((props.commentsStore.parent &&
        props.commentsStore.parent['comments:count'] === 0) ||
        (route.params.open &&
          props.commentsStore.entity['comments:count'] === 0))
    ) {
      setTimeout(() => {
        if (props?.commentsStore) {
          props.commentsStore.setShowInput(true);
        }
      }, 500);
    }
  }, [props.commentsStore, route.params.open]);

  const screenOptions = React.useMemo<StackNavigationOptions>(
    () => ({
      ...TransitionPresets.SlideFromRightIOS,
      headerShown: false,
      safeAreaInsets: { top: 0 },
      // headerBackground: ThemedStyles.style.bgSecondaryBackground,
      cardStyle: ThemedStyles.style.bgSecondaryBackground,
    }),
    [],
  );

  const ScreenComment = React.useCallback(
    () => <CommentList store={props.commentsStore} />,
    [props.commentsStore],
  );

  // renders
  const renderBackdrop = React.useCallback(
    props => <BottomSheetBackdrop {...props} pressBehavior="collapse" />,
    [],
  );

  return [
    <BottomSheet
      key="commentSheet"
      ref={ref}
      index={0}
      onChange={localStore.setOpen}
      containerHeight={windowHeight}
      snapPoints={snapPoints}
      handleComponent={Handle}
      backgroundComponent={CustomBackground}
      backdropComponent={renderBackdrop}>
      {!props.hideContent && ( // we disable the navigator until the screen is focused (for the post swiper)
        <Stack.Navigator screenOptions={screenOptions} headerMode="none">
          <Stack.Screen
            name="Comments"
            component={ScreenComment}
            initialParams={{
              title: props.title || '',
            }}
          />
          <Stack.Screen
            name="ReplyComment"
            component={ScreenReplyComment}
            initialParams={{ focusedUrn }}
          />
        </Stack.Navigator>
      )}
    </BottomSheet>,
    <CommentInput key="commentInput" />,
  ];
};

// @ts-ignore
export default forwardRef(CommentBottomSheet);
