// @flow
import * as React from 'react';
import type { ViewLayoutEvent } from 'react-native/Libraries/Components/View/ViewPropTypes';

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

import blockListService from '../common/services/block-list.service';
import autobind from "../common/helpers/autobind";

// types
type Props = {
  header?: any,
  parent?: any,
  keyboardVerticalOffset?: any,
  entity: any,
  store: any,
  user: any,
  navigation: any,
  onInputFocus?: Function
};

type State = {
  focused: boolean,
  hideInput: boolean,
  guid: ?string,
  blockedChannels: Array<string>,
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
  listRef: ?React.ElementRef<typeof FlatList>;
  textInput: any;
  actionAttachmentSheet: ?ActionSheet;
  actionSheet: ?ActionSheet;
  keyboardDidShowListener: any;
  keyboardDidHideListener: any;
  focusedChild: number = -1;
  focusedOffset: number = 0;
  height: number = 0;

  state = {
    focused: false,
    hideInput: false,
    guid: null,
    blockedChannels: [],
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

    blockListService.events.on('change', this._onBlockListChange);
  }

  /**
   * Component will unmount
   */
  componentWillUnmount() {
    blockListService.events.removeListener('change', this._onBlockListChange);

    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
    this.props.store.unlisten();
    this.props.store.clearComments();
  }

  @autobind
  _onBlockListChange() {
    this.loadBlockedChannels();
  }

  /**
   * Post comment
   */
  postComment = async() => {
    const store = this.props.store;
    if (store.text.trim() == '' && !store.attachment.hasAttachment) return;
    Keyboard.dismiss();
    if (!store.saving){
      await store.post(this.props.entity);
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
              viewOffset: this.focusedOffset ? -(this.focusedOffset - (this.height - e.endCoordinates.height - 110)) : -110 ,
              viewPosition: this.focusedOffset ? 0 : 1
            });
          }, 200);
        }
      }

    }
    // this.scrollBottomIfNeeded();
  }

  /**
   * On keyboard  hide
   */
  _keyboardDidHide = (e) => {
    if (!this.props.parent) {
      this.setState({hideInput: false});
    }
  }

  onLayout = (e: ViewLayoutEvent) => {
    if (!this.props.parent) {
      this.height = e.nativeEvent.layout.height || 0;
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

  onChildFocus = (item: CommentType, offset: number) => {
    if (!offset) offset = 0;

    const comments = this.getComments();

    if (!this.props.parent) {
      this.focusedChild = comments.findIndex(c => item === c);
      this.focusedOffset = offset;
      this.setState({hideInput: true, focused: false});
      //this.forceUpdate();
    } else {
      const index = comments.findIndex(c => item === c);
      const frame = this.listRef._listRef._getFrameMetricsApprox(index);
      if (this.props.onInputFocus) {
        this.props.onInputFocus(item, offset + frame.offset + frame.length);
      }
    }
  }

  onCommentFocus = (item, offset) => {
    if (!offset) offset = 0;

    const comments = this.getComments();

    if (!this.props.parent) {
      setTimeout(() => {
        this.listRef.scrollToIndex({
          index: comments.findIndex(c => item === c),
          viewOffset: offset ? -(offset - (this.height - 200)): -110 ,
          viewPosition: 0
        });
      }, 50);
    } else {
      const index = comments.findIndex(c => item === c);
      const frame = this.listRef._listRef._getFrameMetricsApprox(index);
      if (this.props.onCommentFocus) {
        this.props.onCommentFocus(item, offset + frame.offset );
      }
    }
  }

  /**
   * On comment input focus
   */
  onBlur = () => {
    if (this.props.parent) this.setState({focused: false});
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
  loadComments = async (loadingMore: boolean = false, descending: boolean = true) => {
    await this.loadBlockedChannels();

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

  @autobind
  async loadBlockedChannels() {
    this.setState({
      blockedChannels: (await blockListService.getList()) || [],
    });
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
    if (this.state.hideInput || !this.props.entity.allow_comments) return null;

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
  renderComment = (row: any): React.Element<Comment> => {
    const comment = row.item;
    const comments = this.props.store;

    // add the editing observable property
    comment.editing = observable.box(false);

    if (comment.focused && this.props.parent) {
      setTimeout(() => {
        if (this.props.onCommentFocus && this.listRef && this.listRef._listRef) {
          const frame = this.listRef._listRef._getFrameMetricsApprox(row.index);
          this.props.onCommentFocus(row.item, frame.offset + frame.length);
        }
      }, 1000);
    }

    return (
      <Comment
        comment={comment}
        entity={this.props.entity}
        store={this.props.store}
        onTextInputfocus={this.onChildFocus}
        onCommentFocus={this.onCommentFocus}
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
        { this.props.store.loadPrevious && !this.props.store.loadingPrevious ?
          <TouchableHighlight
            onPress={() => { this.loadComments(true)}}
            underlayColor = 'transparent'
            style = {[CS.rowJustifyCenter, CS.padding2x]}
          >
            <Text style={[CS.fontM, CS.colorPrimary]}><IconMC name="update" size={16} /> {i18n.t('activity.loadEarlier')} </Text>
          </TouchableHighlight> : null
        }
        {this.props.store.loadingPrevious && this.props.store.loaded && <ActivityIndicator size="small" style={CS.paddingTop2x}/>}
        {this.getErrorLoading(this.props.store.errorLoadingPrevious, true)}
      </View>
    )
  }

  /**
   * Refresh comments
   */
  refreshAsync = async () => {
    this.props.store.refresh();
    await this.loadComments();
    this.props.store.refreshDone();
  }

  refresh() {
    this.refreshAsync();
  }

  getErrorLoading(errorLoading: boolean, descending: boolean) {
    if (errorLoading) {
      const message = this.props.store.comments.length ?
        (i18n.t('cantLoadMore') + '\n' + i18n.t('tryAgain')) :
        (i18n.t('cantLoad') + '\n' + i18n.t('tryAgain'));

      return <Text onPress={() => this.loadComments(true)} style={[CS.fontM, CS.colorDarkGreyed, CS.marginBottom, CS.textCenter]}><Text style={CS.fontSemibold}>{i18n.t('ops')}</Text> {message}</Text>
    }
    return null;
  }

  /**
   * Get list footer
   */
  getFooter() {
    return (
      <View>
        { this.props.store.loadNext && !this.props.store.loadingNext ?
          <TouchableHighlight
            onPress={() => this.loadComments(true, false)}
            underlayColor = 'transparent'
            style = {[CS.rowJustifyCenter, CS.padding2x]}
          >
            <Text style={[CS.fontM, CS.colorPrimary]}><IconMC name="update" size={16} />{i18n.t('activity.loadLater')} </Text>
          </TouchableHighlight> : null
        }
        {this.props.store.loadingNext && this.props.store.loaded && <ActivityIndicator size="small" style={CS.paddingTop2x}/>}
        {this.getErrorLoading(this.props.store.errorLoadingNext, false)}
      </View>
    )
  }


  getComments() {
    if (!this.props.store.comments) {
      return [];
    }

    return this.props.store.comments
      .filter(comment => Boolean(comment))
      .filter(comment => this.state.blockedChannels.indexOf(comment.owner_guid) === -1);
  }

  isWholeThreadBlocked() {
    return this.props.store.comments.length > 0 &&
      this.props.store.comments.length !== this.getComments().length;
  }

  /**
   * @param {object} ref
   */
  setListRef = (ref: ?React.ElementRef<typeof FlatList>) => this.listRef = ref;

  /**
   * @param {object} ref
   */
  setActionSheetRef = (o: ActionSheet) => this.actionAttachmentSheet = o;

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

    const comments = this.getComments();
    const footer = this.getFooter();

    const emptyThread = (<View style={[CS.textCenter]}>
      {this.isWholeThreadBlocked() && <Text style={[CS.textCenter, CS.marginBottom2x, CS.marginTop2x, CS.fontLight]}>
        This thread contains replies from blocked channels.
      </Text>}
    </View>);

    return (
      <View style={[CS.flexContainer, CS.backgroundWhite, paddingBottom]} onLayout={this.onLayout}>
        <KeyboardAvoidingView style={[CS.flexContainer]} behavior={Platform.OS == 'ios' ? 'padding' : null}
          keyboardVerticalOffset={this.props.keyboardVerticalOffset ? -this.props.keyboardVerticalOffset : vPadding} enabled={!this.props.parent ? (this.state.focused || this.focusedChild !== -1) : false}>
          <View style={CS.flexContainer}>
            <FlatList
              ref={this.setListRef}
              ListHeaderComponent={header}
              ListFooterComponent={footer}
              data={comments}
              keyboardShouldPersistTaps={'handled'}
              removeClippedSubviews={false}
              renderItem={this.renderComment}
              keyExtractor={item => item.guid}
              initialNumToRender={25}
              onRefresh={this.refresh}
              refreshing={this.props.store.refreshing}
              ListEmptyComponent={this.props.store.loaded && !this.props.store.refreshing ? emptyThread : <CenteredLoading/>}
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
            ref={this.setActionSheetRef}
            options={[i18n.t('cancel'), i18n.t('capture.gallery'), i18n.t('capture.photo'), i18n.t('capture.video')]}
            onPress={this.selectMediaSource}
            cancelButtonIndex={0}
          />
        </KeyboardAvoidingView>
      </View>
    );
  }
}
