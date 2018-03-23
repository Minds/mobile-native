import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Text,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableHighlight,
  Dimensions,
} from 'react-native';

import ActionSheet from 'react-native-actionsheet';
import * as Progress from 'react-native-progress';

import { observer, inject } from 'mobx-react/native';

import { extendObservable } from 'mobx';

import Icon from 'react-native-vector-icons/Ionicons';

import CenteredLoading from '../common/components/CenteredLoading';
import Comment from '../comments/Comment';

import Activity from '../newsfeed/activity/Activity';

import { getComments, postComment } from '../comments/CommentsService';
import session from '../common/services/session.service';
import { CommonStyle } from '../styles/Common';
import { MINDS_CDN_URI } from '../config/Config';
import CapturePreview from '../capture/CapturePreview';
import ActivityModel from './ActivityModel';

import attachmentService from '../common/services/attachment.service';
import { ComponentsStyle } from '../styles/Components';
import Colors from '../styles/Colors';
import commentsStoreProvider from '../comments/CommentsStoreProvider';
import SingleEntityStoreProvider from '../common/stores/SingleEntityStore';
import { getSingle } from './NewsfeedService';

@inject('user')
@observer
export default class ActivityScreen extends Component {

  /**
   * Each instance of Comments Screen has is own store instance
   */
  comments = null;
  entity = null;

  async componentWillMount() {
    this.comments = commentsStoreProvider.get();
    this.entity = new SingleEntityStoreProvider();
    const params = this.props.navigation.state.params;
    if (params.entity) {
      await this.entity.setEntity(ActivityModel.checkOrCreate(params.entity));
    }
  }
  
  async componentDidMount() {
    const params = this.props.navigation.state.params;
    if (!this.entity.entity || params.hydrate) {
      const resp = await getSingle(params.guid || params.entity.guid);
      await this.entity.setEntity(ActivityModel.checkOrCreate(resp.activity));
    }
    this.loadComments()
      .then(() => {
        if (this.comments.comments.length)
          this.scrollToBottom();
      })
  }

  componentWillUnmount() {
    this.comments.unlisten();
    this.comments.clearComments();
    this.comments = null;
  }

  getHeader() {
    return <View>
             { this.entity.entity && <Activity
              entity={ this.entity.entity }
              newsfeed={ this.props.navigation.state.params.store }
              navigation={ this.props.navigation }
              autoHeight={true}
             /> }
            { this.comments.loadPrevious && !this.comments.loading ?
                <TouchableHighlight
                onPress={() => { this.loadComments()}}
                underlayColor = 'transparent'
                style = {styles.loadCommentsContainer}
              >
                <Text style={styles.loadCommentsText}> LOAD EARLIER </Text>
              </TouchableHighlight> : null
            }
            
          </View>;
  }

  scrollToBottom() {
    if (this.entity.entity && this.props.navigation.state.params.scrollToBottom) {
      setTimeout(() => this.listRef.scrollToEnd(), 200); //delay to allow rendering
    }
  }

  renderPoster() {
    const attachment = this.comments.attachment;

    const avatarImg = this.props.user.me && this.props.user.me.getAvatarSource ? this.props.user.me.getAvatarSource() : {};

    const comments = this.comments;

    return (
      <View>
        <View style={styles.messagePoster}>
          <Image source={avatarImg} style={styles.posterAvatar} />
          <TextInput
            style={[CommonStyle.flexContainer, styles.input]}
            editable={true}
            underlineColorAndroid='transparent'
            placeholder='Type your comment...'
            onChangeText={this.setText}
            multiline={true}
            autogrow={true}
            maxHeight={110}
            value={comments.text}
            ref={textInput => this.textInput = textInput}
          />
          {attachment.uploading ?
            <Progress.Pie progress={attachment.progress} size={36} />:
            <View style={CommonStyle.rowJustifyEnd}>
              <TouchableOpacity onPress={() => this.actionAttachmentSheet.show()} style={styles.sendicon}><Icon name="md-attach" size={24} style={CommonStyle.paddingRight2x} /></TouchableOpacity>
              <TouchableOpacity onPress={() => this.postComment()} style={styles.sendicon}><Icon name="md-send" size={24} /></TouchableOpacity>
            </View>}
        </View>
          {attachment.hasAttachment && <View style={styles.preview}>
            <CapturePreview
              uri={attachment.uri}
              type={attachment.type}
            />

            <Icon name="md-close" size={36} style={styles.deleteAttachment} onPress={() => this.deleteAttachment()} />
          </View>}
      </View>
    )
  }

  _selectMediaSource = (opt) => {
    switch (opt) {
      case 1:
        this.gallery();
        break;
      case 2:
        this.photo();
        break;
      case 3:
        this.video();
        break;
    }
  }

  /**
   * On media type select
   */
  _selectMediaType = async (i) => {
    try {
      let response;
      switch (i) {
        case 1:
          response = await attachmentService.gallery('photo');
          break;
        case 2:
          response = await attachmentService.gallery('video');
          break;
      }

      if (response) this.onAttachedMedia(response);
    } catch (e) {
      alert(e);
    }
  }

  /**
   * Delete attachment
   */
  async deleteAttachment() {
    const attachment = this.comments.attachment;
    // delete
    const result = await attachment.delete();

    if (result === false) alert('caught error deleting the file');
  }

  async video() {
    try {
      const response = await attachmentService.video();
      if (response) this.onAttachedMedia(response);
    } catch (e) {
      alert(e);
    }
  }

  async photo() {
    try {
      const response = await attachmentService.photo();
      if (response) this.onAttachedMedia(response);
    } catch (e) {
      alert(e);
    }
  }

  /**
   * Attach Media
   */
  onAttachedMedia = async (response) => {
    const attachment = this.comments.attachment;

    const result = await attachment.attachMedia(response);

    if (result === false) alert('caught upload error');
  }

  /**
   * Open gallery
   */
  async gallery() {
    if (Platform.OS == 'ios') {
      try {
        const response = await attachmentService.gallery('mixed');

        const attachment = this.comments.attachment;

        const result = await attachment.attachMedia(response);

        if (result === false) alert('caught upload error');

      } catch (e) {
        alert(e);
      }
    } else {
      this.actionSheet.show()
    }
  }

  replyComment = (comment) => {
    this.comments.setText('@' + comment.ownerObj.username + ' ');
    if (this.textInput) {
      this.textInput.focus();
    }
  }

  setText = (text) => {
    this.comments.setText(text);
  }

  /**
   * Post comment
   */
  postComment = () => {
    const comments = this.comments;
    Keyboard.dismiss();
    if (!comments.saving && (comments.text != '' || comments.attachment.hasAttachment)){
      comments.post();
    }
  }

  loadComments = async () => {
    let guid;
    const entity = this.entity.entity;

    if (this.entity.entity) {
      guid = entity.guid;
      if (entity.entity_guid) {
        guid = entity.entity_guid;
      }
    }

    await this.comments.loadComments(guid);
  }

  renderComment = (row) => {
    const comment = row.item;

    // add the editing observable property
    extendObservable(comment, {
      editing: false
    });

    return (
      <View>
        <Comment comment={comment} replyComment={this.replyComment} store={this.comments} navigation={this.props.navigation}/>
      </View>
    );
  }


  /**
   * Render
   */
  render() {
    let actionsheet = null;

    if (Platform.OS != 'ios') {
      actionsheet = <ActionSheet
        ref={o => this.actionSheet = o}
        options={['Cancel', 'Images', 'Videos']}
        onPress={this._selectMediaType}
        cancelButtonIndex={0}
      />
    }

    return (
      <KeyboardAvoidingView style={styles.containerContainer} behavior={ Platform.OS == 'ios' ? 'padding' : null } keyboardVerticalOffset={64}>
        <View style={{flex:14}}>
          <FlatList
            ref={ ref => this.listRef = ref }
            ListHeaderComponent={this.getHeader()}
            data={this.comments.comments.slice()}
            renderItem={this.renderComment}
            keyExtractor={item => item.guid}
            initialNumToRender={25}
            refreshing={this.comments.refreshing}
            ListEmptyComponent={this.comments.loaded && !this.comments.refreshing ? <View/> : <CenteredLoading />}
            style={styles.listView}
          />
        </View>
        { this.renderPoster() }
        { actionsheet }
        <ActionSheet
          ref={o => this.actionAttachmentSheet = o}
          options={['Cancel', 'Gallery', 'Photo', 'Video']}
          onPress={this._selectMediaSource}
          cancelButtonIndex={0}
        />
      </KeyboardAvoidingView>
    );
  }

}

let paddingBottom = 0;

const d = Dimensions.get('window');
if (d.height == 812 || d.width == 812) {
  paddingBottom = 16;
}

const styles = StyleSheet.create({
  containerContainer: {
    flex: 1,
    paddingBottom: paddingBottom,
  },
	listView: {
    backgroundColor: '#FFF',
    flex: 1,
  },
  author: {
    flex:1,
    alignItems: 'center',
    padding: 8,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    borderBottomColor: '#EEE',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  scrollView: {
    flex:10
  },
  posterWrapper: {
    height:50,
  },
  header: {
    backgroundColor: '#F8F8F8',
    paddingTop: Platform.OS == 'ios' ? 14 : 8,
  },
  messagePoster: {
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'baseline',
    backgroundColor: '#FFF',
    padding: 5
  },
  iconclose: {
    alignSelf: 'flex-end',
    padding: Platform.OS == 'ios' ? 10 : 8
  },
  posterAvatar: {
    height: 36,
    width: 36,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#EEE',
  },
  input: {
    marginLeft: 8,
  },
  avatar: {
    height: 24,
    width: 24,
    borderRadius: 23,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#EEE',
  },
  listView: {
    backgroundColor: '#FFF',
    flex: 1,
  },
  preview: {
    height: 200,
    flexDirection: 'row',
    alignItems: 'stretch',
    position: 'relative',
  },
  deleteAttachment: {
    position: 'absolute',
    right: 8,
    top: 0,
    color: '#FFF'
  },
  loadCommentsContainer: {
    backgroundColor: '#EEE',
    borderRadius: 3,
    justifyContent: 'center',
    flexDirection: 'row',
    padding: 8,
    margin: 8,
  },
  loadCommentsText: {
    color: '#888',
    fontSize: 10,
  },
});
