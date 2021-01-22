import React, { forwardRef } from 'react';
import BottomSheet, {
  BottomSheetBackdropProps,
  BottomSheetBackgroundProps,
  TouchableOpacity,
  useBottomSheet,
} from '@gorhom/bottom-sheet';
import Animated, { Extrapolate, interpolate } from 'react-native-reanimated';
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
import { observer, useLocalStore } from 'mobx-react';
import { GOOGLE_PLAY_STORE } from '../../config/Config';

const BottomSheetLocalStore = () => ({
  isOpen: 0,
  setOpen(isOpen: number) {
    if (this.isOpen !== isOpen) {
      this.isOpen = isOpen;
    }
  },
});

type BackdropProps = {
  localStore: ReturnType<typeof BottomSheetLocalStore>;
} & BottomSheetBackdropProps;

const { height: windowHeight } = Dimensions.get('window');

const snapPoints = [-150, windowHeight * 0.85];

const CustomBackdrop = observer(
  ({ animatedIndex, style, localStore }: BackdropProps) => {
    const theme = ThemedStyles.style;
    // animated variables
    const animatedOpacity = React.useMemo(
      () =>
        interpolate(animatedIndex, {
          inputRange: [0, 1],
          outputRange: [0, 0.8],
          extrapolate: Extrapolate.CLAMP,
        }),
      [animatedIndex],
    );

    // styles
    const containerStyle = React.useMemo(
      () => [
        style,
        ThemedStyles.style.backgroundSecondary,
        {
          opacity: animatedOpacity,
        },
      ],
      [style, animatedOpacity],
    );

    if (localStore.isOpen === 1) {
      return (
        <Animated.View style={containerStyle} pointerEvents="box-none">
          <TouchableOpacity
            onPress={useBottomSheet().close}
            style={[theme.fullHeight, theme.fullWidth]}
          />
        </Animated.View>
      );
    }

    return <Animated.View style={containerStyle} pointerEvents="box-none" />;
  },
);

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
  const localStore = useLocalStore(BottomSheetLocalStore);
  const { current: focusedUrn } = React.useRef(
    props.commentsStore.getFocuedUrn(),
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
  }, []);

  const screenOptions = React.useMemo<StackNavigationOptions>(
    () => ({
      ...TransitionPresets.SlideFromRightIOS,
      headerShown: false,
      safeAreaInsets: { top: 0 },
      headerBackground: ThemedStyles.style.backgroundSecondary,
      cardStyle: ThemedStyles.style.backgroundSecondary,
    }),
    [],
  );

  const ScreenComment = React.useCallback(
    () => <CommentList store={props.commentsStore} />,
    [props.commentsStore],
  );

  const Backdrop = (bottomSheetBackdropProps: BottomSheetBackdropProps) => (
    <CustomBackdrop {...bottomSheetBackdropProps} localStore={localStore} />
  );

  return [
    <BottomSheet
      ref={ref}
      index={0}
      onChange={localStore.setOpen}
      containerHeight={windowHeight + 10}
      snapPoints={snapPoints}
      handleComponent={Handle}
      backgroundComponent={CustomBackground}
      backdropComponent={Backdrop}>
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
    <CommentInput />,
  ];
};

// @ts-ignore
export default forwardRef(CommentBottomSheet);
