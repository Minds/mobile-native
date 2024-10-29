import { useBackHandler } from '@react-native-community/hooks';
import { NavigationContainer, useRoute } from '@react-navigation/native';
import {
  StackNavigationOptions,
  TransitionPresets,
  createStackNavigator,
} from '@react-navigation/stack';
import React from 'react';
import { View, useWindowDimensions } from 'react-native';

import { pushBottomSheet } from '../../common/components/bottom-sheet';
import CommentList from './CommentList';
import CommentsStore from './CommentsStore';
import sp from '~/services/serviceProvider';

type PropsType = {
  commentsStore: CommentsStore;
  autoOpen?: boolean; // auto opens the bottom sheet when the component mounts
  title?: string;
  onLayout: ({
    nativeEvent: {
      layout: { height },
    },
  }: any) => void;
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
  }, [comment, entity, parentCommentsStore]);
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

  const { height } = useWindowDimensions();

  /**
   * Auto show the input if there is no comments (if user can comment)
   */
  React.useEffect(() => {
    if (
      (props.commentsStore?.parent?.['comments:count'] === 0 ||
        props.commentsStore?.entity?.['comments:count'] === 0) &&
      sp.permissions.canComment()
    ) {
      props.commentsStore?.setShowInput(true);
    }
  }, [props.commentsStore]);

  const screenOptions = React.useMemo<StackNavigationOptions>(
    () => ({
      ...TransitionPresets.SlideFromRightIOS,
      headerShown: false,
      safeAreaInsets: { top: 0 },
      // headerBackground:  sp.styles.style.bgSecondaryBackground,
      cardStyle: [
        sp.styles.style.bgSecondaryBackground,
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
      <View style={{ height: height * 0.85 }} onLayout={props.onLayout}>
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
      </View>
    </NavigationContainer>
  );
};

export function pushCommentBottomSheet(props: Omit<PropsType, 'onLayout'>) {
  return pushBottomSheet({
    safe: false,
    onClose: () => {
      props.commentsStore?.setShowInput(false);
    },
    enableContentPanningGesture: true,
    component: (ref, onLayout) => (
      <CommentBottomSheetBase {...props} onLayout={onLayout} />
    ),
  });
}
