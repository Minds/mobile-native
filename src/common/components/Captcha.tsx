import React, { forwardRef, useImperativeHandle } from 'react';
import { View } from 'react-native';
import { observer, useLocalStore } from 'mobx-react';
import Modal from 'react-native-modal';
import { toJS } from 'mobx';
import { Image } from 'expo-image';

import type { ApiResponse } from '../services/ApiResponse';

import { Icon } from 'react-native-elements';
import InputContainer from './InputContainer';
import MText from './MText';
import CenteredLoading from './CenteredLoading';
import sp from '~/services/serviceProvider';

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
    const theme = sp.styles.style;
    const i18n = sp.i18n;

    const store = useLocalStore(() => ({
      show: false,
      error: false,
      captchaImage: { uri: '' as string },
      clientText: '' as string,
      jwtToken: '' as string,
      setText(value: string) {
        store.clientText = value;
      },
      setError(value: boolean) {
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
        if (!store.clientText && !store.error) {
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
        try {
          this.setError(false);
          const response: CaptchaResponse = await sp.api.get('api/v2/captcha');
          if (response && response.base64_image) {
            store.captchaImage.uri = response.base64_image;
            store.jwtToken = response.jwt_token;
          } else {
            this.setError(true);
          }
        } catch (err) {
          sp.log.exception(err);
          this.setError(true);
        }
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
        backdropColor={sp.styles.getColor('Black')}
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
              {i18n.t('close')}
            </MText>
            <MText style={styles.textVerification}>
              {i18n.t('verification')}
            </MText>
            {!store.error ? (
              <MText onPress={store.send} style={styles.textSend}>
                {i18n.t('verify')}
              </MText>
            ) : (
              <View />
            )}
          </View>
          {store.captchaImage.uri !== '' && !store.error && (
            <>
              <View style={styles.imageContainer}>
                <Image source={src} style={styles.image} />
                <Icon
                  name="reload"
                  type="material-community"
                  underlayColor={sp.styles.getColor('PrimaryBackground')}
                  size={45}
                  iconStyle={theme.colorIcon}
                  onPress={store.load}
                />
              </View>
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
            </>
          )}
          {!store.captchaImage.uri && <CenteredLoading />}
          {store.error && (
            <View style={theme.centered}>
              <MText style={theme.fontXL}>{i18n.t('errorMessage')}</MText>
              <MText style={styles.textSend} onPress={store.load}>
                {i18n.t('tryAgain')}
              </MText>
            </View>
          )}
        </View>
      </Modal>
    );
  }),
);

export default Captcha;

const styles = sp.styles.create({
  modalContainer: ['fullWidth', 'margin0x', { justifyContent: 'flex-start' }],
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
      minHeight: 300,
      width: '100%',
    },
  ],
  image: {
    width: 250,
    height: 100,
  },
});
