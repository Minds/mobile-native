import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TextInput,
  Text,
  Alert,
  Button,
  TouchableHighlight,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';

import { observer, inject } from 'mobx-react/native';
import { Icon } from 'react-native-elements'
import {
  NavigationActions
} from 'react-navigation';

import colors from '../styles/Colors';

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
    mature: false,
    share: {},
    lock: null,
    selection: {
      start:0,
      end: 0
    }
  };

  /**
   * On component will mount
   */
  componentWillMount() {
    const { setParams } = this.props.navigation;
    const { params } = this.props.navigation.state;
    setParams({
      headerRight: <CapturePostButton
        onPress={() => !params.isRemind ? this.submit() : this.remind()}
        text={params.isRemind ? 'REMIND' : 'POST'}
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
        this.props.capture.setText(params.text);
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
    return group? <Text style={styles.title}> { '(Posting in ' + group.name + ')'} </Text> :null;
  }

  /**
   * Nav to newsfeed
   * @param {object} entity
   */
  navToNewsfeed(entity) {
    const dispatch = NavigationActions.navigate({
      routeName: 'Newsfeed',
      params: {
        prepend: entity,
      },
    });

    this.props.navigation.dispatch(dispatch);
  }

  /**
   * Nav to group
   */
  navToGroup(group, entity) {

    const {state, dispatch, goBack} = this.props.navigation;

    const params = {
      group: group,
      prepend: entity,
    };

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
   * Render
   */
  render() {
    const text = this.props.capture.text;
    const navigation = this.props.navigation;

    return (
      <View style={CS.flexContainer}>
        <ScrollView style={styles.posterAndPreviewWrapper}>
          {this.showContext()}
          <View style={styles.posterWrapper} pointerEvents="box-none">
            <TextInput
              style={styles.poster}
              editable={true}
              placeholder='Speak your mind...'
              placeholderTextColor='#ccc'
              underlineColorAndroid='transparent'
              onChangeText={this.setText}
              value={text}
              multiline={true}
              selectTextOnFocus={false}
              onSelectionChange={this.onSelectionChanges}
            />
          </View>
          {!navigation.state.params.isRemind ? this.getAttachFeature() : this.getRemind()}
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
          matureValue={this.state.mature}
          shareValue={this.state.share}
          lockValue={this.state.lock}
          onMature={this.onMature}
          onShare={this.onShare}
          onLocking={this.onLocking}
        />

        {attachment.hasAttachment && <View style={styles.preview}>
          <CapturePreview
            uri={attachment.uri}
            type={attachment.type}
          />
          <Icon raised name="md-close" type="ionicon" color='#fff' size={22} containerStyle={styles.deleteAttachment} onPress={() => this.deleteAttachment()}/>
        </View>}

        <CaptureGallery
          onSelected={this.onAttachedMedia}
        />
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
      console.error(err);
      Alert.alert('caught upload error');
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
      if (result === false) Alert.alert('caught error deleting the file');
    }
  }

  async remind() {
    const { params } = this.props.navigation.state;
    const message = this.props.capture.text;
    const post = {message};
    try {
      const response = await this.props.capture.remind(params.entity.guid, post);
      console.log(response)
      this.navToNewsfeed(response.entity);
    } catch (e) {
      Alert.alert('Oops', "There was an error.\nPlease try again.");
    }
  }

  /**
   * Submit
   */
  async submit() {
    const attachment = this.props.capture.attachment;
    const text = this.props.capture.text;

    if (attachment.hasAttachment && attachment.uploading) {
      Alert.alert('Please try again in a moment.');
      return false;
    }

    if (
      !attachment.hasAttachment &&
      !text &&
      (!this.props.capture.embed.meta || !this.props.capture.embed.meta.perma_url)
    ) {
      Alert.alert('Nothing to post...');
      return false;
    }

    let newPost = {
      message: text,
      mature: this.state.mature ? 1 : 0,
      wire_threshold: this.state.lock
    };

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
        share: {},
        lock: null,
      });
      this.props.capture.setText('');

      if (this.props.onComplete) {
        this.props.onComplete(response.entity);
      } else if (this.props.navigation.state.params && this.props.navigation.state.params.group) {
        this.navToGroup(this.props.navigation.state.params.group, response.entity);
      } else {
        this.navToNewsfeed(response.entity);
      }

      return response;
    } catch (e) {
      Alert.alert('Oops', "There was an error.\nPlease try again.");
    }
  }

  setText = (text) => {
    this.props.capture.setText(text);
    this.props.capture.embed.richEmbedCheck(text);
  };

  onMature = () => {
    const mature = !this.state.mature;
    this.setState({ mature });
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
