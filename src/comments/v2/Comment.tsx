import React from 'react';
import { observer } from 'mobx-react';
import * as entities from 'entities';
import ReadMore from 'react-native-read-more-text';
import { LinearGradient } from 'expo-linear-gradient';
import { View, Text, StyleSheet } from 'react-native';
import { TouchableOpacity } from '@gorhom/bottom-sheet';

import ReplyAction from '../ReplyAction';
import CommentHeader from './CommentHeader';
import type CommentModel from './CommentModel';
import Tags from '../../common/components/Tags';
import type CommentsStore from './CommentsStore';
import CommentBottomMenu from './CommentBottomMenu';
import ThemedStyles from '../../styles/ThemedStyles';
import i18n from '../../common/services/i18n.service';
import { useNavigation } from '@react-navigation/native';
import ThumbUpAction from '../../newsfeed/activity/actions/ThumbUpAction';
import ThumbDownAction from '../../newsfeed/activity/actions/ThumbDownAction';
import MediaView from '../../common/components/MediaView';
import { LIGHT_THEME } from '../../styles/Colors';

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
  const theme = ThemedStyles.style;

  const mature =
    props.comment.mature &&
    !props.comment.mature_visibility &&
    !props.comment.isOwner();

  const canReply =
    props.comment.can_reply &&
    props.comment.parent_guid_l2 === '0' &&
    !props.hideReply;

  const backgroundColor = ThemedStyles.getColor(
    props.isHeader ? 'secondary_background' : 'primary_background',
  );
  const startColor = (ThemedStyles.theme ? '#242A30' : '#F5F5F5') + '00';
  const endColor = backgroundColor + 'FF';

  const renderRevealedFooter = React.useCallback(
    (handlePress) => {
      return (
        <TouchableOpacity onPress={handlePress}>
          <Text
            style={[
              theme.fontL,
              theme.bold,
              theme.marginTop3x,
              theme.textCenter,
            ]}>
            {i18n.t('showLess')}
          </Text>
        </TouchableOpacity>
      );
    },
    [theme],
  );

  const renderTruncatedFooter = React.useCallback(
    (handlePress) => {
      return (
        <TouchableOpacity onPress={handlePress} style={styles.touchable}>
          <LinearGradient
            colors={[startColor, endColor]}
            style={styles.linear}
          />
          <Text
            style={[
              theme.colorPrimaryText,
              theme.fontL,
              theme.bold,
              theme.textCenter,
              theme.marginTop2x,
            ]}>
            {i18n.t('readMore')}
          </Text>
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
    ],
  );

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
        theme.borderPrimary,
        props.comment.focused ? styles.focused : null,
      ]}>
      <CommentHeader entity={props.comment} navigation={navigation} />

      {!mature ? (
        <>
          <View style={[styles.body, theme.flexContainer]}>
            {!!props.comment.description && (
              <ReadMore
                numberOfLines={4}
                renderTruncatedFooter={renderTruncatedFooter}
                renderRevealedFooter={renderRevealedFooter}>
                <Tags
                  navigation={navigation}
                  style={theme.fontL}
                  selectable={true}>
                  {entities.decodeHTML(props.comment.description)}
                </Tags>
              </ReadMore>
            )}
            {props.comment.hasMedia() && (
              <View style={theme.paddingTop3x}>
                <MediaView
                  entity={props.comment}
                  style={theme.borderRadius}
                  smallEmbed
                  // onPress={this.navToImage}
                />
              </View>
            )}
          </View>
          <View style={styles.actionsContainer}>
            <ThumbUpAction
              containerStyle={theme.rowJustifyStart}
              entity={props.comment}
              size={16}
            />
            <ThumbDownAction
              containerStyle={theme.rowJustifyStart}
              entity={props.comment}
              size={16}
            />
            {canReply && <ReplyAction size={16} onPressReply={reply} />}
            <View style={theme.flexContainer} />
            <CommentBottomMenu
              store={props.store}
              entity={props.store.entity}
              comment={props.comment}
            />
          </View>
          {!!props.comment.replies_count && !props.hideReply && (
            <TouchableOpacity onPress={viewReply} style={theme.marginBottom3x}>
              <Text style={[styles.viewReply, theme.colorLink]}>
                {i18n.t('viewRepliesComments', {
                  count: props.comment.replies_count,
                })}
              </Text>
            </TouchableOpacity>
          )}
        </>
      ) : (
        //mature
        <View>
          <TouchableOpacity
            onPress={() => props.comment.toggleMatureVisibility()}
            style={[theme.centered, theme.marginTop4x]}>
            <Text style={[theme.bold, theme.fontL, theme.colorSecondaryText]}>
              {i18n.t('activity.explicitComment')}
            </Text>
            <Text
              style={[
                theme.bold,
                theme.fontL,
                theme.colorLink,
                theme.paddingVertical2x,
              ]}>
              {i18n.t('confirm18')}
            </Text>
          </TouchableOpacity>
          <View style={[theme.rowJustifyEnd, theme.padding3x]}>
            <CommentBottomMenu
              store={props.store}
              entity={props.store.entity}
              comment={props.comment}
            />
          </View>
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
    paddingLeft: 65,
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
    borderLeftColor: LIGHT_THEME.link,
    borderLeftWidth: 4,
  },
});
