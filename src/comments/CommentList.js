import React, { Component } from 'react';

import {
  View,
  Text,
  Image,
  FlatList,
  Keyboard,
  Platform,
  TextInput,
  TouchableOpacity,
  TouchableHighlight,
  ActivityIndicator,
  KeyboardAvoidingView,
} from 'react-native';

import { observable } from 'mobx';
import { observer, inject } from 'mobx-react/native';
import * as Progress from 'react-native-progress';
import Icon from 'react-native-vector-icons/Ionicons';
import IconMC from 'react-native-vector-icons/MaterialCommunityIcons';
import ActionSheet from 'react-native-actionsheet';

import Comment from './Comment';
import isIphoneX from '../common/helpers/isIphoneX';
import CapturePreview from '../capture/CapturePreview';
import CenteredLoading from '../common/components/CenteredLoading';
import UserAutocomplete from '../common/components/UserAutocomplete';
import CaptureMetaPreview from '../capture/CaptureMetaPreview';

import { CommonStyle as CS } from '../styles/Common';
import {ComponentsStyle as CmpStyle} from '../styles/Components';

// types
type Props = {
  header?: any,
  parent?: any,
  entity: any,
  store: any,
  user: any,
  navigation: any,
  onInputFocus?: Function
};

type State = {
  selection: {
    start: number,
    end: number
  }
}

type CommentType = {
  ownerObj: {
    username: string
  },
  editing: any,
};

// iphoneX fixes
const vPadding = isIphoneX() ? 88 : 66;
const paddingBottom = isIphoneX() ? { paddingBottom: 12 } : null;

// helper method
function getEntityGuid(entity) {
  let guid = entity.guid;
  if (entity.entity_guid) {
    guid = entity.entity_guid;
  }
  return guid;
}

/**
 * Comment List Component
 */
@inject('user')
@observer
export default class CommentList extends React.Component<Props, State> {
  listRef: any;
  textInput: any;
  actionAttachmentSheet: ?ActionSheet;
  actionSheet: ?ActionSheet;
  keyboardDidShowListener: any;

  state = {
    guid: null,
    selection: {
      start:0,
      end: 0
    }
  };

  /**
   * On component did mount
   */
  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    this.loadComments();
  }

  /**
   * Component will unmount
   */
  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.props.store.unlisten();
    this.props.store.clearComments();
  }

  /**
   * Reply comment
   */
  replyComment = (comment: CommentType) => {
    this.props.store.setText('@' + comment.ownerObj.username + ' ');
    if (this.textInput) {
      this.textInput.focus();
    }
  }

  /**
   * Post comment
   */
  postComment = () => {
    const store = this.props.store;
    Keyboard.dismiss();
    if (!store.saving && (store.text != '' || store.attachment.hasAttachment)){
      store.post();
      if (!this.props.parent) this.scrollToBottom();
    }
  }

  /**
   * On keyboard show
   */
  _keyboardDidShow = () => {
    this.scrollBottomIfNeeded();
  }

  /**
   * Scrolls to bottoms if the param is received
   */
  scrollBottomIfNeeded() {
    if (!this.props.parent && this.props.entity && this.props.navigation.state.params.scrollToBottom) {
      this.scrollToBottom();
    }
  }

  /**
   * Scroll to bottom
   */
  scrollToBottom = () => {
    setTimeout(() => {
      this.listRef.scrollToEnd();
    }, 250); //delay to allow rendering
  }

  /**
   * Set comment text
   */
  setText = (text: string) => {
    this.props.store.setText(text);
  }

  /**
   * On comment input focus
   */
  onFocus = () => {
    if (!this.props.parent) this.scrollToBottom();

    if (this.props.onInputFocus) {
      this.props.onInputFocus();
    }
  }

  /**
   * Set the state with cursor position
   */
  onSelectionChanges = (event: any) => {
    this.setState({selection: event.nativeEvent.selection});
  }

  /**
   * Load comments
   */
  loadComments = async () => {
    let guid;

    if (this.props.entity) {
      guid = this.props.entity.guid;
      if (this.props.entity.entity_guid) {
        guid = this.props.entity.entity_guid;
      }
    }

    await this.props.store.loadComments(guid);
  }

  /**
   * Select media source
   */
  selectMediaSource = (opt: number) => {
    switch (opt) {
      case 1:
        this.props.store.gallery(this.actionSheet);
        break;
      case 2:
        this.props.store.photo();
        break;
      case 3:
        this.props.store.video();
        break;
    }
  }

  /**
   * Render poster
   */
  renderPoster() {
    const attachment = this.props.store.attachment;

    const avatarImg = this.props.user.me && this.props.user.me.getAvatarSource ? this.props.user.me.getAvatarSource() : {};

    const comments = this.props.store;

    return (
      <View>
        <View style={[CS.rowJustifyCenter, CS.centered, CS.margin, CS.padding, CS.backgroundWhite, CS.borderRadius10x, CS.borderGreyed, CS.borderHair]}>
          <Image source={avatarImg} style={CmpStyle.posterAvatar} />
          <TextInput
            style={[CS.flexContainer, CS.marginLeft]}
            editable={true}
            underlineColorAndroid='transparent'
            placeholder='Type your comment...'
            onChangeText={this.setText}
            onFocus={this.onFocus}
            multiline={true}
            value={comments.text}
            ref={textInput => this.textInput = textInput}
            onSelectionChange={this.onSelectionChanges}
          />
          {attachment.uploading ?
            <Progress.Pie progress={attachment.progress} size={36} />:
            (comments.saving || attachment.checkingVideoLength) ?
              <ActivityIndicator size={'large'} /> :
              <View style={CS.rowJustifyEnd}>
                <TouchableOpacity onPress={() => this.actionAttachmentSheet.show()} style={CS.paddingRight2x}><Icon name="md-attach" size={24} style={CS.paddingRight2x} /></TouchableOpacity>
                <TouchableOpacity onPress={() => this.postComment()} style={CS.paddingRight2x}><Icon name="md-send" size={24} /></TouchableOpacity>
              </View>}
        </View>
          {attachment.hasAttachment && <View style={CmpStyle.preview}>
            <CapturePreview
              uri={attachment.uri}
              type={attachment.type}
            />

            <Icon name="md-close" size={36} style={[CS.positionAbsoluteTopRight, CS.colorWhite, CS.paddingRight2x]} onPress={() => this.props.store.deleteAttachment()} />
          </View>}
          {(this.props.store.embed.meta || this.props.store.embed.metaInProgress) && <CaptureMetaPreview
            meta={this.props.store.embed.meta}
            inProgress={this.props.store.embed.metaInProgress}
            onRemove={this.props.store.embed.clearRichEmbedAction}
          />}
      </View>
    )
  }

  /**
   * Render comments
   */
  renderComment = (row: any) => {
    const comment = row.item;

    // add the editing observable property
    comment.editing = observable.box(false);

    return (
      <Comment
        comment={comment}
        entity={this.props.entity}
        replyComment={this.replyComment}
        store={this.props.store}
        navigation={this.props.navigation}
      />
    );
  }

  /**
   * Get list header
   */
  getHeader() {
    const header = this.props.header || null;
    return (
      <View>
        { header }
        { this.props.store.loadPrevious && !this.props.store.loading ?
            <TouchableHighlight
            onPress={() => { this.loadComments()}}
            underlayColor = 'transparent'
            style = {[CS.rowJustifyCenter, CS.padding2x]}
          >
            <Text style={[CS.fontM, CS.colorPrimary]}><IconMC name="update" size={16} /> LOAD EARLIER </Text>
          </TouchableHighlight> : null
        }
      </View>
    )
  }

  /**
   * Render
   */
  render() {

    const header = this.getHeader();

    let actionsheet = null;

    if (Platform.OS != 'ios') {
      actionsheet = <ActionSheet
        ref={o => this.actionSheet = o}
        options={['Cancel', 'Images', 'Videos']}
        onPress={this.props.store.selectMediaType}
        cancelButtonIndex={0}
      />
    }

    return (
      <View style={[CS.flexContainer, CS.backgroundWhite, paddingBottom]}>
        <KeyboardAvoidingView style={[CS.flexContainer]} behavior={Platform.OS == 'ios' ? 'padding' : null}
          keyboardVerticalOffset={vPadding}>
          <View style={CS.flexContainer}>
            <FlatList
              ref={ref => this.listRef = ref}
              ListHeaderComponent={header}
              data={this.props.store.comments.slice()}
              renderItem={this.renderComment}
              keyExtractor={item => item.guid}
              initialNumToRender={25}
              refreshing={this.props.store.refreshing}
              ListEmptyComponent={this.props.store.loaded && !this.props.store.refreshing ? <View/> : <CenteredLoading/>}
              style={[CS.flexContainer, CS.backgroundWhite]}
            />
            {this.renderPoster()}
            <UserAutocomplete
              text={this.props.store.text}
              selection={this.state.selection}
              onSelect={this.setText}
              noFloat={true}
            />
          </View>
          {actionsheet}
          <ActionSheet
            ref={o => this.actionAttachmentSheet = o}
            options={['Cancel', 'Gallery', 'Photo', 'Video']}
            onPress={this.selectMediaSource}
            cancelButtonIndex={0}
          />
        </KeyboardAvoidingView>
      </View>
    );
  }
}