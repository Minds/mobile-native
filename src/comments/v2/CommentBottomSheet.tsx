import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet';
import {
  useBackHandler,
  useDimensions,
  useKeyboard,
} from '@react-native-community/hooks';
import {
  NavigationContainer,
  useFocusEffect,
  useRoute,
} from '@react-navigation/native';
import {
  StackNavigationOptions,
  TransitionPresets,
  createStackNavigator,
} from '@react-navigation/stack';
import { observer, useLocalStore } from 'mobx-react';
import React, { forwardRef, useCallback } from 'react';
import { BackHandler, Dimensions } from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Handle from '~/common/components/bottom-sheet/Handle';
import ThemedStyles from '~/styles/ThemedStyles';
import { pushBottomSheet } from '../../common/components/bottom-sheet';
import CommentList from './CommentList';
import CommentsStore from './CommentsStore';

const bottomSheetLocalStore = ({ autoOpen }) => ({
  isRendered: Boolean(autoOpen),
  isVisible: false,
  setIsRendered(isRendered: boolean) {
    this.isRendered = isRendered;
  },
  setIsVisible(index: number) {
    this.isVisible = index === 0;
  },
});

const renderBackdrop = backdropProps => (
  <BottomSheetBackdrop
    {...backdropProps}
    pressBehavior="close"
    opacity={0.5}
    appearsOnIndex={0}
    disappearsOnIndex={-1}
  />
);

type PropsType = {
  commentsStore: CommentsStore;
  autoOpen?: boolean; // auto opens the bottom sheet when the component mounts
  title?: string;
  onChange?: (isOpen: boolean) => void;
};

const Stack = createStackNavigator();

const ScreenReplyComment = ({ navigation }) => {
  const route = useRoute<any>();
  const { comment, entity, open, parentCommentsStore } = route.params ?? {};

  useBackHandler(() => {
    navigation.goBack();
    return true;
  });
  const store = React.useMemo(() => {
    const commentStore = new CommentsStore(
      entity,
      parentCommentsStore?.getAnalyticContexts(),
    );
    commentStore.setParent(comment);
    return commentStore;
  }, [comment, entity]);
  React.useEffect(() => {
    if (open) {
      store.setShowInput(true);
    }
  }, [open, store]);

  return <CommentList store={store} navigation={navigation} />;
};

const CommentBottomSheetBase = (props: PropsType) => {
  const { current: focusedCommentUrn } = React.useRef(
    props.commentsStore.getFocusedCommentUrn(),
  );

  React.useEffect(() => {
    if (
      props.commentsStore?.parent?.['comments:count'] === 0 ||
      props.commentsStore?.entity?.['comments:count'] === 0
    ) {
      props.commentsStore?.setShowInput(true);
    }
  }, [props.commentsStore]);

  const screenOptions = React.useMemo<StackNavigationOptions>(
    () => ({
      ...TransitionPresets.SlideFromRightIOS,
      headerShown: false,
      safeAreaInsets: { top: 0 },
      // headerBackground: ThemedStyles.style.bgSecondaryBackground,
      cardStyle: [
        ThemedStyles.style.bgSecondaryBackground,
        { overflow: 'visible' },
      ],
    }),
    [],
  );

  const ScreenComment = React.useCallback(
    ({ navigation }) => (
      <CommentList store={props.commentsStore} navigation={navigation} />
    ),
    [props.commentsStore],
  );

  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator
        screenOptions={screenOptions}
        initialRouteName="Comments">
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
          initialParams={{
            focusedCommentUrn,
            parentCommentsStore: props.commentsStore,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const CommentBottomSheet = (props: PropsType, ref: any) => {
  const height = useDimensions().window.height;
  const topInsets = useSafeAreaInsets().top;

  const localStore = useLocalStore(bottomSheetLocalStore, {
    autoOpen: props.autoOpen,
  });

  const sheetRef = React.useRef<any>(null);

  React.useImperativeHandle(ref, () => ({
    expand: () => {
      if (localStore.isRendered) {
        sheetRef.current?.present();
      } else {
        localStore.setIsRendered(true);
      }
    },
    close: () => {
      sheetRef.current?.dismiss();
    },
  }));

  // back button handler
  const backHandler = useCallback(() => {
    if (localStore.isVisible) {
      sheetRef.current?.dismiss();
      return true;
    }

    return false;
  }, [sheetRef, localStore.isVisible]);

  // hardware back button handling when screen is focused
  useFocusEffect(
    useCallback(() => {
      BackHandler.addEventListener('hardwareBackPress', backHandler);

      return () =>
        BackHandler.removeEventListener('hardwareBackPress', backHandler);
    }, [backHandler]),
  );

  React.useEffect(() => {
    if (!localStore.isRendered && props.autoOpen) {
      localStore.setIsRendered(true);
    }
  }, [props.autoOpen, localStore]);

  React.useEffect(() => {
    if (localStore.isRendered) {
      sheetRef.current?.present();
    }
  }, [localStore.isRendered]);

  // renders

  const renderHandle = useCallback(
    () => <Handle style={ThemedStyles.style.bgPrimaryBackground} />,
    [],
  );
  const onDismiss = useCallback(() => {
    props.commentsStore.setShowInput(false);
  }, [props.commentsStore]);

  const { keyboardShown } = useKeyboard();

  if (!localStore.isRendered) {
    return null;
  }

  return (
    <BottomSheetModal
      key="commentSheet"
      backdropComponent={renderBackdrop}
      onDismiss={onDismiss}
      onChange={localStore.setIsVisible}
      handleHeight={20}
      backgroundComponent={null}
      ref={sheetRef}
      snapPoints={[keyboardShown ? height - topInsets : '85%']}
      index={0}
      enableContentPanningGesture={true}
      handleComponent={renderHandle}>
      <CommentBottomSheetBase {...props} />
    </BottomSheetModal>
  );
};

export function pushCommentBottomSheet(props: PropsType) {
  const { height } = Dimensions.get('window');

  return pushBottomSheet({
    snapPoints: ['85%'],
    enableContentPanningGesture: true,
    component: (ref, onLayout) => (
      <SafeAreaView
        edges={['bottom']}
        onLayout={onLayout}
        style={{ height: height * 0.85 }}>
        <CommentBottomSheetBase {...props} />
      </SafeAreaView>
    ),
  });
}

// @ts-ignore
export default observer(forwardRef(CommentBottomSheet));
