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
  inject
} from 'mobx-react/native'

import Icon from 'react-native-vector-icons/Ionicons';
import FastImage from 'react-native-fast-image';
import * as Progress from 'react-native-progress';

import { MINDS_CDN_URI } from '../../config/Config';
import abbrev from '../../common/helpers/abbrev';
import ChannelActions from '../ChannelActions';
import { ComponentsStyle } from '../../styles/Components';
import colors from '../../styles/Colors'
import Tags from '../../common/components/Tags';
import api from '../../common/services/api.service';
import i18n from '../../common/services/i18n.service';
import session from '../../common/services/session.service';
import Touchable from '../../common/components/Touchable';
import ChannelBadges from '../badges/ChannelBadges';
import { CommonStyle } from '../../styles/Common';
import imagePicker from '../../common/services/image-picker.service';
import Button from '../../common/components/Button';
import withPreventDoubleTap from '../../common/components/PreventDoubleTap';
import CompleteProfile from './CompleteProfile';

// prevent accidental double tap in touchables
const TouchableHighlightCustom = withPreventDoubleTap(TouchableHighlight);
const TouchableCustom = withPreventDoubleTap(Touchable);
const ButtonCustom = withPreventDoubleTap(Button);

/**
 * Channel Header
 */
@inject('user', 'onboarding')
@observer
export default class ChannelHeader extends Component {

  ActionSheetRef;
  loaded;

  state = {
    preview_avatar: null,
    preview_banner: null,
    briefdescription: '',
    name: '',
    saving: false,
    edit: false
  };

  uploads = {
    avatar: null,
    banner: null
  };

  /**
   * Get Channel Banner
   */
  getBannerFromChannel() {
    if (this.state.preview_banner) {
      return {uri: this.state.preview_banner};
    }

    return this.props.store.channel.getBannerSource();
  }

  /**
   * Get Channel Avatar
   */
  getAvatar() {
    if (this.state.preview_avatar) {
      return { uri: this.state.preview_avatar };
    }

    return this.props.store.channel.getAvatarSource('large');
  }

  /**
   * Navigate To conversation
   */
  _navToConversation() {
    if (this.props.navigation) {
      this.props.navigation.push('Conversation', { conversation: { guid : this.props.store.channel.guid + ':' + session.guid } });
    }
  }

  _navToSubscribers() {
    if (this.props.navigation) {
      this.props.navigation.push('Subscribers', { guid : this.props.store.channel.guid });
    }
  }

  componentDidMount() {
    const isOwner = session.guid === this.props.store.channel.guid;
    if(isOwner) this.props.onboarding.getProgress();
  }

  onEditAction = async () => {
    let editing = this.state.edit,
      payload = null;

    if (editing) {
      payload = {
        briefdescription: this.state.briefdescription,
        name: this.state.name,
        avatar: this.uploads.avatar,
        banner: this.uploads.banner,
      };

      this.setState({saving: true});

      const response = await this.props.store.save(payload);

      if (response === true) {
        this.props.user.load();
        this.setState({saving: false, edit: false});
        this.uploads = {
          avatar: null,
          banner: null
        };
      } else if (response === false) {
        alert(i18n.t('channel.errorSaving'));
        this.setState({saving: false});
      } else {
        alert(response)
        this.setState({saving: false});
      }
    } else {
      this.setState({
        edit: true,
        preview_avatar: null,
        preview_banner: null,
        briefdescription: this.props.store.channel.briefdescription,
        name: this.props.store.channel.name
      });
    }
  }

  /**
   * Get Action Button, Message or Subscribe
   */
  getActionButton() {
    const styles  = this.props.styles;
    if (!this.props.store.loaded && session.guid !== this.props.store.channel.guid )
      return null;
    if (session.guid === this.props.store.channel.guid) {
      return (
        <ButtonCustom
          onPress={this.onEditAction}
          accessibilityLabel={this.state.edit ? i18n.t('channel.saveChanges') : i18n.t('channel.editChannel')}
          text={this.state.edit ? i18n.t('save').toUpperCase() : i18n.t('edit').toUpperCase()}
          loading={this.state.saving}
        />
      );
    } else if (!!this.props.store.channel.subscribed) {
      return (
        <TouchableHighlightCustom
          onPress={() => { this._navToConversation() }}
          underlayColor='transparent'
          style={[ComponentsStyle.button, ComponentsStyle.buttonAction, styles.bluebutton]}
          accessibilityLabel={i18n.t('channel.sendMessage')}
        >
          <Text style={{ color: colors.primary }} > {i18n.t('channel.message')}  </Text>
        </TouchableHighlightCustom>
      );
    } else if (session.guid !== this.props.store.channel.guid) {
      return (
        <TouchableHighlightCustom
          onPress={() => { this.subscribe() }}
          underlayColor='transparent'
          style={[ComponentsStyle.button, ComponentsStyle.buttonAction, styles.bluebutton]}
          accessibilityLabel={i18n.t('channel.subscribeMessage')}
        >
          <Text style={{ color: colors.primary }} > {i18n.t('channel.subscribe').toUpperCase()} </Text>
        </TouchableHighlightCustom>
      );
    } else if (this.props.store.isUploading) {
      return (
        <ActivityIndicator size="small" />
      )
    }
  }

  subscribe() {
    this.props.store.channel.toggleSubscription();
  }

  changeBannerAction = async () => {
    imagePicker.show(i18n.t('channel.selectBanner'), 'photo')
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
    if (!this.state.edit) return;
    imagePicker.show(i18n.t('channel.selectAvatar'), 'photo')
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
    const isOwner = session.guid === this.props.store.channel.guid;
    const channel = this.props.store.channel;
    const styles  = this.props.styles;
    const avatar  = this.getAvatar();
    const iurl = this.getBannerFromChannel();
    const isUploading = this.props.store.isUploading;
    const isEditable = this.state.edit && !isUploading;

    const ImageCmp = this.state.preview_banner ? Image : FastImage;

    return (
      <View>
        <TouchableCustom onPress={this.changeBannerAction} disabled={!isEditable}>
          <ImageCmp source={iurl} style={styles.banner} resizeMode={FastImage.resizeMode.cover} />

          {isEditable && <View style={styles.tapOverlayView}>
            <Icon name="md-create" size={30} color="#fff" />
          </View>}
          {(isUploading && this.props.store.bannerProgress) ? <View style={styles.tapOverlayView}>
            <Progress.Pie progress={this.props.store.bannerProgress} size={36} />
          </View>:null}
        </TouchableCustom>

        <ChannelBadges channel={channel} style={{position: 'absolute', right: 5, top: 160}} />

        <View style={styles.headertextcontainer}>
          <View style={styles.countercontainer}>
            <TouchableHighlightCustom underlayColor="transparent" style={[styles.counter]} onPress={() => { this._navToSubscribers() }}>
              <View style={styles.counter}>
                <Text style={styles.countertitle}>{i18n.t('subscribers').toUpperCase()}</Text>
                <Text style={styles.countervalue}>{abbrev(channel.subscribers_count, 0)}</Text>
              </View>
            </TouchableHighlightCustom>
            <View style={styles.counter}>
              <Text style={styles.countertitle}>{i18n.t('views').toUpperCase()}</Text>
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
                    {channel.name}
                  </Text>
                </View>}
              <Text style={styles.username}>@{channel.username}</Text>
            </View>
            <View style={styles.buttonscol}>
              { !channel.blocked && this.getActionButton() }
              { session.guid !== channel.guid?
                <ChannelActions navigation={this.props.navigation} store={this.props.store} me={session}></ChannelActions> : <View></View>
              }
            </View>
          </View>
          {isEditable && <View style={styles.briefdescriptionTextInputView}>
            <TextInput
              placeholder={i18n.t('channel.briefDescription')}
              multiline={true}
              underlineColorAndroid='transparent'
              style={styles.briefdescriptionTextInput}
              value={this.state.briefdescription}
              onChangeText={this.setBriefdescription}
            />
          </View>}
          {!isEditable &&
            <View style={CommonStyle.paddingTop2x}>
              <Tags navigation={this.props.navigation}>{channel.briefdescription}</Tags>
            </View>
          }
        </View>

        <TouchableCustom onPress={this.changeAvatarAction} style={styles.avatar} disabled={!isEditable}>
          <Image source={avatar} style={styles.wrappedAvatar} />

          {isEditable && <View style={[styles.tapOverlayView, styles.wrappedAvatarOverlayView]}>
            <Icon name="md-create" size={30} color="#fff" />
          </View>}
          {(isUploading && this.props.store.avatarProgress) ? <View style={[styles.tapOverlayView, styles.wrappedAvatarOverlayView]}>
            <Progress.Pie progress={this.props.store.avatarProgress} size={36} />
          </View>: null}
        </TouchableCustom>
        {isOwner && this.props.onboarding.percentage < 1 ? <CompleteProfile progress={this.props.onboarding.percentage}/>: null}
      </View>
    )
  }
}
