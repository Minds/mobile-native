import { observer, useLocalStore } from 'mobx-react';
import React, { useRef } from 'react';
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

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
import { showNotification } from '../../../../AppMessages';
import sessionService from '../../../common/services/session.service';
import { Flow } from 'react-native-animated-spinkit';
import MText from '../../../common/components/MText';
const TouchableCustom = withPreventDoubleTap(TouchableOpacity);

/**
 * Verify Email Modal Screen
 */
export default observer(function SetupChannelScreen() {
  const theme = ThemedStyles.style;
  const user = useCurrentUser();

  const hasAvatar = user?.hasAvatar();
  const channelStore = useLocalStore(createChannelStore);
  const avatar = (channelStore.uploading
    ? { uri: channelStore.avatarPath }
    : user?.getAvatarSource()) as ImageSourcePropType;

  const store = useLocalStore(() => ({
    name: user?.name || '',
    bio: user?.briefdescription || '',
    showAvatarPicker: false,
    saving: false,
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
    async save() {
      store.saving = true;
      try {
        await channelStore.save({
          briefdescription: store.bio,
          name: store.name,
        });
      } catch (error) {
        showNotification(i18n.t('errorMessage'));
      } finally {
        store.saving = false;
      }
      NavigationService.goBack();
    },
  }));

  const avatarOptions: Array<Array<ItemType>> = useRef([
    [
      {
        title: i18n.t('takePhoto'),
        titleStyle: theme.fontXXL,
        onPress: async () => {
          await channelStore.upload('avatar', true, () => store.hidePicker());
          await sessionService.loadUser();
        },
      },
      {
        title: i18n.t('uploadPhoto'),
        titleStyle: theme.fontXXL,
        onPress: async () => {
          await channelStore.upload('avatar', false, () => store.hidePicker());
          await sessionService.loadUser();
        },
      },
    ],
    [
      {
        title: i18n.t('cancel'),
        titleStyle: theme.colorSecondaryText,
        onPress: store.hidePicker,
      },
    ],
  ]).current;

  return (
    <ModalContainer
      title={i18n.t('onboarding.setupChannel')}
      onPressBack={NavigationService.goBack}>
      <DismissKeyboard>
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
            style={[
              theme.paddingLeft4x,
              theme.bgSecondaryBackground,
              theme.borderBottom,
              theme.bcolorPrimaryBorder,
            ]}>
            <MText
              style={[
                theme.fontL,
                theme.colorSecondaryText,
                theme.paddingVertical2x,
              ]}>
              Avatar
            </MText>
            <TouchableCustom
              onPress={store.showPicker}
              style={[styles.avatar, theme.marginBottom2x]}
              disabled={channelStore.uploading}
              testID="selectAvatar">
              {hasAvatar && avatar && (
                <Image source={avatar} style={styles.avatar} />
              )}

              <View
                style={[
                  styles.tapOverlayView,
                  styles.avatar,
                  hasAvatar ? null : theme.bgPrimaryText,
                ]}
              />
              <View
                style={[
                  StyleSheet.absoluteFill,
                  styles.avatar,
                  theme.centered,
                ]}>
                {!channelStore.uploading && (
                  <Icon
                    name="add"
                    size={32}
                    style={
                      hasAvatar ? styles.icon : theme.colorPrimaryBackground
                    }
                  />
                )}
              </View>
              {channelStore.uploading && channelStore.avatarProgress ? (
                <View style={[styles.tapOverlayView, theme.centered]}>
                  <Flow color={ThemedStyles.getColor('Link')} />
                </View>
              ) : null}
            </TouchableCustom>
          </View>
          <View style={theme.flexContainer} />
          <View style={[theme.paddingHorizontal4x, theme.marginBottom2x]}>
            <Button
              loading={store.saving}
              onPress={store.save}
              text={i18n.t('save')}
              containerStyle={[
                theme.transparentButton,
                theme.paddingVertical3x,
                theme.fullWidth,
                theme.marginTop,
                theme.bcolorPrimaryBorder,
              ]}
              textStyle={theme.buttonText}
            />
          </View>
        </View>
      </DismissKeyboard>
      <BottomButtonOptions
        list={avatarOptions}
        isVisible={store.showAvatarPicker}
        onPressClose={store.hidePicker}
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
    textShadowColor: 'rgba(0, 0, 0, 0.45)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2.22,
  },
  avatar: {
    height: 70,
    width: 70,
    borderRadius: 35,
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
