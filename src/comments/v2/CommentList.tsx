import React, { useCallback } from 'react';
import { BottomSheetFlatList, TouchableOpacity } from '@gorhom/bottom-sheet';
import { Image } from 'expo-image';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { StyleSheet, View } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import ThemedStyles from '~/styles/ThemedStyles';
import Comment from './Comment';
import type CommentsStore from './CommentsStore';
import CommentListHeader from './CommentListHeader';
import LoadMore from './LoadMore';
import CommentInput, { CommentInputContext } from './CommentInput';
import sessionService from '~/common/services/session.service';
import GroupModel from '~/groups/GroupModel';

import i18n from '~/common/services/i18n.service';
import MText from '~/common/components/MText';
import CommentModel from './CommentModel';
import PermissionsService from '~/common/services/permissions.service';

// types
type PropsType = {
  header?: any;
  parent?: any;
  keyboardVerticalOffset?: any;
  store: CommentsStore;
  user?: any;
  scrollToBottom?: boolean;
  onInputFocus?: Function;
  onCommentFocus?: Function;
  navigation: any;
};

/**
 * Comments List
 * @param props
 */
const CommentList: React.FC<PropsType> = (props: PropsType) => {
  const ref = React.useRef<any>(null);
  const provider = React.useContext(CommentInputContext);
  const navigation = useNavigation<any>();
  const user = sessionService.getUser();

  const placeHolder =
    props.store.entity instanceof GroupModel
      ? 'messenger.typeYourMessage'
      : 'activity.typeComment';

  useFocusEffect(
    React.useCallback(() => {
      provider.setStore(props.store);
    }, [props.store, provider]),
  );

  /**
   * Scrolls to focused comment
   */
  const scrollToFocusedComment = useCallback((comments: CommentModel[]) => {
    const index = comments.findIndex(c => c.focused);
    if (index >= 0) {
      ref.current?.scrollToIndex({
        index,
        viewPosition: 0,
        animated: true,
      });
    }
  }, []);

  /**
   * in case we attempted to scroll to an index that was out of the viewport, the flatlist
   * raises and error. In this case we're scrolling as far down as possible, then we attempt
   * to scroll to index again.
   */
  const handleScrollToIndexFailed = useCallback(() => {
    setTimeout(() => {
      ref.current?.scrollToEnd();
      scrollToFocusedComment(props.store.comments);
    }, 0);
  }, [props.store.comments, scrollToFocusedComment]);

  React.useEffect(() => {
    // the value is cleared after the first load
    const focusedCommentUrn = props.store?.focusedCommentUrn;

    props.store.loadComments(true).then(() => {
      if (focusedCommentUrn) {
        // open focused if necessary
        const focused = props.store.comments.find(c => c.expanded);
        if (focused) {
          navigation.push('ReplyComment', {
            comment: focused,
            entity: props.store.entity,
          });
        } else {
          setTimeout(() => {
            scrollToFocusedComment(props.store.comments);
          }, 600);
        }
      }
    });
  }, [navigation, props.store, provider, scrollToFocusedComment]);

  const canComment = PermissionsService.canComment();

  const renderItem = React.useCallback(
    (row: any): React.ReactElement => {
      const comment = row.item;

      // add the editing observable property
      comment.editing = observable.box(false);

      return (
        <Comment
          comment={comment}
          store={props.store}
          hideReply={!canComment}
        />
      );
    },
    [props.store, canComment],
  );

  const Header = React.useCallback(() => {
    return (
      <>
        {props.store.parent && (
          <View style={styles.headerCommentContainer}>
            <Comment
              comment={props.store.parent}
              store={props.store}
              hideReply
              isHeader
            />
          </View>
        )}

        {props.store.entity.allow_comments && (
          <TouchableOpacity
            onPress={() => props.store.setShowInput(true)}
            disabled={!canComment}
            style={
              canComment
                ? styles.touchableStyles
                : [styles.touchableStyles, styles.disabled]
            }>
            <Image source={user.getAvatarSource()} style={styles.avatar} />
            <MText style={styles.reply}>
              {i18n.t(props.store.parent ? 'activity.typeReply' : placeHolder)}
            </MText>
          </TouchableOpacity>
        )}

        <LoadMore store={props.store} next={true} />
      </>
    );
  }, [canComment, placeHolder, props.store, user]);

  const Footer = React.useCallback(() => {
    return <LoadMore store={props.store} />;
  }, [props.store]);
  const loadMore = React.useCallback(() => {
    return props.store.loadComments();
  }, [props.store]);

  return (
    <View style={styles.container}>
      <CommentListHeader store={props.store} navigation={navigation} />
      <BottomSheetFlatList
        focusHook={useFocusEffect}
        ref={ref}
        data={props.store.comments.slice()}
        ListHeaderComponent={Header}
        onRefresh={props.store.refresh}
        refreshing={props.store.refreshing}
        ListFooterComponent={Footer}
        keyExtractor={keyExtractor}
        initialNumToRender={4}
        maxToRenderPerBatch={4}
        onEndReached={loadMore}
        renderItem={renderItem}
        style={styles.list}
        onScrollToIndexFailed={handleScrollToIndexFailed}
        contentContainerStyle={styles.listContainer}
      />
      <CommentInput key="commentInput" />
    </View>
  );
};

const styles = ThemedStyles.create({
  list: ['flexContainer', 'bgPrimaryBackgroundHighlight'],
  listContainer: ['bgPrimaryBackgroundHighlight', 'paddingBottom3x'],
  container: ['flexContainer', 'bgPrimaryBackgroundHighlight'],
  touchableStyles: [
    'rowJustifyStart',
    'borderTopHair',
    'borderBottomHair',
    'bcolorPrimaryBorder',
    'paddingTop2x',
    'paddingBottom2x',
    'alignCenter',
  ],
  disabled: ['opacity50'],
  replay: ['fontL', 'colorSecondaryText'],
  headerCommentContainer: [
    'bcolorPrimaryBorder',
    'bgPrimaryBackgroundHighlight',
    {
      borderTopWidth: StyleSheet.hairlineWidth,
      overflow: 'scroll',
    },
  ],
  avatar: [
    {
      height: 37,
      width: 37,
      borderRadius: 18.5,
      marginRight: 15,
      marginLeft: 15,
    },
  ],
});

const keyExtractor = item => item.guid;

export default observer(CommentList);
