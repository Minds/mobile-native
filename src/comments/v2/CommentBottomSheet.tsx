import React, { forwardRef, useCallback } from 'react';
import { useBackHandler } from '@react-native-community/hooks';
import {
  createStackNavigator,
  StackNavigationOptions,
  TransitionPresets,
} from '@react-navigation/stack';
import { NavigationContainer, useRoute } from '@react-navigation/native';

import { BottomSheetBackdrop, BottomSheetModal } from '@gorhom/bottom-sheet';
import { observer, useLocalStore } from 'mobx-react';

import CommentList from './CommentList';
import CommentsStore from './CommentsStore';
import CommentInput from './CommentInput';
import ThemedStyles from '~/styles/ThemedStyles';
import Handle from '~/common/components/bottom-sheet/Handle';

const bottomSheetLocalStore = ({ autoOpen }) => ({
  isRendered: Boolean(autoOpen),
  setIsRendered(isRendered: boolean) {
    this.isRendered = isRendered;
  },
});

const snapPoints = ['85%'];

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
  onChange?: (isOpen: number) => void;
};

const Stack = createStackNavigator();

const ScreenReplyComment = ({ navigation }) => {
  const route = useRoute<any>();

  useBackHandler(() => {
    navigation.goBack();
    return true;
  });
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
  const localStore = useLocalStore(bottomSheetLocalStore, {
    onChange: props.onChange,
    autoOpen: props.autoOpen,
  });
  const { current: focusedUrn } = React.useRef(
    props.commentsStore.getFocusedUrn(),
  );

  const sheetRef = React.useRef<any>(null);
  const route = useRoute<any>();

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

  React.useEffect(() => {
    if (
      (props.commentsStore.parent &&
        props.commentsStore.parent['comments:count'] === 0) ||
      (route.params?.open && props.commentsStore.entity['comments:count'] === 0)
    ) {
      setTimeout(() => {
        if (props?.commentsStore) {
          props.commentsStore.setShowInput(true);
        }
      }, 500);
    }
  }, [props.commentsStore, route.params]);

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
    () => <CommentList store={props.commentsStore} />,
    [props.commentsStore],
  );

  // renders

  const renderHandle = useCallback(
    () => <Handle style={ThemedStyles.style.bgPrimaryBackground} />,
    [],
  );

  if (!localStore.isRendered) {
    return null;
  }

  return (
    <>
      <BottomSheetModal
        key="commentSheet"
        backdropComponent={renderBackdrop}
        handleHeight={20}
        backgroundComponent={null}
        ref={sheetRef}
        snapPoints={snapPoints}
        index={0}
        enableContentPanningGesture={true}
        handleComponent={renderHandle}>
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
              initialParams={{ focusedUrn }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </BottomSheetModal>
      <CommentInput key="commentInput" />
    </>
  );
};

// @ts-ignore
export default observer(forwardRef(CommentBottomSheet));
