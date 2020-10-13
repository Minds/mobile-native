//@ts-nocheck
import React, { Component } from 'react';

import { observer } from 'mobx-react';
import * as entities from 'entities';

import {
  Text,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Clipboard,
  View,
  Dimensions,
} from 'react-native';

import Icon from 'react-native-vector-icons/SimpleLineIcons';

import CommentEditor from './CommentEditor';
import formatDate from '../common/helpers/date';
import ThumbUpAction from '../newsfeed/activity/actions/ThumbUpAction';
import ThumbDownAction from '../newsfeed/activity/actions/ThumbDownAction';
import ReplyAction from './ReplyAction';
import MediaView from '../common/components/MediaView';
import Tags from '../common/components/Tags';
import i18n from '../common/services/i18n.service';

import CommentList from './CommentList';
import DoubleTap from '../common/components/DoubleTap';
import colors from '../styles/Colors';
import FastImage from 'react-native-fast-image';
import CommentActionSheet from './CommentActionSheet';
import ThemedStyles from '../styles/ThemedStyles';
import { showNotification } from '../../AppMessages';
import ChannelBadge from '../common/components/ChannelBadge';
import CommentModel from './CommentModel';
import type BlogModel from '../blogs/BlogModel';
import type GroupModel from '../groups/GroupModel';
import type ActivityModel from '../newsfeed/ActivityModel';
import type CommentsStore from './CommentsStore';

const DoubleTapTouch = DoubleTap(TouchableOpacity);

type PropsType = {
  comment: CommentModel;
  entity?: ActivityModel | BlogModel | GroupModel; //parent entity
  store: CommentsStore;
  onTextInputfocus: (CommentModel, offset: number) => void;
  onCommentFocus: (CommentModel, offset: number) => void;
  commentFocusCall: (CommentModel, index: number) => void;
  navigation: any;
  route: any;
  index: number;
};

/**
 * Comment Component
 */
@observer
class Comment extends Component<PropsType> {
  state = {
    editing: false,
  };

  constructor(props) {
    super(props);
    this.actionSheetRef = React.createRef();
  }

  onInputFocus = (comment, offset) => {
    this.props.onTextInputfocus &&
      this.props.onTextInputfocus(this.props.comment, offset);
  };

  onCommentFocus = (comment, offset) => {
    this.props.onCommentFocus &&
      this.props.onCommentFocus(this.props.comment, offset);
  };

  componentDidMount() {
    if (this.props.commentFocusCall) {
      this.props.commentFocusCall(this.props.comment, this.props.index);
    }
  }

  /**
   * Render
   */
  render() {
    const theme = ThemedStyles.style;
    const comment = this.props.comment;
    const avatarSrc = comment.ownerObj.getAvatarSource();
    const canReply = comment.can_reply && comment.parent_guid_l2 == 0;

    const actions = (
      <View style={[theme.flexContainer]}>
        <View style={styles.actionsContainer}>
          <Text style={[theme.fontM, theme.colorSecondaryText]}>
            {formatDate(comment.time_created, 'friendly')}
          </Text>
          <View style={[theme.flexContainer, theme.rowJustifyStart]}>
            <ThumbUpAction entity={comment} size={16} />
            <ThumbDownAction entity={comment} size={16} />
            {canReply && (
              <ReplyAction
                entity={comment}
                size={16}
                toggleExpand={this.toggleExpand}
              />
            )}
          </View>
        </View>
      </View>
    );

    return (
      <View style={[styles.container, comment.focused ? styles.focused : null]}>
        <TouchableOpacity
          onPress={this.navToChannel}
          style={styles.avatarContainer}>
          <FastImage source={avatarSrc} style={styles.avatar} />
        </TouchableOpacity>

        <View style={styles.contentContainer}>
          <DoubleTapTouch
            style={styles.content}
            onDoubleTap={this.showActions}
            hitSlop={null} // important, reducing the touch extra space for the touchable makes the text links easier to tap.
            selectable={false}
            onLongPress={this.showActions}>
            <View style={[styles.textContainer, theme.backgroundTertiary]}>
              {this.state.editing ? (
                <CommentEditor
                  setEditing={this.setEditing}
                  comment={comment}
                  store={this.props.store}
                />
              ) : (
                <Text style={styles.message} selectable={false}>
                  <Text style={styles.username} onPress={this.navToChannel}>
                    @{comment.ownerObj.username}
                  </Text>
                  <ChannelBadge
                    channel={comment.ownerObj}
                    addSpace
                    iconSize={10}
                  />{' '}
                  {comment.description &&
                    (!comment.mature || comment.mature_visibility) && (
                      <Tags navigation={this.props.navigation}>
                        {entities.decodeHTML(comment.description)}
                      </Tags>
                    )}
                </Text>
              )}
              {comment.mature && !comment.mature_visibility && (
                <Icon
                  name="lock"
                  size={22}
                  style={[theme.colorPrimaryText, styles.matureIcon]}
                  onPress={this.toggleMature}
                />
              )}
            </View>
          </DoubleTapTouch>
          {comment.hasMedia() && (
            <View style={styles.media}>
              <MediaView
                entity={comment}
                style={styles.media}
                onPress={this.navToImage}
                width={Dimensions.get('window').width - 60}
              />
            </View>
          )}
          {actions}
          {comment.expanded && (
            <CommentList
              entity={this.props.entity}
              parent={comment}
              store={comment.comments}
              onInputFocus={this.onInputFocus}
              onCommentFocus={this.onCommentFocus}
              navigation={this.props.navigation}
              route={this.props.route}
            />
          )}
        </View>
        <CommentActionSheet
          entity={this.props.entity}
          comment={this.props.comment}
          onSelection={this.onSelection}
          ref={this.actionSheetRef}
        />
      </View>
    );
  }

  showActions = () => {
    this.actionSheetRef.current && this.actionSheetRef.current.showActions();
  };

  /**
   * toggle mature
   */
  toggleMature = () => {
    this.props.comment.toggleMatureVisibility();
  };

  /**
   * Toggle expand
   */
  toggleExpand = () => {
    this.props.comment.toggleExpanded();
  };

  /**
   * Set editing
   */
  setEditing = (value) => {
    this.setState({ editing: value });
  };

  /**
   * Navigate To channel
   */
  navToChannel = () => {
    // only active if receive the navigation property
    if (this.props.navigation) {
      this.props.navigation.push('Channel', {
        guid: this.props.comment.ownerObj.guid,
      });
    }
  };

  /**
   * Navigate to full screen image view
   */
  navToImage = () => {
    if (this.props.navigation) {
      const source = this.props.entity.getThumbSource('xlarge');
      this.props.navigation.push('ViewImage', {
        source,
        entity: this.props.entity,
      });
    }
  };

  /**
   * Handle action on comment
   */
  onSelection = (action) => {
    switch (action) {
      case i18n.t('edit'):
        this.setState({ editing: true });
        break;
      case i18n.t('delete'):
        Alert.alert(
          i18n.t('confirm'),
          i18n.t('confirmNoUndo'),
          [
            { text: i18n.t('no'), style: 'cancel' },
            {
              text: i18n.t('yesImSure'),
              onPress: () => {
                this.props.store
                  .delete(this.props.comment.guid)
                  .then(() => {
                    showNotification(
                      i18n.t('comments.successRemoving'),
                      'success',
                    );
                  })
                  .catch(() => {
                    showNotification(i18n.t('comments.errorRemoving'));
                  });
              },
            },
          ],
          { cancelable: false },
        );

        break;
      case i18n.t('setExplicit'):
        this.props.store.commentToggleExplicit(this.props.comment.guid);
        break;
      case i18n.t('removeExplicit'):
        this.props.store.commentToggleExplicit(this.props.comment.guid);
        break;
      case i18n.t('report'):
        this.props.navigation.push('Report', { entity: this.props.comment });
        break;
      case i18n.t('reply'):
        this.toggleExpand();
        break;
      case i18n.t('copy'):
        Clipboard.setString(
          entities.decodeHTML(this.props.comment.description),
        );
        showNotification(i18n.t('copied'), 'info');
        break;
      default:
        break;
    }
  };
}

export default Comment;

const styles = StyleSheet.create({
  matureCloseContainer: {
    marginLeft: -29,
    marginTop: 40,
  },
  matureIcon: {
    position: 'absolute',
    right: 10,
    top: 8,
  },
  container: {
    padding: 8,
    paddingRight: 0,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  focused: {
    borderLeftColor: colors.primary,
    borderLeftWidth: 4,
  },
  media: {
    margin: 5,
    paddingTop: 10,
  },
  contentContainer: {
    flex: 1,
  },
  mature: {
    color: 'transparent',
    textShadowColor: 'rgba(107, 107, 107, 0.5)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 20,
  },
  textContainer: {
    borderRadius: 3,
    marginHorizontal: 5,
    flex: 1,
    padding: 5,
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  actionsContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    padding: 8,
  },
  avatarContainer: {
    height: 34,
  },
  avatar: {
    height: 32,
    width: 32,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#EEE',
  },
  message: {
    paddingHorizontal: 6,
    paddingVertical: 6,
    fontSize: 16,
  },
  username: {
    // fontWeight: '800',
    fontFamily: 'Roboto-Black',
    paddingRight: 8,
  },
});
