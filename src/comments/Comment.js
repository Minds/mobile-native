import React, {
  Component
} from 'react';

import { Icon } from 'react-native-elements'

import {
  MINDS_URI
} from '../config/Config';

import { observer, inject } from 'mobx-react/native';
import entities from 'entities';

import {
  Text,
  Alert,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Clipboard,
  Image,
  View,
  Dimensions
} from 'react-native';

import ActionSheet from 'react-native-actionsheet';
import { thumbActivity } from '../newsfeed/activity/ActionsService';
import CommentEditor from './CommentEditor';
import { CommonStyle } from '../styles/Common';
import OwnerBlock from '../newsfeed/activity/OwnerBlock';
import formatDate from '../common/helpers/date';
import ThumbUpAction from '../newsfeed/activity/actions/ThumbUpAction';
import ThumbDownAction from '../newsfeed/activity/actions/ThumbDownAction';
import MediaView from '../common/components/MediaView';
import Tags from '../common/components/Tags';
import {
  MINDS_CDN_URI
} from '../config/Config';

/**
 * Comment
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

  /**
   * Render
   */
  render() {
    const comment = this.props.comment;
    const avatarSrc = comment.ownerObj.getAvatarSource();
    const actions = (
      <View style={[CommonStyle.flexContainer ]}>
        <View style={styles.actionsContainer}>
          <Text style={styles.timestamp}>{formatDate(comment.time_created)}</Text>
          <View style={{ flexGrow: 2 }}></View>
          <View style={[CommonStyle.flexContainer, CommonStyle.rowJustifyCenter ]}>
            <ThumbUpAction entity={comment} me={this.props.user.me} size={16}/>
            <ThumbDownAction entity={comment} me={this.props.user.me} size={16} />
          </View>
        </View>
      </View>
    )

    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this._navToChannel} style={styles.avatarContainer}>
          <Image source={avatarSrc} style={styles.avatar}/>
        </TouchableOpacity>

        <View style={styles.contentContainer}>
          <View style={styles.content}>
            {
              this.state.editing ?
                <CommentEditor setEditing={this.setEditing} comment={comment} store={this.props.store}/> :

                <Text style={styles.message} selectable={true} onPress={this.showActions}>
                  <Text style={styles.username}>@{comment.ownerObj.username} </Text>
                  { comment.description &&
                    <Tags
                      style={comment.mature? styles.mature : {}}
                      navigation={this.props.navigation}
                      >
                      {entities.decodeHTML(comment.description)}
                    </Tags>
                  }
                </Text>
            }
          </View>

          <MediaView
            entity={comment}
            style={styles.media}
            navigation={this.props.navigation}
            width={Dimensions.get('window').width - 60}
            />

          { actions }
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

  setEditing = (value) => {
    this.setState({editing: value});
  }
  /**
   * Show actions
   */
  showActions = () => {
    this.ActionSheet.show();
  }

  getOptions = () => {
    let actions = ['Cancel'];
    if (this.props.user.me.guid == this.props.comment.owner_guid) {
      actions.push('Edit');
      actions.push( 'Delete' );

      if (!this.props.comment.mature) {
        actions.push( 'Set explicit' );
      } else {
        actions.push( 'Remove explicit' );
      }
    } else {
      if (this.props.user.isAdmin()) {
        actions.push( 'Delete' );

        if (!this.props.comment.mature) {
          actions.push( 'Set explicit' );
        } else {
          actions.push( 'Remove explicit' );
        }
      } else if (this.props.user.me.guid == this.props.entity.owner_guid) {
        actions.push( 'Delete' );
      }

      actions.push( 'Report' );
      actions.push( 'Reply' );
      actions.push( 'Copy' );
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
      case 'Edit':
        this.setState({editing: true});
        break;
      case 'Delete':
        this.props.store.delete(this.props.comment.guid).then( (result) => {
          Alert.alert(
            'Success',
            'Comment removed succesfully',
            [
              {text: 'OK', onPress: () => {}},
            ],
            { cancelable: false }
          )
        })
        .catch(err => {
          Alert.alert(
            'Error',
            'Error removing comment',
            [
              {text: 'OK', onPress: () => {}},
            ],
            { cancelable: false }
          )
        });
        break;
      case 'Set explicit':
        this.props.store.commentToggleExplicit(this.props.comment.guid).then( (result) => {
        });
        break;
      case 'Remove explicit':
        this.props.store.commentToggleExplicit(this.props.comment.guid).then( (result) => {
        });
        break;
      case 'Report':
        this.props.navigation.navigate('Report', { entity: this.props.comment });
        break;
      case 'Reply':
        this.props.replyComment(this.props.comment);
        break;
      case 'Copy':
        Clipboard.setString(entities.decodeHTML(this.props.comment.description));
        break;
      default:
        break;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    borderBottomColor: '#EEE',
    borderBottomWidth: StyleSheet.hairlineWidth,
    padding: 8,
    paddingRight: 0,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch',
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
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'stretch',
    paddingRight: 8,
  },
  actionsContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignSelf: 'stretch',
    padding: 8
  },
  avatarContainer: {

  },
  avatar: {
    height: 32,
    width: 32,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#EEE',
  },
  message: {
    paddingLeft: 8,
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
