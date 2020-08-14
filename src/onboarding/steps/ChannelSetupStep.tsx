import React from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
} from 'react-native';
import { observer, useLocalStore } from 'mobx-react';

import i18n from '../../common/services/i18n.service';
import { ScrollView } from 'react-native-gesture-handler';
import Input from '../../common/components/Input';

import OnboardingButtons from '../OnboardingButtons';
import OnboardingBackButton from '../OnboardingBackButton';

import withPreventDoubleTap from '../../common/components/PreventDoubleTap';

import Icon from 'react-native-vector-icons/Ionicons';
import * as Progress from 'react-native-progress';
import ThemedStyles from '../../styles/ThemedStyles';
import LocationAutoSuggest from '../../common/components/LocationAutoSuggest';
import createChannelStore from '../../channel/v2/createChannelStore';
import useCurrentUser from '../../common/hooks/useCurrentUser';

const TouchableCustom = withPreventDoubleTap(TouchableOpacity);

type PropsType = {
  onNext: () => void;
  onBack: () => void;
};

const ChannelSetupStep = observer((props: PropsType) => {
  const store = useLocalStore(() => ({
    phoneNumber: '+1',
    city: '',
    dob: '',
    preview_avatar: null,
    preview_banner: null,
    saving: false,
    dirty: false,
    setPhoneNumber(val: string) {
      store.phoneNumber = val;
    },
    setCity(val: string) {
      store.city = val;
    },
    setBirthDate(val) {
      this.dob = val;
    },
  }));

  const channelStore = useLocalStore(createChannelStore);
  const user = useCurrentUser();
  if (!channelStore.channel && user) {
    channelStore.setChannel(user);
  }

  const next = async () => {
    await channelStore.save({
      dob: store.dob,
      city: store.city,
      phoneNumber: store.phoneNumber,
    });
    props.onNext();
  };

  const hasAvatar = channelStore.channel?.hasAvatar();
  const avatar: ImageSourcePropType = channelStore.channel?.getAvatarSource() as ImageSourcePropType;

  const theme = ThemedStyles.style;
  const containersStyle = [
    theme.rowJustifyCenter,
    theme.backgroundPrimary,
    theme.paddingHorizontal4x,
    theme.paddingVertical4x,
  ];
  return (
    <ScrollView style={styles.inputContainer} keyboardShouldPersistTaps={true}>
      <View style={containersStyle}>
        <View style={[theme.flexContainer, theme.columnAlignCenter]}>
          <OnboardingBackButton onBack={props.onBack} />
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
                  onPress={() => channelStore.upload('avatar')}
                  style={[
                    styles.avatar,
                    theme.marginLeft3x,
                    theme.border,
                    theme.buttonBorder,
                  ]}
                  disabled={channelStore.uploading}
                  testID="selectAvatar">
                  {hasAvatar && avatar && (
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
                  {channelStore.uploading && channelStore.avatarProgress ? (
                    <View style={[styles.tapOverlayView, styles.progress]}>
                      <Progress.Pie
                        progress={channelStore.avatarProgress}
                        size={36}
                      />
                    </View>
                  ) : null}
                </TouchableCustom>
              </View>
            </View>
            <Input
              placeholder={i18n.t('onboarding.infoMobileNumber')}
              onChangeText={store.setPhoneNumber}
              value={store.phoneNumber}
              editable={true}
              optional={true}
              info={i18n.t('onboarding.phoneNumberTooltip')}
              inputType={'phoneInput'}
            />
            <LocationAutoSuggest
              placeholder={i18n.t('onboarding.infoLocation')}
              onChangeText={store.setCity}
              value={store.city}
              editable={true}
              optional={true}
              info={i18n.t('onboarding.locationTooltip')}
              inputStyle={'inputAlone'}
            />
            <Input
              placeholder={i18n.t('onboarding.infoDateBirth')}
              onChangeText={store.setBirthDate}
              value={store.dob}
              editable={true}
              optional={true}
              info={i18n.t('onboarding.dateofBirthTooltip')}
              inputType={'dateInput'}
            />
          </View>
        </View>
      </View>
      <View style={containersStyle}>
        <OnboardingButtons onNext={next} saving={channelStore.uploading} />
      </View>
    </ScrollView>
  );
});

export default ChannelSetupStep;

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
