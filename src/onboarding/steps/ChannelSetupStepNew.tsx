//@ts-nocheck
import React, { Component } from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { observer, inject } from 'mobx-react';

import i18n from '../../common/services/i18n.service';
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
import ThemedStyles from '../../styles/ThemedStyles';
import remoteAction from '../../common/RemoteAction';

const TouchableCustom = withPreventDoubleTap(TouchableOpacity);

@inject('channel', 'user')
@observer
class ChannelSetupStepNew extends Component {
  state = {
    phoneNumber: '+1',
    city: '',
    dob: '',
    preview_avatar: null,
    preview_banner: null,
    saving: false,
    dirty: false,
  };

  uploads = {
    avatar: null,
    banner: null,
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
      preview_avatar: file.uri,
    });

    this.uploads['avatar'] = file;

    this.store.uploadAvatar(file).catch((e) => {
      this.setState({
        preview_avatar: null,
      });
      this.uploads['avatar'] = null;
      console.log(e);
    });
  }

  getAvatar() {
    if (this.state.preview_avatar) {
      return { uri: this.state.preview_avatar };
    }

    return this.props.user.me.getAvatarSource();
  }

  setPhoneNumber = (phoneNumber) => this.setState({ phoneNumber });
  setCity = (city) => this.setState({ city });
  setBirthDate = (dob) => this.setState({ dob });

  save = async () => {
    if (this.store.isUploading) {
      throw new UserError('Avatar is uploading, please wait');
    }

    const { phoneNumber, city, dob } = this.state;

    const payload = {
      phoneNumber,
      city,
      dob,
    };

    this.setState({ saving: true });

    await remoteAction(
      async () => {
        const response = await this.store.save(payload);
        if (response === true) {
          await this.props.user.load(true);
          this.setState({ saving: false });
          this.uploads = {
            avatar: null,
            banner: null,
          };
        } else if (response === false) {
          Alert.alert('Error saving channel');
          this.setState({ saving: false });
        }
      },
      '',
      0,
      false,
    );
  };

  getBody = () => {
    const theme = ThemedStyles.style;
    const hasAvatar = this.props.user.hasAvatar() || this.state.preview_avatar;
    const avatar = this.getAvatar();
    return (
      <View style={[theme.flexContainer, theme.columnAlignCenter]}>
        <OnboardingBackButton onBack={this.props.onBack} />
        <View style={[styles.textsContainer]}>
          <Text style={[theme.onboardingTitle, theme.marginBottom2x]}>
            {i18n.t('onboarding.profileSetup')}
          </Text>
          <Text style={[theme.titleText, theme.colorPrimaryText]}>
            {i18n.t('onboarding.infoTitle')}
          </Text>
          <Text style={[theme.subTitleText, theme.colorSecondaryText]}>
            {i18n.t('onboarding.step', { step: 2, total: 4 })}
          </Text>
        </View>
        <View style={theme.fullWidth}>
          <View
            style={[
              theme.padding4x,
              theme.flexContainer,
              theme.rowJustifyStart,
              theme.alignCenter,
              theme.marginVertical1x,
            ]}>
            <Text
              style={[
                theme.fontXXL,
                theme.colorSecondaryText,
                theme.fontMedium,
              ]}>
              {i18n.t('onboarding.chooseAvatar')}
            </Text>
            <View style={[theme.rowJustifyEnd, theme.flexContainer]}>
              <TouchableCustom
                onPress={this.changeAvatarAction}
                style={[
                  styles.avatar,
                  theme.marginLeft3x,
                  theme.border,
                  theme.buttonBorder,
                ]}
                disabled={this.saving}
                testID="selectAvatar">
                {hasAvatar && (
                  <Image source={avatar} style={styles.wrappedAvatar} />
                )}

                <View
                  style={[
                    styles.tapOverlayView,
                    hasAvatar ? null : theme.backgroundTransparent,
                  ]}
                />
                <View style={[styles.overlay, theme.centered]}>
                  <Icon
                    name="md-cloud-upload"
                    size={40}
                    style={hasAvatar ? theme.colorWhite : theme.colorButton}
                  />
                </View>
                {this.store.isUploading && this.store.avatarProgress ? (
                  <View style={[styles.tapOverlayView, styles.progress]}>
                    <Progress.Pie
                      progress={this.store.avatarProgress}
                      size={36}
                    />
                  </View>
                ) : null}
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
            info={i18n.t('onboarding.phoneNumberTooltip')}
            inputType={'phoneInput'}
          />
          <Input
            placeholder={i18n.t('onboarding.infoLocation')}
            onChangeText={this.setCity}
            value={this.state.city}
            editable={true}
            optional={true}
            info={i18n.t('onboarding.locationTooltip')}
          />
          <Input
            placeholder={i18n.t('onboarding.infoDateBirth')}
            onChangeText={this.setBirthDate}
            value={this.state.dob}
            editable={true}
            optional={true}
            info={i18n.t('onboarding.dateofBirthTooltip')}
            inputType={'dateInput'}
          />
        </View>
      </View>
    );
  };

  next = async () => {
    await this.save();
    this.props.onNext();
  };

  getFooter = () => {
    return <OnboardingButtons onNext={this.next} saving={this.state.saving} />;
  };

  render() {
    const theme = ThemedStyles.style;
    const containersStyle = [
      theme.rowJustifyCenter,
      theme.backgroundPrimary,
      theme.paddingHorizontal4x,
      theme.paddingVertical4x,
    ];
    return (
      <ScrollView
        style={styles.inputContainer}
        keyboardShouldPersistTaps={true}>
        <View style={containersStyle}>{this.getBody()}</View>
        <View style={containersStyle}>{this.getFooter()}</View>
      </ScrollView>
    );
  }
}

export default ChannelSetupStepNew;

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
    borderRadius: 45,
  },
  progress: {
    opacity: 0.8,
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
    borderRadius: 45,
  },
});
