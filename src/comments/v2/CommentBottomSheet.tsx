import React, { forwardRef, useCallback } from 'react';
import { useBackHandler } from '@react-native-community/hooks';
import {
  createStackNavigator,
  StackNavigationOptions,
  TransitionPresets,
} from '@react-navigation/stack';
import { useRoute } from '@react-navigation/native';
import { observer, useLocalStore } from 'mobx-react';
import type BottomSheetType from '@gorhom/bottom-sheet';

import CommentList from './CommentList';
import CommentsStore from './CommentsStore';
import CommentInput from './CommentInput';
import ThemedStyles from '~/styles/ThemedStyles';
import Handle from '~/common/components/bottom-sheet/Handle';
import BottomSheet from '~/common/components/bottom-sheet/BottomSheet';

const bottomSheetLocalStore = ({ onChange, autoOpen }) => ({
  isRendered: Boolean(autoOpen),
  index: Boolean(autoOpen) ? 0 : -1,
  setIsRendered(isRendered: boolean) {
    this.isRendered = isRendered;
    this.index = isRendered ? 0 : -1;
  },
  setIndex(index: number) {
    this.index = index;
    onChange && onChange(index);
  },
});

const snapPoints = ['85%'];

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

  const sheetRef = React.useRef<BottomSheetType>(null);
  const route = useRoute<any>();

  React.useImperativeHandle(ref, () => ({
    expand: () => {
      if (localStore.isRendered) {
        localStore.setIndex(0);
      } else {
        localStore.setIsRendered(true);
      }
    },
    close: () => {
      localStore.setIndex(-1);
    },
  }));

  React.useEffect(() => {
    if (!localStore.isRendered && props.autoOpen) {
      localStore.setIsRendered(true);
    }
  }, [props.autoOpen, localStore]);

  React.useEffect(() => {
    if (
      (props.commentsStore.parent &&
        props.commentsStore.parent['comments:count'] === 0) ||
      (route.params.open && props.commentsStore.entity['comments:count'] === 0)
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

  const renderHandle = useCallback(
    () => <Handle style={ThemedStyles.style.bgPrimaryBackground} />,
    [],
  );

  if (!localStore.isRendered) {
    return null;
  }

  return (
    <>
      <BottomSheet
        key="commentSheet"
        ref={sheetRef}
        index={localStore.index}
        onChange={localStore.setIndex}
        snapPoints={snapPoints}
        enableContentPanningGesture={true}
        handleComponent={renderHandle}>
        <Stack.Navigator screenOptions={screenOptions}>
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
      </BottomSheet>
      <CommentInput key="commentInput" />
    </>
  );
};

// @ts-ignore
export default observer(forwardRef(CommentBottomSheet));
