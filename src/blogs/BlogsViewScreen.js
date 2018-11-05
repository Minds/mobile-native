import React, {
  Component
} from 'react';

import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
  TextInput,
  Keyboard,
  TouchableOpacity,
  TouchableHighlight,
  FlatList,
  Text,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';

import ActionSheet from 'react-native-actionsheet';
import { inject, observer } from 'mobx-react/native';
import { observable } from 'mobx';
import FastImage from 'react-native-fast-image';
import { Icon } from 'react-native-elements';
import IonIcon from 'react-native-vector-icons/Ionicons';

import BlogViewHTML from './BlogViewHTML';
import OwnerBlock from '../newsfeed/activity/OwnerBlock';
import formatDate from '../common/helpers/date';
import { CommonStyle as CS } from '../styles/Common';
import colors from '../styles/Colors';
import ThumbUpAction from '../newsfeed/activity/actions/ThumbUpAction';
import ThumbDownAction from '../newsfeed/activity/actions/ThumbDownAction';
import RemindAction from '../newsfeed/activity/actions/RemindAction';
import CommentsAction from '../newsfeed/activity/actions/CommentsAction';
import shareService from '../share/ShareService';
import CenteredLoading from '../common/components/CenteredLoading';
import commentsStoreProvider from '../comments/CommentsStoreProvider';
import Comment from '../comments/Comment';
import CapturePreview from '../capture/CapturePreview';
import * as Progress from 'react-native-progress';

/**
 * Blog View Screen
 */
@inject('user', 'blogsView')
@observer
export default class BlogsViewScreen extends Component {

  /**
   * Disable navigation bar
   */
  static navigationOptions = {
    header: null
  }

  share = () => {
    const blog = this.props.blogsView.blog;
    shareService.share(blog.title, blog.perma_url);
  }

  /**
   * Component will mount
   */
  async componentWillMount() {
    const params = this.props.navigation.state.params;

    this.comments = commentsStoreProvider.get();

    if (params.blog) {
      this.props.blogsView.setBlog(params.blog);
      this.loadComments();
    } else {
      this.props.blogsView.reset();
      await this.props.blogsView.loadBlog(params.guid);
      this.loadComments();
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
   * Reply comment
   */
  replyComment = (comment) => {
    this.comments.setText('@' + comment.ownerObj.username + ' ');
    if (this.textInput) {
      this.textInput.focus();
    }
  }

  /**
   * Set comment text
   */
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
      this.scrollToBottom();
    }
  }

  /**
   * Load comments
   */
  loadComments = async () => {
    let guid;
    if (this.props.blogsView.blog) {
      guid = this.props.blogsView.blog.guid;
      await this.comments.loadComments(guid);
    }
  }

  /**
   * Select attachment source
   */
  selectMediaSource = (opt) => {
    switch (opt) {
      case 1:
        this.comments.gallery(this.actionSheet);
        break;
      case 2:
        this.comments.photo();
        break;
      case 3:
        this.comments.video();
        break;
    }
  }

  /**
   * Render poster
   */
  renderPoster() {
    const attachment = this.comments.attachment;

    const avatarImg = this.props.user.me && this.props.user.me.getAvatarSource ? this.props.user.me.getAvatarSource() : {};

    const comments = this.comments;

    return (
      <View>
        <View style={styles.messagePoster}>
          <Image source={avatarImg} style={styles.posterAvatar} />
          <TextInput
            style={[CS.flexContainer, styles.input]}
            editable={true}
            underlineColorAndroid='transparent'
            placeholder='Type your comment...'
            onChangeText={this.setText}
            onFocus={this.onFocus}
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
              <View style={CS.rowJustifyEnd}>
                <TouchableOpacity onPress={() => this.actionAttachmentSheet.show()} style={styles.sendicon}><IonIcon name="md-attach" size={24} style={CS.paddingRight2x} /></TouchableOpacity>
                <TouchableOpacity onPress={() => this.postComment()} style={styles.sendicon}><IonIcon name="md-send" size={24} /></TouchableOpacity>
              </View>}
        </View>
          {attachment.hasAttachment && <View style={styles.preview}>
            <CapturePreview
              uri={attachment.uri}
              type={attachment.type}
            />

            <IonIcon name="md-close" size={36} style={styles.deleteAttachment} onPress={() => this.comments.deleteAttachment()} />
          </View>}
      </View>
    )
  }

  /**
   * Render comment
   */
  renderComment = (row) => {
    const comment = row.item;

    // add the editing observable property
    comment.editing = observable.box(false);

    return (
      <Comment comment={comment} entity={this.props.blogsView.blog} replyComment={this.replyComment} store={this.comments} navigation={this.props.navigation}/>
    );
  }

  /**
   * Render
   */
  render() {
    const blog = this.props.blogsView.blog;
    const attachment = this.comments.attachment;

    if (!blog) return <CenteredLoading/>

    let actionsheet = null;

    if (Platform.OS != 'ios') {
      actionsheet = <ActionSheet
        ref={o => this.actionSheet = o}
        options={['Cancel', 'Images', 'Videos']}
        onPress={this.comments.selectMediaType}
        cancelButtonIndex={0}
      />
    }

    return (
      <View style={CS.flexContainer}>
        <KeyboardAvoidingView style={styles.containerContainer} behavior={Platform.OS == 'ios' ? 'padding' : null}
        >
        <View style={CS.flexContainer}>
          <FlatList
            ref={ref => this.listRef = ref}
            ListHeaderComponent={this.getHeader()}
            data={this.comments.comments.slice()}
            renderItem={this.renderComment}
            keyExtractor={item => item.guid}
            initialNumToRender={25}
            refreshing={this.comments.refreshing}
            ListEmptyComponent={this.comments.loaded && !this.comments.refreshing ? <View/> : <CenteredLoading/>}
            style={[CS.backgroundWhite, CS.flexContainer]}
          />
          {this.renderPoster()}
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

  /**
   * Render blog
   */
  getHeader() {
    const blog = this.props.blogsView.blog;

    const actions = (
      <View style={[CS.flexContainer, CS.paddingLeft2x]}>
        <View style={styles.actionsContainer}>
          <RemindAction entity={blog} size={16} />
          <ThumbUpAction entity={blog} orientation='column' size={16} me={this.props.user.me} />
          <ThumbDownAction entity={blog} orientation='column' size={16} me={this.props.user.me} />
          <CommentsAction entity={blog} size={16} navigation={this.props.navigation} />
        </View>
      </View>
    )
    const image = blog.getBannerSource();
    return (
      <View style={styles.screen}>
        <FastImage source={image} resizeMode={FastImage.resizeMode.cover} style={styles.image} />
        <Text style={styles.title}>{blog.title}</Text>
        <View style={styles.ownerBlockContainer}>
          <OwnerBlock entity={blog} navigation={this.props.navigation} rightToolbar={actions}>
            <Text style={styles.timestamp}>{formatDate(blog.time_created)}</Text>
          </OwnerBlock>
        </View>
        <View style={styles.description}>
          <BlogViewHTML html={blog.description} />
        </View>
        <View style={styles.moreInformation}>
          <Icon color={colors.medium} size={18} name='public' onPress={() => this.props.navigation.goBack()} />
          <Text style={[CS.fontXS, CS.paddingLeft, CS.colorMedium, CS.paddingRight2x]}>{blog.getLicenseText()}</Text>
          <Icon color={colors.primary} size={20} name='share' onPress={this.share} />
        </View>
        <Icon raised color={colors.primary} containerStyle={styles.header} size={30} name='arrow-back' onPress={() => this.props.navigation.goBack()}/>
        { this.comments.loadPrevious && !this.comments.loading ?
            <TouchableHighlight
            onPress={() => { this.loadComments()}}
            underlayColor = 'transparent'
            style = {styles.loadCommentsContainer}
          >
            <Text style={styles.loadCommentsText}> LOAD EARLIER </Text>
          </TouchableHighlight> : null
        }
      </View>
    )
  }
}

let paddingBottom = 0;

const d = Dimensions.get('window');
if (d.height == 812 || d.width == 812) {
  paddingBottom = 16;
}

/**
 * Styles
 */
const styles = StyleSheet.create({
  containerContainer: {
    flex: 1,
    paddingBottom: paddingBottom,
  },
  header: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: 40,
    width: 40,
  },
  actionsContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4
  },
  title: {
    paddingTop: 12,
    paddingBottom: 8,
    paddingLeft: 12,
    paddingRight: 12,
    fontSize: 22,
    color: '#444',
    fontFamily: 'Roboto',
    fontWeight: '800',
  },
  ownerBlockContainer: {
    margin: 8,
  },
  description: {
    paddingLeft: 12,
    paddingRight: 12,
    paddingBottom: 12,
  },
  screen: {
    backgroundColor: '#FFF',
    flex:1
  },
  image: {
    height: 200
  },
  timestamp: {
    fontSize: 11,
    color: '#888',
  },
  moreInformation: {
    padding: 12,
    flexDirection: 'row',
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
  sendicon: {
    paddingRight: 8
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