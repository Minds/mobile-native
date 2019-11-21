import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Alert
} from 'react-native';

import { observer, inject } from 'mobx-react/native';
import { Icon } from 'react-native-elements'
import {
  NavigationActions
} from 'react-navigation';

import colors from '../styles/Colors';
import HashtagService from '../common/services/hashtag.service'

import CaptureGallery from './CaptureGallery';
import CapturePreview from './CapturePreview';

import CaptureMetaPreview from './CaptureMetaPreview';
import CapturePostButton from './CapturePostButton';
import { CommonStyle as CS } from '../styles/Common';
import Colors from '../styles/Colors';
import CapturePosterFlags from './CapturePosterFlags';
import UserAutocomplete from '../common/components/UserAutocomplete';
import Activity from '../newsfeed/activity/Activity';
import BlogCard from '../blogs/BlogCard';
import ActivityModel from '../newsfeed/ActivityModel';
import featuresService from '../common/services/features.service';
import testID from '../common/helpers/testID';
import logService from '../common/services/log.service';
import i18n from '../common/services/i18n.service';
import settingsStore from '../settings/SettingsStore';
import CaptureTabs from './CaptureTabs';

// workaround for android copy/paste
import TextInput from '../common/components/TextInput';

@inject('user', 'capture')
@observer
export default class CapturePoster extends Component {

  /**
   * Disable navigation bar
   */
  static navigationOptions = ({ navigation }) => ({
    headerRight: navigation.state.params && navigation.state.params.headerRight
  });

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
   * On component will mount
   */
  componentWillMount() {
    const { setParams } = this.props.navigation;
    let { params } = this.props.navigation.state;
    if (!params) params = {};
    setParams({
      headerRight: <CapturePostButton
        onPress={() => !params.isRemind ? this.submit() : this.remind()}
        text={params.isRemind ? i18n.t('capture.remind').toUpperCase() : i18n.t('capture.post').toUpperCase()}
        testID="CapturePostButton"
      />
    });
  }

  /**
   * On component did mount
   */
  componentDidMount() {
    const { params } = this.props.navigation.state;

    if (params) {
      this.props.capture.reset();
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
    let group = this.props.navigation.state.params ? this.props.navigation.state.params.group : null;
    return group? <Text style={styles.title}> {i18n.t('capture.postingIn', {group: group.name})} </Text> :null;
  }


  /**
   * Nav to group
   */
  navToPrevious(entity, group) {

    const {state, dispatch, goBack} = this.props.navigation;

    const params = {
      prepend: ActivityModel.checkOrCreate(entity),
    };

    if (group) params.group = group;

    dispatch(NavigationActions.setParams({
      params,
      key: state.params.parentKey, // passed from index
    }));

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
            style={styles.poster}
            editable={true}
            placeholder={i18n.t('capture.placeholder')}
            placeholderTextColor='#ccc'
            underlineColorAndroid='transparent'
            onChangeText={this.setText}
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
    const params = this.props.navigation.state.params || {};

    return params.isRemind ? this.renderRemind() : this.renderNormal();
  }

  /**
   * Screen content for poster
   */
  renderNormal() {
    const navigation = this.props.navigation;

    const params = navigation.state.params || {};

    return (
      <View style={CS.flexContainer} testID="capturePosterView">
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
    const navigation = this.props.navigation;

    const params = navigation.state.params || {};

    return (
      <View style={CS.flexContainer}>
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
    const { params } = this.props.navigation.state;
    const ShowComponent = params.entity.subtype == 'blog' ? BlogCard : Activity;
    return <ShowComponent hideTabs={true} entity={params.entity} />
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
          <Icon raised name="md-close" type="ionicon" color='#fff' size={22} containerStyle={styles.deleteAttachment} onPress={() => this.deleteAttachment()} {...testID('Attachment Delete Button')} />
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
    let group = this.props.navigation.state.params ? this.props.navigation.state.params.group : null
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
    const { params } = this.props.navigation.state;
    const message = this.props.capture.text;
    const metadata = params.entity.getClientMetadata();

    const post = {
      message,
      ...metadata
    };

    let group = this.props.navigation.state.params ? this.props.navigation.state.params.group : null

    if(HashtagService.slice(message).length > HashtagService.maxHashtags){ //if hashtag count greater than 5
      Alert.alert(i18n.t('capture.maxHashtags', {maxHashtags: HashtagService.maxHashtags}));
      return false;
    }

    try {
      const response = await this.props.capture.remind(params.entity.guid, post);
      this.navToPrevious(response.entity, group);
    } catch (err) {
      logService.exception('[CapturePoster]', err);
      Alert.alert(i18n.t('ops'), i18n.t('errorMessage'));
    }
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

    if (this.props.navigation.state.params && this.props.navigation.state.params.group) {
      newPost.container_guid = this.props.navigation.state.params.group.guid;
    }

    if (this.props.capture.tags && this.props.capture.tags.length) {
      newPost.tags = this.props.capture.allTags;
    }

    try {
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
      } else if (this.props.navigation.state.params && this.props.navigation.state.params.group) {
        this.navToPrevious(response.entity, this.props.navigation.state.params.group);
      } else {
        this.navToPrevious(response.entity);
      }

      return response;
    } catch (err) {
      logService.exception('[CapturePoster]', err);
      Alert.alert(i18n.t('ops'), i18n.t('errorMessage'));
    }
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
    backgroundColor: 'white',
    flex:1
  },
  posterWrapper: {
    minHeight: 100,
    flexDirection: 'row',
    backgroundColor: '#FFF',
  },
  title: {
    margin:2,
    padding:4,
    color: '#4b4b4b'
  },
  poster: {
    padding: 12,
    paddingTop: 24,
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
    backgroundColor:'#4690DF',
    width:28,
    height:28,
    right: 8,
    top: 0,
  }
});
