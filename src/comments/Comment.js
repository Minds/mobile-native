import React, {
  Component
} from 'react';

import { Icon } from 'react-native-elements'

import {
  MINDS_URI
} from '../config/Config';

import {
  NavigationActions
} from 'react-navigation';

import { observer, inject } from 'mobx-react/native';

import {
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  View
} from 'react-native';

import { thumbActivity } from '../newsfeed/activity/ActionsService';
import CommentEditor from './CommentEditor';
import { CommonStyle } from '../styles/Common';
import OwnerBlock from '../newsfeed/activity/OwnerBlock';
import formatDate from '../common/helpers/date';
import ThumbUpAction from '../newsfeed/activity/actions/ThumbUpAction';
import ThumbDownAction from '../newsfeed/activity/actions/ThumbDownAction';

/**
 * Comment
 */
@inject('user')
@observer
export default class Comment extends Component {

  state = {
    avatarSrc: { uri: 'https://d3ae0shxev0cb7.cloudfront.net/' + 'icon/' + this.props.comment.ownerObj.guid }
  };

  /**
   * Render
   */
  render() {
    const comment = this.props.comment;

    const actions = (
      <View style={[CommonStyle.flexContainer, CommonStyle.paddingLeft2x]}>
        <View style={styles.actionsContainer}>
          <ThumbUpAction entity={comment} me={this.props.user.me} />
          <ThumbDownAction entity={comment} me={this.props.user.me} />
          <Icon name={'list'} onPress={this.showActions}/>
        </View>
      </View>
    )

    return (
      <View style={styles.container}>
        <OwnerBlock entity={comment} navigation={this.props.navigation} rightToolbar={actions}>
          <Text style={styles.timestamp}>{formatDate(comment.time_created)}</Text>
        </OwnerBlock>
        <View style={styles.content}>
          {
            (comment.editing) ?
              <CommentEditor comment={comment}/>:
              <Text style={styles.message}>{comment.description}</Text>
          }
        </View>
      </View>
    );
  }

  /**
   * Show actions
   */
  showActions = () => {
    this.props.onShowActions(this.props.comment);
  }
}

const styles = StyleSheet.create({
  content: {
    display: 'flex',
    flexDirection: 'row',
    padding: 8
  },
  container: {
    borderBottomColor: '#EEE',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  actionsContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignSelf: 'flex-end',
    width: 100,
    padding: 4
  },
  avatar: {
    height: 46,
    width: 46,
    borderRadius: 23,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#EEE',
  },
  message: {
    padding: 8,
    paddingLeft: 16
  },
  timestamp: {
    fontSize: 11,
    color: '#888',
  },
});