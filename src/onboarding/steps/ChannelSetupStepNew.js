import React, { Component } from 'react';

import {View, Text, TouchableHighlight, StyleSheet, TouchableOpacity, Image} from 'react-native';
import { observer, inject } from 'mobx-react';

import { CommonStyle as CS } from '../../styles/Common';
import i18n from '../../common/services/i18n.service';
import { ComponentsStyle } from '../../styles/Components';
import { ScrollView } from 'react-native-gesture-handler';
import Input from '../../common/components/Input';

import OnboardingButtons from '../OnboardingButtons';
import OnboardingBackButton from '../OnboardingBackButton';

import sessionService from '../../common/services/session.service';
import imagePicker from '../../common/services/image-picker.service';
import withPreventDoubleTap from '../../common/components/PreventDoubleTap';
import { UserError } from '../../common/UserError';

import Icon from 'react-native-vector-icons/Ionicons';
import * as Progress from 'react-native-progress';

const TouchableCustom = withPreventDoubleTap(TouchableOpacity);

@inject('channel', 'user')
@observer
export default class ChannelSetupStepNew extends Component {
  state = {
    phoneNumber: '+1',
    location: '',
    birthDate: '',
    preview_avatar: null,
    preview_banner: null,
    saving: false,
    dirty: false
  };

  uploads = {
    avatar: null,
    banner: null
  };

  store;

  constructor(props) {
    super(props);
    this.store = this.props.channel.store(sessionService.guid); 
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

  getAvatar() {
    if (this.state.preview_avatar) {
      return { uri: this.state.preview_avatar };
    }

    return this.props.user.me.getAvatarSource();
  }

  setPhoneNumber = phoneNumber => this.setState({phoneNumber});
  setLocation = location => this.setState({location});
  setBirthDate = birthDate => this.setState({birthDate});

  save = async () => {
    if (this.store.isUploading) throw new UserError('Avatar is uploading, please wait');
    if (!this.state.dirty) return;

    const {phoneNumber, location, birthDate} = this.state;

    payload = {
      phoneNumber,
      location,
      birthDate
    };

    this.setState({saving: true});

    const response = await this.store.save(payload);

    if (response === true) {
      await this.props.user.load(true);
      this.setState({saving: false});
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

  getBody = () => {
    const hasAvatar = this.props.user.hasAvatar() || this.state.preview_avatar;
    const avatar = this.getAvatar();
    return (
      <View style={[CS.flexContainer, CS.columnAlignCenter]}>
        <OnboardingBackButton onBack={this.props.onBack} />
        <View style={[styles.textsContainer]}>
          <Text style={[CS.onboardingTitle, CS.marginBottom2x]}>{i18n.t('onboarding.profileSetup')}</Text>
          <Text style={[CS.titleText, CS.colorPrimaryText]}>{i18n.t('onboarding.infoTitle')}</Text>
          <Text style={[CS.subTitleText, CS.colorSecondaryText]}>{i18n.t('onboarding.step',{step: 2, total: 4})}</Text>
        </View>
        <ScrollView style={styles.inputContainer}>
          <View style={[CS.padding4x, CS.flexContainer, CS.rowJustifyStart, CS.alignCenter, CS.marginBottom2x, CS.marginTop2x]}>
            <Text style={[CS.fontXXL, CS.colorSecondaryText, CS.fontMedium]}>{i18n.t('onboarding.chooseAvatar')}</Text>
            <View style={[CS.rowJustifyEnd, CS.flexContainer]}>
              <TouchableCustom
                onPress={this.changeAvatarAction}
                style={[styles.avatar, CS.marginLeft3x, CS.border, CS.borderButton ]}
                disabled={this.saving}
                testID="selectAvatar"
              >
                {hasAvatar && <Image source={avatar} style={styles.wrappedAvatar} />}

                <View style={[styles.tapOverlayView, hasAvatar ? null : CS.backgroundTransparent]}/>
                <View style={[styles.overlay, CS.centered]}>
                  <Icon name="md-cloud-upload" size={40} style={hasAvatar ? CS.colorWhite: CS.colorButton} />
                </View>
                {(this.store.isUploading && this.store.avatarProgress) ? <View style={[styles.tapOverlayView, styles.progress]}>
                  <Progress.Pie progress={this.store.avatarProgress} size={36} />
                </View>: null}
              </TouchableCustom>
            </View>
          </View>
          <Input
            placeholder={i18n.t('onboarding.infoMobileNumber')}
            onChangeText={this.setPhoneNumber}
            onEndEditing={(e) => console.log(e.nativeEvent.text)}
            value={this.state.phoneNumber}
            editable={true}
            optional={true}
            info={"Info"}
            inputType={'phoneInput'}
          />
          <Input
            placeholder={i18n.t('onboarding.infoLocation')}
            onChangeText={this.setLocation}
            value={this.state.location}
            editable={true}
            optional={true}
            info={"No Info"}
          />
          <Input
            placeholder={i18n.t('onboarding.infoDateBirth')}
            onChangeText={this.setBirthDate}
            value={this.state.birthDate}
            editable={true}
            optional={true}
            info={"No Info"}
            inputType={'dateInput'}
          />
        </ScrollView>
      </View>
    );
  };

  getFooter = () => {
    return <OnboardingButtons onNext={this.props.onNext} />;
  };

  render() {
    return (
      <View style={[CS.flexContainerCenter]}>
        <View style={[CS.mindsLayoutBody, CS.backgroundThemePrimary]}>
          {this.getBody()}
        </View>
        <View style={[CS.mindsLayoutFooter, CS.backgroundThemePrimary]}>
          {this.getFooter()}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  containerButton: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  inputContainer: {
    width: '100%',
  },
  textsContainer: {
    alignItems: 'center',
  },
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