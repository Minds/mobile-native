import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Alert
} from 'react-native';

import { observer, inject } from 'mobx-react';
import { Icon } from 'react-native-elements'
import { CommonActions } from '@react-navigation/native';

import HashtagService from '../common/services/hashtag.service'

import CaptureGallery from './CaptureGallery';
import CapturePreview from './CapturePreview';

import CaptureMetaPreview from './CaptureMetaPreview';
import CapturePostButton from './CapturePostButton';
import { CommonStyle as CS } from '../styles/Common';
import CapturePosterFlags from './CapturePosterFlags';
import UserAutocomplete from '../common/components/UserAutocomplete';
import Activity from '../newsfeed/activity/Activity';
import BlogCard from '../blogs/BlogCard';
import ActivityModel from '../newsfeed/ActivityModel';
import logService from '../common/services/log.service';
import i18n from '../common/services/i18n.service';
import settingsStore from '../settings/SettingsStore';
import CaptureTabs from './CaptureTabs';

// workaround for android copy/paste
import TextInput from '../common/components/TextInput';
import ThemedStyles from '../styles/ThemedStyles';
import remoteAction from '../common/RemoteAction';

export default
@inject('user', 'capture', 'newsfeed')
@observer
class CapturePoster extends Component {
  /**
   * State
   */
  state = {
    postImageUri: '',
    mature: false, // @deprecated
    nsfw: [],
    share: {},
    lock: null,
    selection: {
      start:0,
      end: 0
    },
    time_created: null,
  };

  /**
   * On component did mount
   */
  componentDidMount() {
    let { params } = this.props.route;

    this.props.capture.reset();

    if (params) {
      if (params.text) {
        this.setText(params.text);
      } else if (params.image) {
        this.onAttachedMedia({
          type: 'image/jpeg',
          uri: params.image
        });
      } else if (params.video) {
        this.onAttachedMedia({
          type: 'video/mp4',
          uri: params.video
        });
      }
    }

    const { setOptions } = this.props.navigation;
    if (!params) {
      params = {};
    }
    setOptions({
      headerHideBackButton: false,
      headerRight: () => (
        <CapturePostButton
          onPress={() => (!params.isRemind ? this.submit() : this.remind())}
          text={
            params.isRemind
              ? i18n.t('capture.remind').toUpperCase()
              : i18n.t('capture.post').toUpperCase()
          }
          testID="CapturePostButton"
        />
      ),
    });

    this.loadNsfwFromPersistentStorage();
  }

  /**
   * Load last saved nsfw values
   */
  async loadNsfwFromPersistentStorage() {
    this.setState({
      nsfw: settingsStore.creatorNsfw,
    });
  }

  /**
   * On component will unmount
   */
  componentWillUnmount() {
    this.props.capture.embed.clearRichEmbedAction();
    this.deleteAttachment();
  }

  /**
   * Show context
   */
  showContext () {
    let group = this.props.route.params ? this.props.route.params.group : null;
    return group? <Text style={styles.title}> {i18n.t('capture.postingIn', {group: group.name})} </Text> :null;
  }


  /**
   * Nav to group
   */
  navToPrevious(entity, group) {

    const { goBack, dispatch } = this.props.navigation;
    const { params } = this.props.route;

    const activity = ActivityModel.checkOrCreate(entity);

    this.props.newsfeed.prepend(activity);

    if (params && params.parentKey) {

      const routeParams = {
        prepend: activity,
      };

      if (group) {
        routeParams.group = group;
      }

      // this.props.navigation.navigate(params.previous, routeParams);
      dispatch({
        ...CommonActions.setParams(routeParams),
        source: params.parentKey, // passed from index
      });
    }

    goBack(null);
  }

  /**
   * On tag selected in the autocomplete
   */
  onSelectTag = (text) => {
    this.setText(text);
  }

  /**
   * Set the state with cursor position
   */
  onSelectionChanges = (event) => {
    this.setState({selection: event.nativeEvent.selection});
  }

  /**
   * Get header
   *
   * @param {boolean} showAttachmentFeatures
   */
  getHeader(showAttachmentFeatures = false) {
    return (
      <React.Fragment>
        {this.showContext()}
        <View style={styles.posterWrapper}>
          <TextInput
            style={[styles.poster, ThemedStyles.style.colorPrimaryText]}
            editable={true}
            placeholder={i18n.t('capture.placeholder')}
            placeholderTextColor={ThemedStyles.getColor('secondary_text')}
            underlineColorAndroid='transparent'
            onChangeText={this.setText}
            textAlignVertical="top"
            value={this.props.capture.text}
            multiline={true}
            selectTextOnFocus={false}
            onSelectionChange={this.onSelectionChanges}
            testID="PostInput"
          />
        </View>
        {showAttachmentFeatures && this.getAttachFeature()}
      </React.Fragment>
    )
  }

  /**
   * Render
   */
  render() {
    const params = this.props.route.params || {};

    return params.isRemind ? this.renderRemind() : this.renderNormal();
  }

  /**
   * Screen content for poster
   */
  renderNormal() {
    const navigation = this.props.navigation;

    const params = this.props.route.params || {};

    return (
      <View style={[CS.flexContainer, ThemedStyles.style.backgroundSecondary]}>
        <CaptureGallery
          onSelected={this.onAttachedMedia}
          header={this.getHeader(true)}
        />
        <UserAutocomplete
          text={this.props.capture.text}
          selection={this.state.selection}
          onSelect={this.onSelectTag}
        />
      </View>
    );
  }

  /**
   * Screen content for remind
   */
  renderRemind() {
    const text = this.props.capture.text;

    return (
      <View style={[CS.flexContainer, ThemedStyles.style.backgroundSecondary]}>
        <ScrollView style={styles.posterAndPreviewWrapper} keyboardShouldPersistTaps={'always'} removeClippedSubviews={false}>
          {this.getHeader()}
          {this.getRemind()}
        </ScrollView>
        <UserAutocomplete
          text={text}
          selection={this.state.selection}
          onSelect={this.onSelectTag}
        />
      </View>
    );
  }

  /**
   * Get remind card
   */
  getRemind() {
    const { params } = this.props.route;
    const ShowComponent = params.entity.subtype === 'blog' ? BlogCard : Activity;
    return (
      <ShowComponent
        hideTabs={true}
        entity={params.entity}
        navigation={this.props.navigation}
      />
    );
  }

  /**
   * Get attachment feature
   */
  getAttachFeature() {
    const attachment = this.props.capture.attachment;
    return (
      <React.Fragment>
        {(this.props.capture.embed.meta || this.props.capture.embed.metaInProgress) && <CaptureMetaPreview
          meta={this.props.capture.embed.meta}
          inProgress={this.props.capture.embed.metaInProgress}
          onRemove={this.props.capture.embed.clearRichEmbedAction}
        />}

        <CapturePosterFlags
          containerStyle={[CS.rowJustifyEnd]}
          matureValue={this.state.mature}
          hideShare={true}
          shareValue={this.state.share}
          lockValue={this.state.lock}
          nsfwValue={this.state.nsfw}
          timeCreatedValue={this.state.time_created}
          onMature={this.onMature}
          onNsfw={this.onNsfw}
          onShare={this.onShare}
          onLocking={this.onLocking}
          onScheduled={this.onScheduled}
        />

        {attachment.hasAttachment && <View style={styles.preview}>
          <CapturePreview
            uri={attachment.uri}
            type={attachment.type}
          />
          <Icon raised reverse name="md-close" type="ionicon" color='#4690DF' size={18} containerStyle={styles.deleteAttachment} onPress={() => this.deleteAttachment()} testID="AttachmentDeleteButton" />
        </View>}
        <CaptureTabs onSelectedMedia={this.onAttachedMedia} />
      </React.Fragment>
    );
  }

  /**
   * Attach Media
   */
  onAttachedMedia = async (response) => {
    const attachment = this.props.capture.attachment;
    let group = this.props.route.params ? this.props.route.params.group : null
    let extra = null;

    if (group) {
      extra = {container_guid: group.guid};
    }

    try {
      const result = await attachment.attachMedia(response, extra);
    } catch(err) {
      logService.exception(err);
      Alert.alert(i18n.t('capture.uploadError'));
    }
  }

  /**
   * Delete attachment
   */
  async deleteAttachment() {
    const attachment = this.props.capture.attachment;
    // delete only if it has an attachment
    if (attachment.hasAttachment) {
      const result = await attachment.delete();
      if (result === false) Alert.alert(i18n.t('capture.errorDeleting'));
    }
  }

  /**
   * Create a remind
   */
  async remind() {
    const { params } = this.props.route;
    const message = this.props.capture.text;
    const metadata = params.entity.getClientMetadata();

    const post = {
      message,
      ...metadata
    };

    let group = this.props.route.params ? this.props.route.params.group : null

    // if hashtag count greater than 5
    if (HashtagService.slice(message).length > HashtagService.maxHashtags) {
      Alert.alert(
        i18n.t('capture.maxHashtags', {
          maxHashtags: HashtagService.maxHashtags,
        }),
      );
      return false;
    }

    return await remoteAction(async () => {
      const response = await this.props.capture.remind(
        params.entity.guid,
        post,
      );
      this.navToPrevious(response.entity, group);
    });
  }

  /**
   * Submit post
   */
  async submit() {
    const attachment = this.props.capture.attachment;
    const text = this.props.capture.text;

    if (attachment.hasAttachment && attachment.uploading) {
      Alert.alert(i18n.t('capture.pleaseTryAgain'));
      return false;
    }

    if (
      !attachment.hasAttachment &&
      !text &&
      (!this.props.capture.embed.meta || !this.props.capture.embed.meta.url)
    ) {
      Alert.alert(i18n.t('capture.nothingToPost'));
      return false;
    }

    if (HashtagService.slice(text).length > HashtagService.maxHashtags){ //if hashtag count greater than 5
      Alert.alert(i18n.t('capture.maxHashtags', {maxHashtags: HashtagService.maxHashtags}));
      return false;
    }

    let newPost = {
      message: text,
      wire_threshold: this.state.lock,
      time_created: this.formatTimeCreated()
    };

    newPost.nsfw = this.state.nsfw || [];

    if (attachment.guid) {
      newPost.attachment_guid = attachment.guid;
      newPost.attachment_license = attachment.license;
    }

    for (let network in this.state.share) {
      if (this.state.share[network]) {
        newPost[network] = 1;
      }
    }

    if (this.props.capture.embed.meta) {
      newPost = Object.assign(newPost, this.props.capture.embed.meta);
    }

    if (this.props.route.params && this.props.route.params.group) {
      newPost.container_guid = this.props.route.params.group.guid;
    }

    if (this.props.capture.tags && this.props.capture.tags.length) {
      newPost.tags = this.props.capture.allTags;
    }

    return await remoteAction(async () => {
      let response = await this.props.capture.post(newPost);

      if (this.props.reset) {
        this.props.reset();
      }

      // clear attachment data
      attachment.clear();

      this.setState({
        meta: null,
        mature: false,
        nsfw: [],
        share: {},
        lock: null,
      });
      this.props.capture.setText('');

      if (this.props.onComplete) {
        this.props.onComplete(response.entity);
      } else if (this.props.route.params && this.props.route.params.group) {
        this.navToPrevious(response.entity, this.props.route.params.group);
      } else {
        this.navToPrevious(response.entity);
      }
      return response;
    });
  }

  /**
   * Set text
   * @param {string} text
   */
  setText = (text) => {
    this.props.capture.setText(text);
    this.props.capture.embed.richEmbedCheck(text);
  };

  /**
   * On mature value change
   */
  onMature = () => {
    const mature = !this.state.mature;
    this.setState({ mature });
  }

  /**
   * On nsfw value change
   */
  onNsfw = values => {
    const nsfw = [...values];
    this.setState({ nsfw });
  }

  onShare = network => {
    const share = Object.assign({}, this.state.share);

    if (share[network]) {
      delete share[network];
    } else {
      share[network] = true;
    }

    this.setState({ share });
  }

  onLocking = lock => {
    this.setState({ lock });
  }

  onScheduled = timeCreated => {
    this.setState({ time_created: timeCreated })
  }

  formatTimeCreated = () => {
    let time_created;
    if (this.state.time_created) {
      time_created = new Date(this.state.time_created).getTime();
    } else {
      time_created = Date.now();
    }
    return Math.floor(time_created / 1000);
  }
}

const styles = StyleSheet.create({
  posterAndPreviewWrapper: {
    flex:1
  },
  posterWrapper: {
    minHeight: 100,
    flexDirection: 'row',
  },
  title: {
    margin:0,
    paddingHorizontal:10,
  },
  poster: {
    alignContent: 'flex-start',
    padding: 15,
    paddingTop: 15,
    flex: 1,
  },
  preview: {
    flex: 1,
    minHeight: 200,
    flexDirection: 'row',
    alignItems: 'stretch',
    position: 'relative',
  },
  gallery: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  deleteAttachment: {
    position: 'absolute',
    right: 8,
    top: 0,
  }
});
