import { observer, useLocalStore } from 'mobx-react';
import React from 'react';
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Progress from 'react-native-progress';
import Icon from 'react-native-vector-icons/Ionicons';

import Button from '../../../common/components/Button';
import InputContainer from '../../../common/components/InputContainer';
import useCurrentUser from '../../../common/hooks/useCurrentUser';
import i18n from '../../../common/services/i18n.service';
import NavigationService from '../../../navigation/NavigationService';
import ThemedStyles from '../../../styles/ThemedStyles';
import ModalContainer from './ModalContainer';
import withPreventDoubleTap from '../../../common/components/PreventDoubleTap';
import createChannelStore from '../../../channel/v2/createChannelStore';
import DismissKeyboard from '../../../common/components/DismissKeyboard';
import BottomButtonOptions, {
  ItemType,
} from '../../../common/components/BottomButtonOptions';
const TouchableCustom = withPreventDoubleTap(TouchableOpacity);

/**
 * Verify Email Modal Screen
 */
export default observer(function SetupChannelScreen() {
  const theme = ThemedStyles.style;
  const user = useCurrentUser();

  const hasAvatar = user?.hasAvatar();
  const avatar = user?.getAvatarSource() as ImageSourcePropType;
  const channelStore = useLocalStore(createChannelStore);

  const store = useLocalStore(() => ({
    name: user?.name || '',
    bio: user?.briefdescription || '',
    showAvatarPicker: false,
    showPicker() {
      store.showAvatarPicker = true;
    },
    hidePicker() {
      store.showAvatarPicker = false;
    },
    setName(value: string) {
      store.name = value;
    },
    setBio(value: string) {
      store.bio = value;
    },
  }));

  const avatarOptions: Array<ItemType> = [
    {
      title: i18n.t('takePhoto'),
      titleStyle: theme.fontXXL,
      onPress: () => {
        channelStore.upload('avatar', true);
        store.hidePicker();
      },
    },
    {
      title: i18n.t('uploadPhoto'),
      titleStyle: theme.fontXXL,
      onPress: () => {
        channelStore.upload('avatar', false);
        store.hidePicker();
      },
    },
    {
      title: i18n.t('cancel'),
      titleStyle: theme.colorSecondaryText,
      onPress: store.hidePicker,
    },
  ];

  return (
    <ModalContainer
      title={i18n.t('onboarding.setupChannel')}
      onPressBack={NavigationService.goBack}>
      <DismissKeyboard >
        <View style={theme.flexContainer}>
          <InputContainer
            placeholder={i18n.t('channel.edit.displayName')}
            onChangeText={store.setName}
            value={store.name}
            noBottomBorder
          />
          <InputContainer
            placeholder={i18n.t('channel.edit.bio')}
            onChangeText={store.setBio}
            multiline={true}
            scrollEnabled={false}
            value={store.bio}
          />
          <View
            pointerEvents="box-only"
            style={[
              theme.paddingLeft4x,
              theme.backgroundSecondary,
              theme.borderBottom,
              theme.borderPrimary,
            ]}>
            <Text
              style={[
                theme.fontL,
                theme.colorSecondaryText,
                theme.paddingVertical2x,
              ]}>
              Avatar
            </Text>
            <TouchableCustom
              onPress={store.showPicker}
              style={[
                styles.avatar,
                theme.border,
                theme.buttonBorder,
                theme.marginBottom2x,
              ]}
              disabled={channelStore.uploading}
              testID="selectAvatar">
              {hasAvatar && avatar && (
                <Image source={avatar} style={styles.avatar} />
              )}

              <View
                style={[
                  styles.tapOverlayView,
                  styles.avatar,
                  hasAvatar ? null : theme.backgroundPrimaryText,
                ]}
              />
              <View
                style={[
                  StyleSheet.absoluteFill,
                  styles.avatar,
                  theme.centered,
                ]}>
                <Icon
                  name="add-sharp"
                  size={32}
                  style={[
                    theme.centered,
                    hasAvatar ? styles.icon : theme.colorBackgroundPrimary,
                  ]}
                />
              </View>
              {channelStore.uploading && channelStore.avatarProgress ? (
                <View
                  style={[
                    styles.tapOverlayView,
                    styles.avatar,
                    styles.progress,
                  ]}>
                  <Progress.Pie
                    progress={channelStore.avatarProgress}
                    size={36}
                  />
                </View>
              ) : null}
            </TouchableCustom>
          </View>
          <View style={theme.flexContainer} />
          <View style={theme.paddingHorizontal4x}>
            <Button
              onPress={NavigationService.goBack}
              text={i18n.t('save')}
              containerStyle={[
                theme.transparentButton,
                theme.paddingVertical3x,
                theme.fullWidth,
                theme.marginTop,
                theme.borderPrimary,
              ]}
              textStyle={theme.buttonText}
            />
          </View>
        </View>
      </DismissKeyboard>
      <BottomButtonOptions
        list={avatarOptions}
        isVisible={store.showAvatarPicker}
      />
    </ModalContainer>
  );
});

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
  icon: {
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.35)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 2.22,
  },
  avatar: {
    height: 70,
    width: 70,
    borderRadius: 35,
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
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
