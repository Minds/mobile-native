import React, { Component } from 'react';
import {
  ListView,
  StyleSheet,
  View,
  ScrollView,
  FlatList,
  TextInput,
  Text,
  Button,
  TouchableHighlight,
  Image,
  ActivityIndicator
} from 'react-native';
import { observer, inject } from 'mobx-react/native';
import Icon from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-picker';
import api from './../common/services/api.service';
import * as Progress from 'react-native-progress';

import { post, uploadAttachment } from './CaptureService';

import colors from '../styles/Colors';

import CaptureGallery from './CaptureGallery';
import CaptureTabs from './CaptureTabs';
import CapturePreview from './CapturePreview';

import {
  NavigationActions
} from 'react-navigation';

import Util from '../common/helpers/util';
import RichEmbedService from '../common/services/rich-embed.service';
import CaptureMetaPreview from './CaptureMetaPreview';

@inject('user', 'navigatorStore')
@observer
export default class CapturePoster extends Component {

  state = {
    active: false,
    isPosting: false,
    text: '',
    hasAttachment: false,
    attachmentGuid: '',
    attachmentDone: false,
    postImageUri: '',
    hasRichEmbed: false,
    richEmbedUrl: '',
    meta: null
  };

  _RichEmbedFetchTimer;

  componentWillUnmount() {
    if (this._RichEmbedFetchTimer) {
      clearTimeout(this._RichEmbedFetchTimer);
    }
  }

  componentWillMount() {
    // load data on enter
    this.disposeEnter = this.props.navigatorStore.onEnterScreen('Capture', (s) => {
      this.setState({ active: true });
    });

    // clear data on leave
    this.disposeLeave = this.props.navigatorStore.onLeaveScreen('Capture', (s) => {
      this.setState({ active: false });
    });
  }

  render() {

    return (
      <View style={styles.posterAndPreviewWrapper}>

        <View style={styles.posterWrapper}>
          <TextInput
            style={styles.poster}
            editable={true}
            placeholder='Speak your mind...'
            placeholderTextColor='#ccc'
            underlineColorAndroid='transparent'
            onChangeText={this.setText}
            value={this.state.text}
            multiline={true}
          />

          <View style={styles.posterActions}>
            {
              this.state.hasAttachment && !this.state.attachmentGuid ?
                <Progress.Pie progress={this.state.progress} size={36}/>
                :
                <TouchableHighlight
                  underlayColor='#FFF'
                  onPress={() => this.submit()}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>POST</Text>
                </TouchableHighlight>
            }
          </View>
        </View>

        {(this.state.meta || this.state.metaInProgress) && <CaptureMetaPreview
          meta={this.state.meta}
          inProgress={this.state.metaInProgress}
          onRemove={this.clearRichEmbedAction}
        />}

        {this.state.hasAttachment && <View style={styles.preview}>
          <CapturePreview
            uri={this.state.attachmentUri}
            type={this.state.attachmentType}
          />

          <Icon name="md-close" size={36} style={styles.deleteAttachment} onPress={() => this.deleteAttachment()}/>
        </View>}

        {this.state.active &&<CaptureGallery
          style={{ flex: 1 }}
          onSelected={this.onAttachedMedia}
        />}
      </View>
    );
  }

  onAttachedMedia = async (response) => {

    let type = 'image'

    if (!response.width) {
      let extension = 'mp4';
      if (response.path) {
        extension = response.path.split('.').pop();
      }
      type = 'video';
      response.type = 'video/' + extension;
    }

    if (response.didCancel) {
    }
    else if (response.error) {
      alert('ImagePicker Error: ' + response.error);
    }
    else if (response.customButton) {
      //do nothng but leave it for future
    }
    else {

      this.setState({
        hasAttachment: true,
        attachmentUri: response.uri,
        attachmentType: response.type,
      });

      let res;

      try {
        res = await uploadAttachment('api/v1/archive/'+type, {
            uri: response.uri,
            path: response.path||null,
            type: response.type,
            name: response.fileName || 'test'
          },
          (e) => {
            let pct = e.loaded / e.total;

            this.setState({
              'progress': pct
            });
          });

      } catch (e) {
        alert(JSON.stringify(e));
        alert('caught upload error');
        throw e;
      }

      if (!res)
        return;

      this.setState({
        attachmentGuid: res.guid,
        attachmentDone: true
      });

    }

  }

  async deleteAttachment() {
    //TODO: delete from server side

    this.setState({
      attachmentGuid: '',
      hasAttachment: false,
    });
  }

  async submit() {
    if (this.state.hasAttachment && !(this.state.hasAttachment && this.state.attachmentGuid.length > 0)) {
      alert('Please try again in a moment.');
      return false;
    }

    if (!this.state.hasAttachment && !this.state.text) {
      alert('Nothing to post...');
      return false;
    }

    let newPost = { message: this.state.text }
    if (this.props.attachmentGuid) {
      newPost.attachment_guid = this.props.attachmentGuid;
    }
    if (this.state.attachmentGuid)
      newPost.attachment_guid = this.state.attachmentGuid;
    this.setState({
      isPosting: true,
    });

    if (this.state.meta) {
      newPost = Object.assign(newPost, this.state.meta);
    }

    try {
      let response = await post(newPost);

      if (this.props.reset) {
        this.props.reset();
      }

      this.props.onComplete(response.entity);

      this.setState({
        isPosting: false,
        text: '',
        attachmentGuid: '',
        hasAttachment: false,
        meta: null
      });

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

    if (!matches && this.state.hasRichEmbed) {
      this.clearRichEmbed();
    } else if (matches) {
      const url = (!matches[3] ? 'https://' : '') + matches[0];

      if (
        !this.state.hasRichEmbed ||
        (this.state.hasRichEmbed && url.toLowerCase() !== this.state.richEmbedUrl.toLowerCase())
      ) {
        this.clearRichEmbed();
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
}

const styles = StyleSheet.create({
  posterAndPreviewWrapper: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    alignContent: 'stretch',
  },
  posterWrapper: {
    padding: 16,
    minHeight: 100,
    flexDirection: 'row',
  },
  poster: {
    flex: 1,
    maxHeight: 100,
  },
  posterActions: {
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
  },
  posterButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
  },
  preview: {
    flex: 1,
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
  button: {
    margin: 4,
    padding: 8,
    paddingLeft: 16,
    paddingRight: 16,
    alignItems: 'center',
    borderRadius: 3,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  buttonText: {
    color: colors.primary,
    fontSize: 16,
  },
  deleteAttachment: {
    position: 'absolute',
    right: 8,
    top: 0,
    color: '#FFF'
  }
});
