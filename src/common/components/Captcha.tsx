import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { View, Image, StyleSheet, TextInput, Text } from 'react-native';
import { observer, useLocalStore } from 'mobx-react';
import Modal from 'react-native-modal';
import { toJS } from 'mobx';

import api from '../services/api.service';
import type { ApiResponse } from '../services/api.service';
import ThemedStyles from '../../styles/ThemedStyles';
import i18n from '../services/i18n.service';
import { Icon } from 'react-native-elements';
import { DARK_THEME } from '../../styles/Colors';
import i18nService from '../services/i18n.service';
import InputContainer from './InputContainer';

const backgroundPrimary = { backgroundColor: DARK_THEME.primary_background };
const backgroundSecondary = {
  backgroundColor: DARK_THEME.secondary_background,
  borderColor: DARK_THEME.borderColorPrimary,
};

interface CaptchaResponse extends ApiResponse {
  base64_image: string;
  jwt_token: string;
}

type PropsType = {
  onResult: (result: string) => void;
  testID?: string;
};

/**
 * Captcha
 */
const Captcha = observer(
  forwardRef((props: PropsType, ref: any) => {
    const theme = ThemedStyles.style;

    const store = useLocalStore(() => ({
      show: false,
      error: '',
      captchaImage: { uri: '' as string },
      clientText: '' as string,
      jwtToken: '' as string,
      setText(value: string) {
        store.clientText = value;
      },
      setError(value: string) {
        store.error = value;
      },
      hideModal() {
        store.show = false;
      },
      showModal() {
        store.show = true;
        store.clientText = '';
        store.load();
      },
      send() {
        if (!store.clientText) {
          return;
        }
        props.onResult(
          JSON.stringify({
            jwtToken: store.jwtToken,
            clientText: store.clientText,
          }),
        );
      },
      async load() {
        const response: CaptchaResponse = await api.get('api/v2/captcha');
        store.captchaImage.uri = response.base64_image;
        store.jwtToken = response.jwt_token;
      },
    }));

    useImperativeHandle(ref, () => ({
      show: () => {
        store.showModal();
      },
      hide: () => {
        store.hideModal();
      },
    }));

    const src = toJS(store.captchaImage);

    return (
      <Modal
        avoidKeyboard={true}
        onBackdropPress={store.hideModal}
        isVisible={store.show}
        backdropColor={DARK_THEME.secondary_background}
        backdropOpacity={0.9}
        useNativeDriver={true}
        style={[theme.fullWidth, theme.margin0x, theme.justifyEnd]}
        animationInTiming={100}
        animationOutTiming={100}
        animationOut="fadeOut"
        animationIn="fadeIn">
        <View style={[styles.modal, backgroundPrimary]}>
          <View
            style={[theme.paddingHorizontal4x, theme.rowJustifySpaceBetween]}>
            <Text
              onPress={store.hideModal}
              style={[
                theme.fontXL,
                theme.colorWhite,
                theme.paddingVertical4x,
                theme.textCenter,
              ]}>
              {i18nService.t('close')}
            </Text>
            <Text
              style={[
                theme.fontXL,
                theme.colorWhite,
                theme.paddingVertical4x,
                theme.textCenter,
                theme.bold,
              ]}>
              {i18nService.t('verification')}
            </Text>
            <Text
              onPress={store.send}
              style={[
                theme.fontXL,
                theme.paddingVertical4x,
                theme.textCenter,
                theme.colorLink,
              ]}>
              {i18nService.t('verify')}
            </Text>
          </View>
          {store.captchaImage.uri !== '' && (
            <View
              style={[
                theme.rowJustifyStart,
                theme.alignCenter,
                theme.rowJustifyCenter,
                theme.paddingVertical4x,
              ]}>
              <Image source={src} style={styles.image} />
              <Icon
                name="reload"
                type="material-community"
                underlayColor={ThemedStyles.getColor('primary_background')}
                size={45}
                iconStyle={theme.colorIcon}
                onPress={store.load}
              />
            </View>
          )}
          <InputContainer
            labelStyle={theme.colorWhite}
            containerStyle={backgroundSecondary}
            style={theme.colorWhite}
            placeholder={i18n.t('captcha')}
            onChangeText={store.setText}
            onEndEditing={store.send}
            testID="captchInput"
            autofocus
          />
        </View>
      </Modal>
    );
  }),
);

export default Captcha;

const styles = StyleSheet.create({
  modal: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    justifyContent: 'center',
    paddingBottom: 50,
    flexDirection: 'column',
    width: '100%',
  },
  image: {
    width: 250,
    height: 100,
  },
});
