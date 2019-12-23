import React, { Component } from 'react';

import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';

import { observer, inject } from 'mobx-react';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Progress from 'react-native-progress';

import { CommonStyle as CS } from '../../styles/Common';
import sessionService from '../../common/services/session.service';
import imagePicker from '../../common/services/image-picker.service';
import withPreventDoubleTap from '../../common/components/PreventDoubleTap';
import i18n from '../../common/services/i18n.service';
import { UserError } from '../../common/UserError';

const TouchableCustom = withPreventDoubleTap(TouchableOpacity);


@inject('channel', 'user')
@observer
export default class ChannelSetupStep extends Component {

  state = {
    preview_avatar: null,
    preview_banner: null,
    briefdescription: '',
    name: '',
    saving: false,
    dirty: false
  };

  uploads = {
    avatar: null,
    banner: null
  };

  /**
   * Component will mount
   */
  componentWillMount() {
    this.store = this.props.channel.store(sessionService.guid);
    this.setState({
      briefdescription: this.props.user.me.briefdescription,
      name: this.props.user.me.name
    })
  }

  changeAvatarAction = async () => {
    try {
      const response = await imagePicker.show('Select avatar', 'photo');
      if (response) {
        this.selectMedia(response);
      }
    } catch (err) {
      alert(err);
    }
  };

  selectMedia(file) {
    this.setState({
      preview_avatar: file.uri
    });

    this.store.uploadAvatar(file);
    this.uploads['avatar'] = file;
  }

  save = async () => {
    if (this.store.isUploading) throw new UserError('Avatar is uploading, please wait');
    if (!this.state.dirty) return;
    payload = {
      briefdescription: this.state.briefdescription,
      name: this.state.name,
      // avatar: this.uploads.avatar,
    };

    this.setState({saving: true});

    const response = await this.store.save(payload);

    if (response === true) {
      await this.props.user.load(true);
      this.setState({saving: false, edit: false});
      this.uploads = {
        avatar: null,
        banner: null
      };
    } else if (response === false) {
      alert('Error saving channel');
      this.setState({saving: false});
    } else {
      alert(response)
      this.setState({saving: false});
    }
  }

  /**
   * Get Channel Avatar
   */
  getAvatar() {
    if (this.state.preview_avatar) {
      return { uri: this.state.preview_avatar };
    }

    return this.props.user.me.getAvatarSource();
  }

  setBriefdescription = briefdescription => this.setState({ briefdescription, dirty: true });
  setName = name => this.setState({ name, dirty: true });

  /**
   * Render
   */
  render() {
    const hasAvatar = this.props.user.hasAvatar() || this.state.preview_avatar;
    const avatar = this.getAvatar();

    return (
      <View style={CS.marginBottom3x}>
        <View style={[CS.padding4x, CS.flexContainer, CS.rowJustifyStart, CS.alignCenter]}>
          <Text style={[CS.fontXXL, CS.colorDark, CS.fontMedium]}>{i18n.t('onboarding.chooseAvatar')}</Text>
          <View style={[CS.rowJustifyEnd, CS.flexContainer]}>
            <TouchableCustom
              onPress={this.changeAvatarAction}
              style={[styles.avatar, CS.marginLeft3x, CS.border, CS.borderGreyed ]}
              disabled={this.saving}
              testID="selectAvatar"
            >
              {hasAvatar && <Image source={avatar} style={styles.wrappedAvatar} />}

              <View style={[styles.tapOverlayView, hasAvatar ? null : CS.backgroundTransparent]}/>
              <View style={[styles.overlay, CS.centered]}>
                <Icon name="md-cloud-upload" size={40} color={hasAvatar ? '#FFF': '#444'} />
              </View>
              {(this.store.isUploading && this.store.avatarProgress) ? <View style={[styles.tapOverlayView, styles.progress]}>
                <Progress.Pie progress={this.store.avatarProgress} size={36} />
              </View>: null}
            </TouchableCustom>
          </View>
        </View>
        <View style={[CS.padding4x, CS.flexContainer]}>
          <Text style={[CS.fontXXL, CS.colorDark, CS.fontMedium]}>{i18n.t('onboarding.chooseName')}</Text>
          <TextInput
            style={[CS.borderHair, CS.borderDarkGreyed, CS.borderRadius10x, CS.fontXL, CS.padding2x, CS.fontHairline, CS.marginTop4x]}
            placeholder="eg. John Smith"
            value={this.state.name}
            onChangeText={this.setName}
          />
        </View>
        <View style={[CS.padding4x, CS.flexContainer]}>
          <Text style={[CS.fontXXL, CS.colorDark, CS.fontMedium]}>{i18n.t('onboarding.describeChannel')}</Text>
          <TextInput
            style={[CS.borderHair, CS.borderDarkGreyed, CS.borderRadius10x, CS.fontXL, CS.padding2x, CS.fontHairline, CS.marginTop4x]}
            placeholder="eg. Independent Journalist"
            value={this.state.briefdescription}
            onChangeText={this.setBriefdescription}
          />
        </View>
      </View>
    );
  }
}


// style
const styles = StyleSheet.create({
  avatar: {
    height: 90,
    width: 90,
    borderRadius: 45
  },
  progress: {
    opacity: 0.8
  },
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  tapOverlayView: {
    position: 'absolute',
    height: 90,
    width: 90,
    borderRadius: 45,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: '#000',
    opacity: 0.12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  wrappedAvatar: {
    height: 90,
    width: 90,
    borderRadius: 45
  }
});
