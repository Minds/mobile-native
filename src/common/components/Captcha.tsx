import React, { forwardRef, useImperativeHandle } from 'react';
import { View, Image } from 'react-native';
import { observer, useLocalStore } from 'mobx-react';
import Modal from 'react-native-modal';
import { toJS } from 'mobx';

import api from '../services/api.service';
import type { ApiResponse } from '../services/api.service';
import ThemedStyles from '../../styles/ThemedStyles';
import i18n from '../services/i18n.service';
import { Icon } from 'react-native-elements';
import i18nService from '../services/i18n.service';
import InputContainer from './InputContainer';
import MText from './MText';

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
        backdropColor={ThemedStyles.getColor('Black')}
        backdropOpacity={0.9}
        useNativeDriver={true}
        style={styles.modalContainer}
        animationInTiming={100}
        animationOutTiming={100}
        animationOut="fadeOut"
        animationIn="fadeIn">
        <View style={styles.modal}>
          <View style={styles.header}>
            <MText onPress={store.hideModal} style={styles.textClose}>
              {i18nService.t('close')}
            </MText>
            <MText style={styles.textVerification}>
              {i18nService.t('verification')}
            </MText>
            <MText onPress={store.send} style={styles.textSend}>
              {i18nService.t('verify')}
            </MText>
          </View>
          {store.captchaImage.uri !== '' && (
            <View style={styles.imageContainer}>
              <Image source={src} style={styles.image} />
              <Icon
                name="reload"
                type="material-community"
                underlayColor={ThemedStyles.getColor('PrimaryBackground')}
                size={45}
                iconStyle={theme.colorIcon}
                onPress={store.load}
              />
            </View>
          )}
          <InputContainer
            labelStyle={theme.colorPrimaryText}
            containerStyle={styles.inputContainer}
            style={theme.colorPrimaryText}
            placeholder={i18n.t('captcha')}
            onChangeText={store.setText}
            onEndEditing={store.send}
            testID="captchaInput"
            autofocus
          />
        </View>
      </Modal>
    );
  }),
);

export default Captcha;

const styles = ThemedStyles.create({
  modalContainer: ['fullWidth', 'margin0x', 'justifyEnd'],
  textVerification: [
    'fontXL',
    'colorPrimaryText',
    'paddingVertical4x',
    'textCenter',
    'bold',
  ],
  textClose: ['fontXL', 'colorPrimaryText', 'paddingVertical4x', 'textCenter'],
  textSend: ['fontXL', 'paddingVertical4x', 'textCenter', 'colorLink'],
  imageContainer: [
    'rowJustifyStart',
    'alignCenter',
    'rowJustifyCenter',
    'paddingVertical4x',
  ],
  header: ['paddingHorizontal4x', 'rowJustifySpaceBetween'],
  inputContainer: ['bgSecondaryBackground', 'bcolorPrimaryBorder'],
  modal: [
    'bgPrimaryBackground',
    {
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      justifyContent: 'center',
      paddingBottom: 50,
      flexDirection: 'column',
      width: '100%',
    },
  ],
  image: {
    width: 250,
    height: 100,
  },
});
