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
import ErrorLoading from '../common/components/ErrorLoading';
import CaptureMetaPreview from '../capture/CaptureMetaPreview';

import { CommonStyle as CS } from '../styles/Common';
import { ComponentsStyle as CmpStyle } from '../styles/Components';
import i18n from '../common/services/i18n.service';

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
  focused: boolean,
  hideInput: boolean,
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

const isIOS = Platform.OS === 'ios';
const vPadding = isIphoneX ? 88 : 66;
const paddingBottom = isIphoneX ? { paddingBottom: 12 } : null;
const inputStyle = isIOS ? { marginTop:3 } : { marginTop:2 };

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
  focusedChild: number = -1;
  focusedOffset: number = 0;
  height: number = 0;

  state = {
    focused: false,
    hideInput: false,
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
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    this.props.store.setEntity(this.props.entity);
    this.loadComments();
  }

  /**
   * Component will unmount
   */
  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
    this.props.store.unlisten();
    this.props.store.clearComments();
  }

  /**
   * Post comment
   */
  postComment = async() => {
    const store = this.props.store;
    if (store.text.trim() == '' && !store.attachment.hasAttachment) return;
    Keyboard.dismiss();
    if (!store.saving){
      await store.post();
      if (!this.props.parent) this.scrollToBottom();
    }
  }

  /**
   * On keyboard show
   */
  _keyboardDidShow = (e) => {
    if (!this.props.parent) {
      if (isIOS) {
        if (this.focusedChild !== -1) {
          setTimeout(() => {
            this.listRef.scrollToIndex({
              index: this.focusedChild,
              viewOffset: this.focusedOffset ? -(this.focusedOffset - (this.height - e.endCoordinates.height - 70)) : -e.endCoordinates.height + 70,
              viewPosition: this.focusedOffset ? 0 : 1
            });
          }, 200);
        }
      } else {
        if (!this.state.focused) this.setState({hideInput: true});
      }
    }
    // this.scrollBottomIfNeeded();
  }

  /**
   * On keyboard  hide
   */
  _keyboardDidHide = (e) => {
    if (!this.props.parent && !isIOS) {
      this.setState({hideInput: false});
    }
  }

  onLayout = (e) => {
    if (!this.props.parent) {
      this.height = e.nativeEvent.layout.height;
    }
  }

  /**
   * Scrolls to bottoms if the param is received
   */
  scrollBottomIfNeeded() {
    if (!this.props.parent && this.props.entity) {
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
    this.focusedChild = -1;

    if (!this.state.focused) {
      this.setState({focused: true});
    }
    if (this.props.onInputFocus) {
      this.props.onInputFocus();
    }
  }

  onChildFocus = (item, offset) => {
    if (!offset) offset = 0;

    if (!this.props.parent) {
      this.focusedChild = this.props.store.comments.findIndex(c => item === c);
      this.focusedOffset = offset;
    } else {
      const index = this.props.store.comments.findIndex(c => item === c);
      const frame = this.listRef._listRef._getFrameMetricsApprox(index);
      if (this.props.onInputFocus) {
        this.props.onInputFocus(item, offset + frame.offset + frame.length);
      }
    }
  }

  /**
   * On comment input focus
   */
  onBlur = () => {
    this.setState({focused: false});
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
  loadComments = async (loadingMore = false, descending = true) => {
    let guid;
    const scrollToBottom = this.props.navigation.state.params.scrollToBottom;

    if (this.props.entity) {
      guid = this.props.entity.guid;
      if (this.props.entity.entity_guid) {
        guid = this.props.entity.entity_guid;
      }
    }

    await this.props.store.loadComments(guid, descending);

    if (!loadingMore && scrollToBottom && this.props.store.loaded) {
      this.scrollBottomIfNeeded();
    }
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
    if (this.state.hideInput) return null;

    const attachment = this.props.store.attachment;

    const avatarImg = this.props.user.me && this.props.user.me.getAvatarSource ? this.props.user.me.getAvatarSource() : {};

    const comments = this.props.store;

    return (
      <View>
        <View style={[CS.rowJustifyCenter, CS.margin, CS.padding, CS.backgroundWhite, CS.borderRadius12x, CS.borderGreyed, CS.borderHair]}>
          <Image source={avatarImg} style={CmpStyle.posterAvatar} />
          <TextInput
            style={[CS.flexContainer, CS.marginLeft, inputStyle, {paddingVertical: 2}]}
            editable={true}
            underlineColorAndroid='transparent'
            placeholder={i18n.t('activity.typeComment')}
            onChangeText={this.setText}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            multiline={true}
            autogrow={true}
            maxHeight={110}
            value={comments.text}
            ref={textInput => this.textInput = textInput}
            onSelectionChange={this.onSelectionChanges}
          />
          {attachment.uploading ?
            <Progress.Pie progress={attachment.progress} size={36} />:
            (comments.saving || attachment.checkingVideoLength) ?
              <ActivityIndicator size={'large'} /> :
              <View style={[CS.rowJustifyEnd, CS.centered]}>
                <TouchableOpacity onPress={() => this.actionAttachmentSheet.show()} style={CS.paddingRight2x}><Icon name="md-attach" size={24} style={CS.paddingRight2x} /></TouchableOpacity>
                <TouchableOpacity onPress={this.postComment} style={CS.paddingRight2x}><Icon name="md-send" size={24} /></TouchableOpacity>
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
        store={this.props.store}
        onTextInputfocus={this.onChildFocus}
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
            onPress={() => { this.loadComments(true)}}
            underlayColor = 'transparent'
            style = {[CS.rowJustifyCenter, CS.padding2x]}
          >
            <Text style={[CS.fontM, CS.colorPrimary]}><IconMC name="update" size={16} /> {i18n.t('activity.loadEarlier')} </Text>
          </TouchableHighlight> : null
        }
        {this.props.store.loading && this.props.store.loaded && <ActivityIndicator size="small" style={CS.paddingTop2x}/>}
        {this.getErrorLoading()}
      </View>
    )
  }

  /**
   * Refresh comments
   */
  refresh = async () => {
    this.props.store.refresh();
    await this.loadComments();
    this.props.store.refreshDone();
  }

  getErrorLoading() {
    if (this.props.store.errorLoading) {
      const message = this.props.store.comments.length ?
        (i18n.t('cantLoadMore') + '\n' + i18n.t('tryAgain')) :
        (i18n.t('cantLoad') + '\n' + i18n.t('tryAgain'));

      return <Text onPress={() => this.loadComments(true)} style={[CS.fontM, CS.colorDarkGreyed, CS.marginBottom, CS.textCenter]}><Text style={CS.fontSemibold}>{i18n.t('ops')}</Text> {message}</Text>
    }
    return null;
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
        options={[i18n.t('cancel'), i18n.t('images'), i18n.t('videos')]}
        onPress={this.props.store.selectMediaType}
        cancelButtonIndex={0}
      />
    }

    return (
      <View style={[CS.flexContainer, CS.backgroundWhite, paddingBottom]} onLayout={this.onLayout}>
        <KeyboardAvoidingView style={[CS.flexContainer]} behavior={Platform.OS == 'ios' ? 'padding' : null}
          keyboardVerticalOffset={vPadding} enabled={this.state.focused && !this.props.parent}>
          <View style={CS.flexContainer}>
            <FlatList
              ref={ref => this.listRef = ref}
              ListHeaderComponent={header}
              data={this.props.store.comments.slice()}
              keyboardShouldPersistTaps={'handled'}
              renderItem={this.renderComment}
              keyExtractor={item => item.guid}
              initialNumToRender={25}
              onRefresh={this.refresh}
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
            options={[i18n.t('cancel'), i18n.t('capture.gallery'), i18n.t('capture.photo'), i18n.t('capture.video')]}
            onPress={this.selectMediaSource}
            cancelButtonIndex={0}
          />
        </KeyboardAvoidingView>
      </View>
    );
  }
}