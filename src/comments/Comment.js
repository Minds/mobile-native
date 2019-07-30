import React, {
  Component
} from 'react';

import { Icon } from 'react-native-elements'


import { observer, inject } from 'mobx-react/native';
import entities from 'entities';

import {
  Text,
  Alert,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Clipboard,
  View,
  Dimensions
} from 'react-native';

import ActionSheet from 'react-native-actionsheet';
import CommentEditor from './CommentEditor';
import { CommonStyle } from '../styles/Common';
import formatDate from '../common/helpers/date';
import ThumbUpAction from '../newsfeed/activity/actions/ThumbUpAction';
import ThumbDownAction from '../newsfeed/activity/actions/ThumbDownAction';
import ReplyAction from './ReplyAction';
import MediaView from '../common/components/MediaView';
import Tags from '../common/components/Tags';
import i18n from '../common/services/i18n.service';

import {
  MINDS_CDN_URI
} from '../config/Config';

import CommentList from './CommentList';
import DoubleTap from '../common/components/DoubleTap';
import ExplicitOverlay from '../common/components/explicit/ExplicitOverlay';
import colors from '../styles/Colors';
import FastImage from 'react-native-fast-image';

const DoubleTapText = DoubleTap(Text);

/**
 * Comment Component
 */
@inject('user')
@observer
export default class Comment extends Component {

  constructor(props) {
    super(props)
    this.state = {
      avatarSrc: { uri: 'https://d3ae0shxev0cb7.cloudfront.net/' + 'icon/' + this.props.comment.ownerObj.guid },
      options: this.getOptions(),
      editing: false,
    }
  }

  onInputFocus = (comment, offset) => {
    this.props.onTextInputfocus && this.props.onTextInputfocus(this.props.comment, offset);
  }

  onCommentFocus = (comment, offset) => {
    this.props.onCommentFocus && this.props.onCommentFocus(this.props.comment, offset);
  }

  /**
   * Render
   */
  render() {
    const comment = this.props.comment;
    const avatarSrc = comment.ownerObj.getAvatarSource();
    const canReply = comment.can_reply && comment.parent_guid_l2 == 0;

    const actions = (
      <View style={[CommonStyle.flexContainer ]}>
        <View style={styles.actionsContainer}>
          <Text style={styles.timestamp}>{formatDate(comment.time_created, 'friendly')}</Text>
          <View style={[CommonStyle.flexContainer, CommonStyle.rowJustifyStart]}>
            <ThumbUpAction entity={comment} me={this.props.user.me} size={16}/>
            <ThumbDownAction entity={comment} me={this.props.user.me} size={16} />
            {canReply && <ReplyAction entity={comment} size={16} toggleExpand={this.toggleExpand}/>}
          </View>
        </View>
      </View>
    )

    return (
      <View style={[styles.container, comment.focused ? styles.focused : null]}>
        <TouchableOpacity onPress={this._navToChannel} style={styles.avatarContainer}>
          <FastImage source={avatarSrc} style={styles.avatar}/>
        </TouchableOpacity>

        <View style={styles.contentContainer}>
          <View style={styles.content}>
            <View style={styles.textContainer}>
              {
                this.state.editing ?
                  <CommentEditor setEditing={this.setEditing} comment={comment} store={this.props.store}/>
                :
                  <DoubleTapText style={styles.message} selectable={true} onDoubleTap={this.showActions} selectable={false} onLongPress={this.showActions}>
                    <Text style={styles.username}>@{comment.ownerObj.username} </Text>
                    { comment.description &&
                      <Tags
                        navigation={this.props.navigation}
                        >
                        {entities.decodeHTML(comment.description)}
                      </Tags>
                    }
                  </DoubleTapText>
              }
            </View>
          </View>
          { actions }
          { comment.expanded &&
            <CommentList
              entity={this.props.entity}
              parent={comment}
              store={comment.comments}
              onInputFocus={this.onInputFocus}
              onCommentFocus={this.onCommentFocus}
              navigation={this.props.navigation}
            />
          }

          { comment.mature ? <ExplicitOverlay
            entity={comment}
            iconSize={35}
            fontStyle={{fontSize:12}}
            iconPosition="left"
            closeContainerStyle={styles.matureCloseContainer}
            containerStyle={[styles.matureContainer, CommonStyle.marginLeft, CommonStyle.marginRight, CommonStyle.borderRadius5x]}
          /> : null }

          <MediaView
            entity={comment}
            style={styles.media}
            navigation={this.props.navigation}
            width={Dimensions.get('window').width - 60}
          />

        </View>
        <ActionSheet
          ref={o => this.ActionSheet = o}
          options={this.getOptions()}
          onPress={this.handleSelection}
          cancelButtonIndex={0}
        />
      </View>
    );
  }

  /**
   * Toggle expand
   */
  toggleExpand = () => {
    this.props.comment.toggleExpanded();
  }

  /**
   * Set editing
   */
  setEditing = (value) => {
    this.setState({editing: value});
  }

  /**
   * Show actions
   */
  showActions = () => {
    this.ActionSheet.show();
  }

  /**
   * Get actionsheet options
   */
  getOptions = () => {
    let actions = [i18n.t('cancel')];
    if (this.props.user.me.guid == this.props.comment.owner_guid) {
      actions.push( i18n.t('edit') );
      actions.push( i18n.t('delete') );

      if (!this.props.comment.mature) {
        actions.push( i18n.t('setExplicit') );
      } else {
        actions.push( i18n.t('removeExplicit') );
      }
    } else {
      if (this.props.user.isAdmin()) {
        actions.push( i18n.t('delete') );

        if (!this.props.comment.mature) {
          actions.push( i18n.t('setExplicit') );
        } else {
          actions.push( i18n.t('removeExplicit') )
        }
      } else if (this.props.user.me.guid == this.props.entity.owner_guid) {
        actions.push( i18n.t('delete') );
      }

      actions.push( i18n.t('report') );
      actions.push( i18n.t('copy') );
    }
    if (this.props.comment.parent_guid_l2 == 0) {
      actions.push( i18n.t('reply') );
    }

    return actions;
  }

  /**
   * Navigate To channel
   */
  _navToChannel = () => {
    // only active if receive the navigation property
    if (this.props.navigation) {
      this.props.navigation.push('Channel', { guid:this.props.comment.ownerObj.guid});
    }
  }

  /**
   * Handle action on comment
   */
  handleSelection = (i) => {
    const action = this.state.options[i];

    switch (action) {
      case i18n.t('edit'):
        this.setState({editing: true});
        break;
      case i18n.t('delete'):
        Alert.alert(
          i18n.t('confirm'),
          i18n.t('comments.deleteConfirm'),
          [
            { text: i18n.t('no'), style: 'cancel' },
            {
              text: i18n.t('yesImSure'),
              onPress: () => {
                this.props.store.delete(this.props.comment.guid).then(result => {
                  Alert.alert(
                    i18n.t('success'),
                    i18n.t('comments.successRemoving')
                  );
                })
                .catch(err => {
                  Alert.alert(
                    i18n.t('error'),
                    i18n.t('comments.errorRemoving')
                  );
                });
              }
            },
          ],
          { cancelable: false }
        );

        break;
      case i18n.t('setExplicit') :
        this.props.store.commentToggleExplicit(this.props.comment.guid).then( (result) => {
        });
        break;
      case i18n.t('removeExplicit'):
        this.props.store.commentToggleExplicit(this.props.comment.guid).then( (result) => {
        });
        break;
      case i18n.t('report'):
        this.props.navigation.push('Report', { entity: this.props.comment });
        break;
      case i18n.t('reply'):
        this.toggleExpand();
        break;
      case i18n.t('copy'):
        Clipboard.setString(entities.decodeHTML(this.props.comment.description));
        break;
      default:
        break;
    }
  }
}

const styles = StyleSheet.create({
  matureCloseContainer: {
    marginLeft: -29, marginTop:40
  },
  matureContainer: {
    backgroundColor:'#9A9A9A'
  },
  container: {
    borderBottomColor: '#EEE',
    borderBottomWidth: StyleSheet.hairlineWidth,
    padding: 8,
    paddingRight: 0,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  focused: {
    borderLeftColor: colors.primary,
    borderLeftWidth: 4
  },
  media: {
    flex: 1,
    margin: 8,
    borderRadius: 3,
    //marginLeft: 16,
  },
  contentContainer: {
    flex: 1,
  },
  mature: {
    color:'transparent',
    textShadowColor: 'rgba(107, 107, 107, 0.5)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 20
  },
  textContainer: {
    backgroundColor: '#E8E8E8',
    borderRadius: 20,
    marginHorizontal: 5,
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
    padding: 8
  },
  avatarContainer: {
    height:34
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
    fontSize: 14,
  },
  username: {
    fontWeight: '800',
    paddingRight: 8,
    color: '#444',
  },
  timestamp: {
    fontSize: 10,
    color: '#888',
  },
});