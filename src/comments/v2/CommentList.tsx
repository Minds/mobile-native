import React from 'react';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { View } from 'react-native';
import ThemedStyles from '../../styles/ThemedStyles';
import Comment from './Comment';
import type CommentsStore from './CommentsStore';
import CommentListHeader from './CommentListHeader';
import LoadMore from './LoadMore';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { CommentInputContext } from './CommentInput';
import { GOOGLE_PLAY_STORE } from '../../config/Config';
import DisabledStoreFeature from '../../common/components/DisabledStoreFeature';

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
};

/**
 * Comments List
 * @param props
 */
const CommentList: React.FC<PropsType> = (props: PropsType) => {
  const theme = ThemedStyles.style;
  const ref = React.useRef<any>(null);
  const provider = React.useContext(CommentInputContext);
  const navigation = useNavigation<any>();

  useFocusEffect(
    React.useCallback(() => {
      provider.setStore(props.store);
    }, [props.store, provider]),
  );

  React.useEffect(() => {
    // the value is cleared after the first load
    const focusedUrn = props.store?.focusedUrn;

    props.store.loadComments(true).then(() => {
      if (!focusedUrn) {
        setTimeout(() => ref.current?.scrollToEnd(), 600);
      } else {
        // open focused if necessary
        const focused = props.store.comments.find((c) => c.expanded);
        if (focused) {
          if (!GOOGLE_PLAY_STORE) {
            navigation.push('ReplyComment', {
              comment: focused,
              entity: props.store.entity,
            });
          }
        } else {
          const index = props.store.comments.findIndex((c) => c.focused);
          if (index && index > 0) {
            setTimeout(() => {
              ref.current?.scrollToIndex({
                index,
                viewPosition: 0,
                animated: true,
              });
            }, 600);
          }
        }
      }
    });
  }, [navigation, props.store, provider]);

  const renderItem = React.useCallback(
    (row: any): React.ReactElement => {
      const comment = row.item;

      // add the editing observable property
      comment.editing = observable.box(false);

      return <Comment comment={comment} store={props.store} />;
    },
    [props.store],
  );

  const Header = React.useCallback(() => {
    return <LoadMore store={props.store} />;
  }, [props.store]);

  const Footer = React.useCallback(() => {
    return <LoadMore store={props.store} next={true} />;
  }, [props.store]);

  return (
    <View style={[theme.flexContainer, theme.backgroundPrimary]}>
      <CommentListHeader store={props.store} />
      {GOOGLE_PLAY_STORE ? (
        <DisabledStoreFeature
          style={[
            theme.backgroundPrimary,
            theme.flexContainer,
            theme.padding4x,
          ]}
        />
      ) : (
        <BottomSheetFlatList
          focusHook={useFocusEffect}
          ref={ref}
          data={props.store.comments.slice()}
          ListHeaderComponent={Header}
          ListFooterComponent={Footer}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          style={[theme.flexContainer, theme.backgroundPrimary]}
          contentContainerStyle={[
            theme.backgroundPrimary,
            theme.paddingBottom3x,
          ]}
        />
      )}
    </View>
  );
};

const keyExtractor = (item) => item.guid;

export default observer(CommentList);
