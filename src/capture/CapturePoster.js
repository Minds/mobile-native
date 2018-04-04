import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TextInput,
  Text,
  Button,
  TouchableHighlight,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

import { observer, inject } from 'mobx-react/native';
import { Icon } from 'react-native-elements'
import {
  NavigationActions
} from 'react-navigation';

import { post } from './CaptureService';

import colors from '../styles/Colors';

import CaptureGallery from './CaptureGallery';
import CapturePreview from './CapturePreview';

import Util from '../common/helpers/util';
import RichEmbedService from '../common/services/rich-embed.service';
import CaptureMetaPreview from './CaptureMetaPreview';
import CapturePostButton from './CapturePostButton';
import { CommonStyle } from '../styles/Common';
import Colors from '../styles/Colors';
import CapturePosterFlags from './CapturePosterFlags';

@inject('user', 'navigatorStore', 'capture')
@observer
export default class CapturePoster extends Component {

  /**
   * Disable navigation bar
   */
  static navigationOptions = ({ navigation }) => ({
    headerRight: navigation.state.params && navigation.state.params.headerRight
  });

  state = {
    text: '',
    postImageUri: '',
    hasRichEmbed: false,
    richEmbedUrl: '',
    meta: null,
    mature: false,
    share: {},
    lock: null,
  };

  _RichEmbedFetchTimer;

  /**
   * On component will mount
   */
  componentWillMount() {
    const { setParams } = this.props.navigation;
    setParams({ headerRight: <CapturePostButton onPress={() => this.submit()} /> });
  }

  /**
   * On component did mount
   */
  componentDidMount() {
    const { params } = this.props.navigation.state;
    if (params ) {
      if (params.text) {
        this.setState({text: params.text});
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
    if (this._RichEmbedFetchTimer) {
      clearTimeout(this._RichEmbedFetchTimer);
    }

    this.deleteAttachment();
  }

  showContext () {
    let group = this.props.navigation.state.params? this.props.navigation.state.params.group : null;
    return group? <Text style={styles.title}> { '( Posting in ' + group.name + ')'} </Text> :null;
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
   * Render
   */
  render() {
    const attachment = this.props.capture.attachment;
    const navigation = this.props.navigation;

    return (
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
            value={this.state.text}
            multiline={true}
            selectTextOnFocus={true}
          />
        </View>

        {(this.state.meta || this.state.metaInProgress) && <CaptureMetaPreview
          meta={this.state.meta}
          inProgress={this.state.metaInProgress}
          onRemove={this.clearRichEmbedAction}
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
      </ScrollView>
    );
  }

  /**
   * Attach Media
   */
  onAttachedMedia = async (response) => {
    const attachment = this.props.capture.attachment;

    const result = await attachment.attachMedia(response);

    if (result === false) alert('caught upload error');
  }

  /**
   * Delete attachment
   */
  async deleteAttachment() {
    const attachment = this.props.capture.attachment;
    // delete
    const result = await attachment.delete();

    if (result === false) alert('caught error deleting the file');
  }

  /**
   * Submit
   */
  async submit() {
    const attachment = this.props.capture.attachment;

    if (attachment.hasAttachment && attachment.uploading) {
      alert('Please try again in a moment.');
      return false;
    }

    if (
      !attachment.hasAttachment &&
      !this.state.text &&
      (!this.state.meta || !this.state.meta.perma_url)
    ) {
      alert('Nothing to post...');
      return false;
    }

    let newPost = {
      message: this.state.text,
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

    this.props.capture.setPosting(true);

    if (this.state.meta) {
      newPost = Object.assign(newPost, this.state.meta);
    }

    if (this.props.navigation.state.params && this.props.navigation.state.params.group) {
      newPost.container_guid = this.props.navigation.state.params.group.guid;
    }

    try {
      let response = await post(newPost);

      if (this.props.reset) {
        this.props.reset();
      }

      // clear attachment data
      attachment.clear();

      this.setState({
        text: '',
        meta: null,
        mature: false,
        share: {},
        lock: null,
      });

      this.props.capture.setPosting(false);

      if (this.props.onComplete) {
        this.props.onComplete(response.entity);
      } else if (this.props.navigation.state.params && this.props.navigation.state.params.group) {
        this.navToGroup(this.props.navigation.state.params.group, response.entity);
      } else {
        this.navToNewsfeed(response.entity);
      }

    } catch (e) {
      console.log('error', e);
      alert('Oooppppss. Looks like there was an error.');
    }
  }

  setText = (text) => {
    this.setState({ text });

    if (this._RichEmbedFetchTimer) {
      clearTimeout(this._RichEmbedFetchTimer);
    }

    setTimeout(this.richEmbedCheck);
  };

  richEmbedCheck = () => {
    const matches = Util.urlReSingle.exec(this.state.text);

    if (matches) {
      const url = (!matches[3] ? 'https://' : '') + matches[0];

      if (
        !this.state.hasRichEmbed ||
        (this.state.hasRichEmbed && url.toLowerCase() !== this.state.richEmbedUrl.toLowerCase())
      ) {
        this._RichEmbedFetchTimer = setTimeout(() => this.setRichEmbed(url), 750);
      }
    }
  };

  clearRichEmbedAction = () => {
    this.clearRichEmbed();

    if (this._RichEmbedFetchTimer) {
      clearTimeout(this._RichEmbedFetchTimer);
    }
  };

  clearRichEmbed() {
    this.setState({
      hasRichEmbed: false,
      richEmbedUrl: '',
      meta: null
    });
  }

  async setRichEmbed(url) {
    this.setState({
      hasRichEmbed: true,
      richEmbedUrl: url,
      meta: null,
      metaInProgress: true
    });

    try {
      const meta = await RichEmbedService.getMeta(url);

      this.setState({ meta, metaInProgress: false })
    } catch (e) {
      this.setState({ metaInProgress: false });
      console.error(e);
    }
  }


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
    backgroundColor: 'white'
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
  posterButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
  },
  preview: {
    flex: 1,
    minHeight: 200,
    flexDirection: 'row',
    alignItems: 'stretch',
    position: 'relative',
  },
  avatar: {
    flex: 1,
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
