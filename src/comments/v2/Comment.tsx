import React from 'react';
import { observer } from 'mobx-react';
import * as entities from 'entities';
// import ReadMore from 'react-native-read-more-text';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, View } from 'react-native';
import { TouchableOpacity } from '@gorhom/bottom-sheet';

import ReplyAction from '../ReplyAction';
import CommentHeader from './CommentHeader';
import type CommentModel from './CommentModel';
import type CommentsStore from './CommentsStore';
import CommentBottomMenu from './CommentBottomMenu';

import { useNavigation } from '@react-navigation/native';
import ThumbAction from '../../newsfeed/activity/actions/ThumbAction';
import MediaView from '~/common/components/MediaView';
import { LIGHT_THEME } from '../../styles/Colors';
import ReadMore from '~/common/components/ReadMore';
import Translate from '~/common/components/translate/Translate';
import MText from '~/common/components/MText';
import ShareAction from '~/newsfeed/activity/actions/ShareAction';
import sp from '~/services/serviceProvider';

type PropsType = {
  comment: CommentModel;
  store: CommentsStore;
  hideReply?: boolean;
  isHeader?: boolean;
};

/**
 * Comment Component
 */
export default observer(function Comment({
  comment,
  store,
  hideReply,
  isHeader,
}: PropsType) {
  const navigation = useNavigation<any>();
  const translateRef = React.useRef<any>();
  const theme = sp.styles.style;
  const i18n = sp.i18n;

  const {
    mature_visibility,
    ownerObj,
    parent_guid_l2,
    can_reply,
    focused,
    description,
    attachment_guid,
    votedUp,
    votedDown,
    replies_count,
  } = comment;

  const { username, plus: isPlusUser } = ownerObj;

  const mature = comment?.mature && !mature_visibility;

  const canReply = parent_guid_l2 && !hideReply && store.entity.allow_comments;
  const backgroundColor = sp.styles.getColor(
    isHeader ? 'SecondaryBackground' : 'PrimaryBackground',
  );
  const startColor = (sp.styles.theme ? '#242A30' : '#F5F5F5') + '00';
  const endColor = backgroundColor + 'FF';

  const renderCommentHeader: () => JSX.Element = React.useCallback(() => {
    return <CommentHeader entity={comment} navigation={navigation} />;
  }, [comment, navigation, comment.pinned]);

  const renderRevealedFooter = React.useCallback(
    handlePress => {
      return (
        <TouchableOpacity onPress={handlePress}>
          <MText
            style={[
              theme.fontL,
              theme.bold,
              theme.marginTop3x,
              theme.textCenter,
            ]}>
            {i18n.t('showLess')}
          </MText>
        </TouchableOpacity>
      );
    },
    [theme, i18n],
  );

  const renderTruncatedFooter = React.useCallback(
    handlePress => {
      return (
        <TouchableOpacity onPress={handlePress} style={styles.touchable}>
          <LinearGradient
            colors={[startColor, endColor]}
            style={styles.linear}
          />
          <MText
            style={[
              theme.colorPrimaryText,
              theme.fontL,
              theme.bold,
              theme.textCenter,
              theme.marginTop2x,
            ]}>
            {i18n.t('readMore')}
          </MText>
        </TouchableOpacity>
      );
    },
    [
      startColor,
      endColor,
      theme.colorPrimaryText,
      theme.fontL,
      theme.bold,
      theme.textCenter,
      theme.marginTop2x,
      i18n,
    ],
  );
  const translate = React.useCallback(() => {
    // delayed until the menu is closed
    setTimeout(() => {
      translateRef.current?.show();
    }, 300);
  }, [translateRef]);

  const reply = React.useCallback(() => {
    // if we can't reply, open input and fill in owner username
    if (!sp.permissions.canComment(true)) {
      return;
    }

    if (canReply && !can_reply) {
      return store.setShowInput(true, undefined, `@${username} `);
    }

    navigation.push('ReplyComment', {
      comment,
      entity: store.entity,
      open: true,
    });
  }, [canReply, can_reply, comment, navigation, store, username]);

  const viewReply = React.useCallback(() => {
    navigation.push('ReplyComment', {
      comment,
      entity: store.entity,
    });
  }, [navigation, comment, store.entity]);

  return (
    <View
      style={[
        styles.container,
        isPlusUser
          ? theme.bgMutedBackground
          : focused
          ? styles.focused
          : theme.bcolorPrimaryBorder,
      ]}>
      {renderCommentHeader()}
      {!mature || comment.isOwner() ? (
        <>
          <View style={[styles.body, theme.flexContainer]}>
            {!!description && (
              <>
                <ReadMore
                  numberOfLines={6}
                  navigation={sp.navigation}
                  text={entities.decodeHTML(description)}
                  renderTruncatedFooter={renderTruncatedFooter}
                  renderRevealedFooter={renderRevealedFooter}
                />
                <Translate ref={translateRef} entity={comment} />
              </>
            )}
            {(comment.hasMedia() ||
              Boolean(attachment_guid) ||
              Boolean(comment.perma_url)) && (
              <View style={theme.paddingTop3x}>
                <MediaView
                  entity={comment}
                  imageStyle={theme.borderRadius}
                  smallEmbed
                />
              </View>
            )}
            {mature && (
              <View style={theme.marginTop3x}>
                <MText style={[theme.fontL, theme.colorTertiaryText]}>
                  {i18n.t('activity.explicitComment')}
                </MText>
              </View>
            )}
          </View>
          <View style={styles.actionsContainer}>
            <ThumbAction
              entity={comment}
              direction="up"
              voted={votedUp}
              size="tiny"
              touchableComponent={TouchableOpacity as any}
            />
            <ThumbAction
              entity={comment}
              direction="down"
              voted={votedDown}
              size="tiny"
              touchableComponent={TouchableOpacity as any}
            />
            <ShareAction entity={comment} />
            {!hideReply && <ReplyAction size={16} onPressReply={reply} />}
            <View style={theme.flexContainer} />
            {!isHeader && (
              <CommentBottomMenu
                store={store}
                entity={store.entity}
                comment={comment}
                onTranslate={translate}
              />
            )}
          </View>
          {Boolean(replies_count) && !hideReply && (
            <TouchableOpacity onPress={viewReply} style={theme.marginBottom3x}>
              <MText style={[styles.viewReply, theme.colorLink]}>
                {i18n.t('viewRepliesComments.other', {
                  count: replies_count,
                })}
              </MText>
            </TouchableOpacity>
          )}
        </>
      ) : (
        // mature
        <View>
          <TouchableOpacity
            onPress={comment.toggleMatureVisibility}
            style={[theme.centered, theme.marginTop4x]}>
            <MText style={[theme.bold, theme.fontL, theme.colorSecondaryText]}>
              {i18n.t('activity.explicitComment')}
            </MText>
            <MText
              style={[
                theme.bold,
                theme.fontL,
                theme.colorLink,
                theme.paddingVertical2x,
              ]}>
              {i18n.t('confirm18')}
            </MText>
          </TouchableOpacity>
          {!isHeader && (
            <View style={[theme.rowJustifyEnd, theme.padding3x]}>
              <CommentBottomMenu
                store={store}
                entity={store.entity}
                comment={comment}
                onTranslate={translate}
              />
            </View>
          )}
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  matureCloseContainer: {
    marginLeft: -29,
    marginTop: 40,
  },
  viewReply: {
    marginLeft: 65,
    fontSize: 15,
    fontWeight: '700',
  },
  matureIcon: {
    position: 'absolute',
    right: 10,
    top: 8,
  },
  body: {
    paddingVertical: 0,
    paddingLeft: 63,
    paddingRight: 20,
  },
  actionsContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingRight: 15,
    paddingTop: 8,
    paddingLeft: 50,
  },
  container: {
    padding: 5,
    paddingRight: 0,
    display: 'flex',
    // width: '100%',
    alignItems: 'stretch',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  touchable: {
    position: 'relative',
    height: 100,
    width: '100%',
    top: -52,
  },
  linear: {
    height: 52,
    width: '100%',
  },
  focused: {
    borderLeftColor: LIGHT_THEME.Link,
    borderLeftWidth: 4,
  },
});
