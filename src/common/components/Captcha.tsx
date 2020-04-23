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

interface CaptchaResponse extends ApiResponse {
  base64_image: string;
  jwt_token: string;
}

type PropsType = {
  onResult: (result: string) => void;
};

/**
 * Captcha
 */
const Captcha = observer(
  forwardRef((props: PropsType, ref: any) => {
    const theme = ThemedStyles.style;
    const inputRef = useRef<TextInput>(null);

    const store = useLocalStore(() => ({
      show: false,
      captchaImage: { uri: '' as string },
      clientText: '' as string,
      jwtToken: '' as string,
      setText(value: string) {
        store.clientText = value;
      },
      hideModal() {
        store.show = false;
      },
      showModal() {
        store.show = true;
        store.clientText = '';
        store.load();
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }, 500);
      },
      send() {
        store.show = false;
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
    }));

    const src = toJS(store.captchaImage);

    return (
      <Modal
        avoidKeyboard={true}
        onBackdropPress={store.hideModal}
        isVisible={store.show}
        backdropColor={ThemedStyles.getColor('secondary_background')}
        backdropOpacity={0.9}
        useNativeDriver={true}
        animationInTiming={100}
        animationOutTiming={100}
        animationOut="fadeOut"
        animationIn="fadeIn">
        <View style={[styles.modal, theme.backgroundPrimary, theme.padding]}>
          <Text style={[theme.fontXL, theme.paddingBottom2x, theme.textCenter]}>
            Captcha
          </Text>
          {store.captchaImage.uri !== '' && (
            <View
              style={[
                theme.rowJustifyStart,
                theme.alignCenter,
                theme.rowJustifySpaceBetween,
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
          <TextInput
            placeholder={i18n.t('captcha')}
            ref={inputRef}
            placeholderTextColor={ThemedStyles.getColor('tertiary_text')}
            onChangeText={store.setText}
            onEndEditing={store.send}
            testID="captchInput"
            style={[theme.input, theme.marginTop2x]}
          />
        </View>
      </Modal>
    );
  }),
);

export default Captcha;

const styles = StyleSheet.create({
  modal: {
    borderRadius: 5,
    justifyContent: 'center',
    height: 240,
    flexDirection: 'column',
    width: '100%',
  },
  image: {
    width: 250,
    height: 100,
  },
});
