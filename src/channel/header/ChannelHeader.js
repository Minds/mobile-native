import React, {
  Component
} from 'react';

import {
  View,
  Text,
  TextInput,
  Image,
  TouchableHighlight,
  ActivityIndicator,
} from 'react-native';

import {
  observer,
} from 'mobx-react/native'

import { toJS } from 'mobx'
import Icon from 'react-native-vector-icons/Ionicons';
import ActionSheet from 'react-native-actionsheet';
import ImagePicker from 'react-native-image-picker';
import FastImage from 'react-native-fast-image';

import { MINDS_CDN_URI } from '../../config/Config';
import abbrev from '../../common/helpers/abbrev';
import ChannelActions from '../ChannelActions';
import { ComponentsStyle } from '../../styles/Components';
import colors from '../../styles/Colors'
import Tags from '../../common/components/Tags';
import api from '../../common/services/api.service';
import Touchable from '../../common/components/Touchable';
import ChannelBadges from '../badges/ChannelBadges';
import { CommonStyle } from '../../styles/Common';


/**
 * Channel Header
 */
@observer
export default class ChannelHeader extends Component {

  ActionSheetRef;
  loaded;

  state = {
    isSelectingMedia: false,
    uploadType: null,
    
    preview_avatar: null,
    preview_banner: null,

    briefdescription: '',
    name: ''
  };

  uploads = {
    avatar: null,
    banner: null
  };

  componentWillMount() {
    const channel = toJS(this.props.channel.channel);
    this.loaded = false;

    if (channel) {
      this.updateEditable(channel);
      this.loaded = true;
    }
  }

  componentWillReceiveProps(nextProps) {
    const channel = toJS(nextProps.channel.channel);

    if (channel && !this.loaded) {
      this.updateEditable(channel);
      this.loaded = true;
    }
  }

  updateEditable(channel) {
    this.setState({
      preview_avatar: null,
      preview_banner: null,
      briefdescription: channel.briefdescription,
      name: channel.name
    });
  }

  /**
   * Get Channel Banner
   */
  getBannerFromChannel() {
    if (this.state.preview_banner) {
      return this.state.preview_banner;
    }

    const channel = this.props.channel.channel;
    if (channel && channel.carousels) {
      return channel.carousels[0].src;
    }

    return MINDS_CDN_URI + 'fs/v1/banners/' + channel.guid + '/fat/' + channel.icontime;
  }

  /**
   * Get Channel Avatar
   */
  getAvatar() {
    if (this.state.preview_avatar) {
      return this.state.preview_avatar;
    }

    const channel = this.props.channel.channel;
    return `${MINDS_CDN_URI}icon/${channel.guid}/large/${channel.icontime}`;
  }

  /**
   * Navigate To conversation
   */
  _navToConversation() {
    if (this.props.navigation) {
      this.props.navigation.navigate('Conversation', { conversation: { guid : this.props.channel.channel.guid + ':' + this.props.me.guid } });
    }
  }

  _navToSubscribers() {
    if (this.props.navigation) {
      this.props.navigation.navigate('Subscribers', { guid : this.props.channel.channel.guid });
    }
  }

  onEditAction = () => {
    let editing = this.props.edit,
      payload = null;

    if (editing) {
      payload = {
        briefdescription: this.state.briefdescription,
        name: this.state.name,
        avatar: this.uploads.avatar,
        banner: this.uploads.banner,
      };

      this.uploads = {
        avatar: null,
        banner: null
      };
    }

    this.props.onEdit(payload);
  }

  /**
   * Get Action Button, Message or Subscribe
   */
  getActionButton() {
    const styles  = this.props.styles;
    if (this.props.me.guid === this.props.channel.channel.guid) {
      return (
        <TouchableHighlight
          onPress={this.onEditAction}
          underlayColor = 'transparent'
          style={[ComponentsStyle.button, ComponentsStyle.buttonAction, styles.bluebutton]}
          accessibilityLabel={this.props.edit ? 'Save your changes' : 'Edit your channel settings'}
        >
          <Text style={{color: colors.primary}}> {this.props.edit ? 'SAVE' : 'EDIT'} </Text>
        </TouchableHighlight>
      );
    } else if (!!this.props.channel.channel.subscribed) {
      return (
        <TouchableHighlight
          onPress={() => { this._navToConversation() }}
          underlayColor='transparent'
          style={[ComponentsStyle.button, ComponentsStyle.buttonAction, styles.bluebutton]}
          accessibilityLabel="Send a message to this channel"
        >
          <Text style={{ color: colors.primary }} > MESSAGE </Text>
        </TouchableHighlight>
      );
    } else if (this.props.me.guid !== this.props.channel.channel.guid) {
      return (
        <TouchableHighlight
          onPress={() => { this.subscribe() }}
          underlayColor='transparent'
          style={[ComponentsStyle.button, ComponentsStyle.buttonAction, styles.bluebutton]}
          accessibilityLabel="Subscribe to this channel"
        >
          <Text style={{ color: colors.primary }} > SUBSCRIBE </Text>
        </TouchableHighlight>
      );
    } else if (this.props.channel.isUploading) {
      return (
        <ActivityIndicator size="small" />
      )
    }
  }

  subscribe() {
    let channel = this.props.channel.channel;
    this.props.channel.subscribe();
  }

  changeBannerAction = async () => {
    if (this.state.isSelectingMedia) {
      return;
    }

    this.setState({ uploadType: 'banner', isSelectingMedia: true });
    setTimeout(() => this.ActionSheetRef.show(), 20);
  };

  changeAvatarAction = async () => {
    if (this.state.isSelectingMedia) {
      return;
    }

    this.setState({ uploadType: 'avatar', isSelectingMedia: true });
    setTimeout(() => this.ActionSheetRef.show(), 20);
  };

  setAvatarOrBannerSource = i => {
    const type = this.state.uploadType;

    switch (i) {
      case 1:
        ImagePicker.launchCamera({
            mediaType: 'photo',
        }, response => {
          try {
            if (response.didCancel) {
              return;
            } else if (response.error) {
              alert('ImagePicker Error: '+ response.error);
            } else if (response.customButton) {
              return;
            }

            this.selectMedia(type, response);
          } catch (e) {
            this.setState({ uploadType: null, isSelectingMedia: false });
          }
        });

        break;

      case 2:
        ImagePicker.launchImageLibrary({}, response => {
          try {
            if (response.didCancel) {
              return;
            } else if (response.error) {
              alert('ImagePicker Error: '+ response.error);
            } else if (response.customButton) {
              return;
            }

            this.selectMedia(type, response);
          } catch (e) {
            this.setState({ uploadType: null, isSelectingMedia: false });
          }
        });

        break;

      default:
        this.setState({ uploadType: null, isSelectingMedia: false });
    }
  };

  selectMedia(type, file) {
    this.setState({
      [`preview_${type}`]: file.uri
    });

    this.uploads[type] = file;
    
    this.setState({ uploadType: null, isSelectingMedia: false });
  }

  setBriefdescription = briefdescription => this.setState({ briefdescription });
  setName = name => this.setState({ name });

  /**
   * Render Header
   */
  render() {

    const channel = this.props.channel.channel;
    const styles  = this.props.styles;
    const avatar  = { uri: this.getAvatar() };
    const iurl = { uri: this.getBannerFromChannel(), headers: api.buildHeaders() };
    const isUploading = this.props.channel.isUploading;
    const isEditable = this.props.edit && !isUploading;
    return (
      <View>
        {isEditable && <Touchable onPress={this.changeBannerAction}>
          <Image source={iurl} style={styles.banner} resizeMode={FastImage.resizeMode.cover} />

          <View style={styles.tapOverlayView}>
            <Icon name="md-create" size={30} color="#fff" />
          </View>
        </Touchable>}
        {!isEditable && <Image source={iurl} style={styles.banner} resizeMode={FastImage.resizeMode.cover} />}

        <View style={styles.headertextcontainer}>
          <View style={styles.countercontainer}>
            <TouchableHighlight underlayColor="transparent" style={[styles.counter]} onPress={() => { this._navToSubscribers() }}>
              <View style={styles.counter}>
                <Text style={styles.countertitle}>SUBSCRIBERS</Text>
                <Text style={styles.countervalue}>{abbrev(channel.subscribers_count, 0)}</Text>
              </View>
            </TouchableHighlight>
            <View style={styles.counter}>
              <Text style={styles.countertitle}>VIEWS</Text>
              <Text style={styles.countervalue}>{abbrev(channel.impressions, 0)}</Text>
            </View>
          </View>
          <View style={styles.namecontainer}>
            <View style={styles.namecol}>
              {isEditable && <TextInput
                placeholder={channel.username}
                underlineColorAndroid='transparent'
                style={styles.nameTextInput}
                value={this.state.name}
                onChangeText={this.setName}
              />}
              {!isEditable &&
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.name}>{this.state.name}</Text>
                  <ChannelBadges channel={channel} />
                </View>}
              <Text style={styles.username}>@{channel.username}</Text>
            </View>
            <View style={styles.buttonscol}>
              {this.getActionButton()}
              { this.props.me.guid !== this.props.channel.channel.guid?
                <ChannelActions channel={this.props.channel} me={this.props.me}></ChannelActions> : <View></View>
              }
            </View>
          </View>

          {isEditable && <View style={styles.briefdescriptionTextInputView}>
            <TextInput
              placeholder="Brief description about you..."
              multiline={true}
              underlineColorAndroid='transparent'
              style={styles.briefdescriptionTextInput}
              value={this.state.briefdescription}
              onChangeText={this.setBriefdescription}
            />
          </View>}
          {!isEditable && <Text style={styles.briefdescription}>
            <Tags navigation={this.props.navigation}>{this.state.briefdescription}</Tags>
          </Text>}

        </View>

        {isEditable && <Touchable onPress={this.changeAvatarAction} style={styles.avatar}>
          <Image source={avatar} style={styles.wrappedAvatar} />

          <View style={[styles.tapOverlayView, styles.wrappedAvatarOverlayView]}>
            <Icon name="md-create" size={30} color="#fff" />
          </View>
        </Touchable>}
        {!isEditable && <Image source={avatar} style={styles.avatar} />}

        <ActionSheet
          title={`Upload ${this.state.uploadType}`}
          ref={ref => this.ActionSheetRef = ref}
          options={[ 'Cancel', 'Camera', 'Gallery' ]}
          onPress={this.setAvatarOrBannerSource}
          cancelButtonIndex={0}
        />

      </View>
    )
  }
}
