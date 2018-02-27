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
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';

import { observer, inject } from 'mobx-react/native';

import { extendObservable } from 'mobx';

import Icon from 'react-native-vector-icons/Ionicons';

import CenteredLoading from '../common/components/CenteredLoading';
import Comment from './Comment';

import { getComments, postComment } from './CommentsService';
import session from '../common/services/session.service';
import { CommonStyle } from '../styles/Common';
import { MINDS_CDN_URI } from '../config/Config';
import CapturePreview from '../capture/CapturePreview';
import ActionSheet from 'react-native-actionsheet';
import * as Progress from 'react-native-progress';
import attachmentService from '../common/services/attachment.service';

import commentsStoreProvider from './CommentsStoreProvider';

@inject('user')
@observer
export default class CommentsScreen extends Component {

  /**
   * Each instance of Comments Screen has is own store instance
   */
  comments = null;

  static navigationOptions = ({ navigation }) => ({
    header: (
      <View style={styles.header}>
        <Icon size={28} name="ios-close" onPress={() => navigation.goBack()} style={styles.iconclose}/>
      </View>
    ),
    transitionConfig: {
      isModal: true
    }
  });

  componentWillMount() {
    // get a new instance of Comments Store
    this.comments = commentsStoreProvider.get();
    this.loadComments();
  }

  componentWillUnmount() {
    this.comments.unlisten();
    this.comments.clearComments();
    this.comments = null;
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
          { this.comments.loaded ?
            <FlatList
              ListHeaderComponent={this.props.header}
              data={this.comments.comments.slice()}
              renderItem={this.renderComment}
              keyExtractor={item => item.guid}
              onEndThreshold={0.3}
              onEndReached={this.loadComments}
              initialNumToRender={25}
              refreshing={this.comments.refreshing}
              style={styles.listView}
              inverted={true}
            /> :
            <CenteredLoading/>
          }
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

  renderPoster() {
    const attachment = this.comments.attachment;

    const avatarImg = { uri: MINDS_CDN_URI + 'icon/' + this.props.user.me.guid + '/medium' };

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
    if (response.didCancel) return;

    if (response.error) {
      alert('ImagePicker Error: ' + response.error);
      return;
    }

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
        if (response) this.props.onSelectedMedia(response);
      } catch (e) {
        alert(e);
      }
    } else {
      this.actionSheet.show()
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

    if (!comments.saving && (comments.text != '' || comments.attachment.hasAttachment)){
      comments.post();
    }
  }

  getEntity() {
    return this.props.navigation.state.params.entity;
  }

  loadComments = () => {
    const entity = this.getEntity();
    let guid;

    switch (entity.type) {
      case "comment":
        guid = entity.parent_guid;
        break;

      case "activity":
          guid = entity.guid;
          if (entity.entity_guid) {
            guid = entity.entity_guid;
          }
        break;
      default:
        guid = entity.guid;
    }

    this.comments.loadComments(guid);
  }

  renderComment = (row) => {
    const comment = row.item;

    // add the editing observable property
    extendObservable(comment, {
      editing: false
    });

    return (
      <View>
        <Comment comment={comment} navigation={this.props.navigation}/>
      </View>
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
  }
});