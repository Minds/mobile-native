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
import imagePicker from '../../common/services/image-picker.service';
import Button from '../../common/components/Button';
import withPreventDoubleTap from '../../common/components/PreventDoubleTap';

// prevent accidental double tap in touchables
const TouchableHighlightCustom = withPreventDoubleTap(TouchableHighlight);
const TouchableCustom = withPreventDoubleTap(Touchable);
const ButtonCustom = withPreventDoubleTap(Button);

/**
 * Channel Header
 */
@observer
export default class ChannelHeader extends Component {

  ActionSheetRef;
  loaded;

  state = {
    preview_avatar: null,
    preview_banner: null,
    briefdescription: '',
    name: '',
    saving: false
  };

  uploads = {
    avatar: null,
    banner: null
  };

  /** 
   * Component will mount
   */
  componentWillMount() {
    const channel = toJS(this.props.channel.channel);
    this.loaded = false;

    if (channel) {
      this.updateEditable(channel);
      this.loaded = true;
    }
  }

  /**
   * Component will receive props
   * @param {object} nextProps 
   */
  componentWillReceiveProps(nextProps) {
    const channel = toJS(nextProps.channel.channel);

    if (channel && !this.loaded) {
      this.updateEditable(channel);
      this.loaded = true;
    }
  }

  /**
   * Update state
   * @param {object} channel 
   */
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
      return {uri: this.state.preview_banner};
    }

    return this.props.channel.channel.getBannerSource();
  }

  /**
   * Get Channel Avatar
   */
  getAvatar() {
    if (this.state.preview_avatar) {
      return { uri: this.state.preview_avatar };
    }

    return this.props.channel.channel.getAvatarSource();
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

  onEditAction = async () => {
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
      this.setState({saving: true});
    }

    await this.props.onEdit(payload);
    
    if (this.state.saving) this.setState({saving: false});
  }

  /**
   * Get Action Button, Message or Subscribe
   */
  getActionButton() {
    const styles  = this.props.styles;
    if (!this.props.channel.loaded && this.props.me.guid !== this.props.channel.channel.guid )
      return null;
    if (this.props.me.guid === this.props.channel.channel.guid) {
      return (
        <ButtonCustom
          onPress={this.onEditAction}
          accessibilityLabel={this.props.edit ? 'Save your changes' : 'Edit your channel settings'}
          text={this.props.edit ? 'SAVE' : 'EDIT'}
          loading={this.state.saving}
        />
      );
    } else if (!!this.props.channel.channel.subscribed) {
      return (
        <TouchableHighlightCustom
          onPress={() => { this._navToConversation() }}
          underlayColor='transparent'
          style={[ComponentsStyle.button, ComponentsStyle.buttonAction, styles.bluebutton]}
          accessibilityLabel="Send a message to this channel"
        >
          <Text style={{ color: colors.primary }} > MESSAGE </Text>
        </TouchableHighlightCustom>
      );
    } else if (this.props.me.guid !== this.props.channel.channel.guid) {
      return (
        <TouchableHighlightCustom
          onPress={() => { this.subscribe() }}
          underlayColor='transparent'
          style={[ComponentsStyle.button, ComponentsStyle.buttonAction, styles.bluebutton]}
          accessibilityLabel="Subscribe to this channel"
        >
          <Text style={{ color: colors.primary }} > SUBSCRIBE </Text>
        </TouchableHighlightCustom>
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
    imagePicker.show('Select banner', 'photo')
      .then(response => {
        if (response) {
          this.selectMedia('banner', response);
        }
      }) 
      .catch(err => {
        alert(err);
      });
  };

  changeAvatarAction = async () => {
    imagePicker.show('Select avatar', 'photo')
      .then(response => {
        if (response) {
          this.selectMedia('avatar', response);
        }
      }) 
      .catch(err => {
        alert(err);
      });
  };

  selectMedia(type, file) {
    this.setState({
      [`preview_${type}`]: file.uri
    });

    this.uploads[type] = file;
  }

  setBriefdescription = briefdescription => this.setState({ briefdescription });
  setName = name => this.setState({ name });

  /**
   * Render Header
   */
  render() {

    const channel = this.props.channel.channel;
    const styles  = this.props.styles;
    const avatar  = this.getAvatar();
    const iurl = this.getBannerFromChannel();
    const isUploading = this.props.channel.isUploading;
    const isEditable = this.props.edit && !isUploading;
    return (
      <View>
        {isEditable && <TouchableCustom onPress={this.changeBannerAction}>
          <Image source={iurl} style={styles.banner} resizeMode={FastImage.resizeMode.cover} />

          <View style={styles.tapOverlayView}>
            <Icon name="md-create" size={30} color="#fff" />
          </View>
        </TouchableCustom>}
        {!isEditable && <Image source={iurl} style={styles.banner} resizeMode={FastImage.resizeMode.cover} />}

        <View style={styles.headertextcontainer}>
          <View style={styles.countercontainer}>
            <TouchableHighlightCustom underlayColor="transparent" style={[styles.counter]} onPress={() => { this._navToSubscribers() }}>
              <View style={styles.counter}>
                <Text style={styles.countertitle}>SUBSCRIBERS</Text>
                <Text style={styles.countervalue}>{abbrev(channel.subscribers_count, 0)}</Text>
              </View>
            </TouchableHighlightCustom>
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
                  <Text 
                    style={styles.name}
                    ellipsizeMode='tail'
                    numberOfLines={1}
                    >
                    {this.state.name}
                  </Text>
                  <ChannelBadges channel={channel} />
                </View>}
              <Text style={styles.username}>@{channel.username}</Text>
            </View>
            <View style={styles.buttonscol}>
              {this.getActionButton()}
              { this.props.me.guid !== this.props.channel.channel.guid?
                <ChannelActions navigation={this.props.navigation} channel={this.props.channel} me={this.props.me}></ChannelActions> : <View></View>
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
          {!isEditable &&
            <View style={CommonStyle.paddingTop2x}>
              <Tags navigation={this.props.navigation}>{this.state.briefdescription}</Tags>
            </View>
          }

        </View>

        {isEditable && <TouchableCustom onPress={this.changeAvatarAction} style={styles.avatar}>
          <Image source={avatar} style={styles.wrappedAvatar} />

          <View style={[styles.tapOverlayView, styles.wrappedAvatarOverlayView]}>
            <Icon name="md-create" size={30} color="#fff" />
          </View>
        </TouchableCustom>}
        {!isEditable && <Image source={avatar} style={styles.avatar} />}

      </View>
    )
  }
}
