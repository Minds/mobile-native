import React from 'react';
import { observer } from 'mobx-react';
import * as entities from 'entities';
// import ReadMore from 'react-native-read-more-text';
import { LinearGradient } from 'expo-linear-gradient';
import { View, Text, StyleSheet } from 'react-native';
import { TouchableOpacity } from '@gorhom/bottom-sheet';

import ReplyAction from '../ReplyAction';
import CommentHeader from './CommentHeader';
import type CommentModel from './CommentModel';
import type CommentsStore from './CommentsStore';
import CommentBottomMenu from './CommentBottomMenu';
import ThemedStyles from '../../styles/ThemedStyles';
import i18n from '../../common/services/i18n.service';
import { useNavigation } from '@react-navigation/native';
import ThumbUpAction from '../../newsfeed/activity/actions/ThumbUpAction';
import ThumbDownAction from '../../newsfeed/activity/actions/ThumbDownAction';
import MediaView from '../../common/components/MediaView';
import { LIGHT_THEME } from '../../styles/Colors';
import ReadMore from '../../common/components/ReadMore';
import Translate from '../../common/components/translate/Translate';

type PropsType = {
  comment: CommentModel;
  store: CommentsStore;
  hideReply?: boolean;
  isHeader?: boolean;
};

/**
 * Comment Component
 */
export default observer(function Comment(props: PropsType) {
  const navigation = useNavigation<any>();
  const translateRef = React.useRef<any>();
  const theme = ThemedStyles.style;

  const mature = props.comment.mature && !props.comment.mature_visibility;

  const canReply =
    props.comment.can_reply &&
    props.comment.parent_guid_l2 === '0' &&
    !props.hideReply;

  const backgroundColor = ThemedStyles.getColor(
    props.isHeader ? 'SecondaryBackground' : 'PrimaryBackground',
  );
  const startColor = (ThemedStyles.theme ? '#242A30' : '#F5F5F5') + '00';
  const endColor = backgroundColor + 'FF';

  const renderRevealedFooter = React.useCallback(handlePress => {
    return (
      <TouchableOpacity onPress={handlePress}>
        <Text style={styles.revealedFooter}>{i18n.t('showLess')}</Text>
      </TouchableOpacity>
    );
  }, []);

  const renderTruncatedFooter = React.useCallback(
    handlePress => {
      return (
        <TouchableOpacity onPress={handlePress} style={styles.touchable}>
          <LinearGradient
            colors={[startColor, endColor]}
            style={styles.linear}
          />
          <Text style={styles.truncatedFooterText}>{i18n.t('readMore')}</Text>
        </TouchableOpacity>
      );
    },
    [startColor, endColor],
  );
  const translate = React.useCallback(() => {
    // delayed until the menu is closed
    setTimeout(() => {
      translateRef.current?.show();
    }, 300);
  }, [translateRef]);

  const reply = React.useCallback(() => {
    navigation.push('ReplyComment', {
      comment: props.comment,
      entity: props.store.entity,
      open: true,
    });
  }, [navigation, props.comment, props.store.entity]);

  const viewReply = React.useCallback(() => {
    navigation.push('ReplyComment', {
      comment: props.comment,
      entity: props.store.entity,
    });
  }, [navigation, props.comment, props.store.entity]);

  return (
    <View
      style={[
        styles.container,
        props.comment.focused ? styles.focused : theme.bcolorPrimaryBorder,
      ]}>
      <CommentHeader entity={props.comment} navigation={navigation} />

      {!mature || props.comment.isOwner() ? (
        <>
          <View style={styles.body}>
            {!!props.comment.description && (
              <>
                <ReadMore
                  numberOfLines={6}
                  navigation={navigation}
                  text={entities.decodeHTML(props.comment.description)}
                  renderTruncatedFooter={renderTruncatedFooter}
                  renderRevealedFooter={renderRevealedFooter}
                />
                <Translate ref={translateRef} entity={props.comment} />
              </>
            )}
            {(props.comment.hasMedia() ||
              Boolean(props.comment.attachment_guid)) && (
              <View style={theme.paddingTop3x}>
                <MediaView
                  entity={props.comment}
                  imageStyle={theme.borderRadius}
                  smallEmbed
                  // onPress={this.navToImage}
                />
              </View>
            )}
            {mature && (
              <View style={theme.marginTop3x}>
                <Text style={styles.explicitComment}>
                  {i18n.t('activity.explicitComment')}
                </Text>
              </View>
            )}
          </View>
          <View style={styles.actionsContainer}>
            <ThumbUpAction
              entity={props.comment}
              size={16}
              touchableComponent={TouchableOpacity}
            />
            <ThumbDownAction
              entity={props.comment}
              size={16}
              touchableComponent={TouchableOpacity}
            />
            {canReply && <ReplyAction size={16} onPressReply={reply} />}
            <View style={theme.flexContainer} />
            <CommentBottomMenu
              store={props.store}
              entity={props.store.entity}
              comment={props.comment}
              onTranslate={translate}
            />
          </View>
          {!!props.comment.replies_count && !props.hideReply && (
            <TouchableOpacity onPress={viewReply} style={theme.marginBottom3x}>
              <Text style={styles.viewReply}>
                {i18n.t('viewRepliesComments', {
                  count: props.comment.replies_count,
                })}
              </Text>
            </TouchableOpacity>
          )}
        </>
      ) : (
        // mature
        <View>
          <TouchableOpacity
            onPress={props.comment.toggleMatureVisibility}
            style={styles.touchable}>
            <Text style={styles.explicitCommentBold}>
              {i18n.t('activity.explicitComment')}
            </Text>
            <Text style={styles.confirmText}>{i18n.t('confirm18')}</Text>
          </TouchableOpacity>
          <View style={styles.commentView}>
            <CommentBottomMenu
              store={props.store}
              entity={props.store.entity}
              comment={props.comment}
              onTranslate={translate}
            />
          </View>
        </View>
      )}
    </View>
  );
});

const styles = ThemedStyles.create({
  commentView: ['rowJustifyEnd', 'padding3x'],
  confirmText: ['bold', 'fontL', 'colorLink', 'paddingVertical2x'],
  touchable: ['centered', 'marginTop4x'],
  explicitComment: ['fontL', 'colorTertiaryText'],
  explicitCommentBold: ['bold', 'fontL', 'colorSecondaryText'],
  revealedFooter: ['fontL', 'bold', 'marginTop3x', 'textCenter'],
  truncatedFooterText: [
    'colorPrimaryText',
    'fontL',
    'bold',
    'textCenter',
    'marginTop2x',
  ],
  matureCloseContainer: [
    {
      marginLeft: -29,
      marginTop: 40,
    },
  ],
  viewReply: [
    'colorLink',
    {
      marginLeft: 65,
      fontSize: 15,
      fontWeight: '700',
    },
  ],
  matureIcon: [
    {
      position: 'absolute',
      right: 10,
      top: 8,
    },
  ],
  body: [
    'flexContainer',
    {
      paddingVertical: 0,
      paddingLeft: 63,
      paddingRight: 20,
    },
  ],
  actionsContainer: [
    {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      paddingRight: 15,
      paddingTop: 8,
      paddingLeft: 50,
    },
  ],
  container: [
    {
      padding: 5,
      paddingRight: 0,
      display: 'flex',
      // width: '100%',
      alignItems: 'stretch',
      borderBottomWidth: StyleSheet.hairlineWidth,
    },
  ],
  touchable: [
    {
      position: 'relative',
      height: 100,
      width: '100%',
      top: -52,
    },
  ],
  linear: [
    {
      height: 52,
      width: '100%',
    },
  ],
  focused: [
    {
      borderLeftColor: LIGHT_THEME.Link,
      borderLeftWidth: 4,
    },
  ],
});
