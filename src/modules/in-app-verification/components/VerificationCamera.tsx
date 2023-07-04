import * as React from 'react';

import { observer } from 'mobx-react';
import Icon from 'react-native-vector-icons/Ionicons';
import { View, LayoutChangeEvent, Dimensions } from 'react-native';
import { Camera } from 'react-native-vision-camera';

import ThemedStyles from '~styles/ThemedStyles';
import {
  VerificationStoreType,
  useVerificationCamera,
} from './VerificationCamera.logic';
import CodeMessage from './CodeMessage';
import ActivityIndicator from '~/common/components/ActivityIndicator';
import { useTranslation } from '../locales';

const { width } = Dimensions.get('window');

type PropsType = {
  code: string;
  deviceId: string;
};

const TARGET_WIDTH_RATIO = 0.65;

function OcrCamera({ code, deviceId }: PropsType) {
  const { store, camera, device, format, frameProcessor } =
    useVerificationCamera(code, deviceId);

  const { t } = useTranslation();
  const texts = messages(t);

  return (
    <View style={ThemedStyles.style.flexContainer}>
      {device && store.hasPermission && format && (
        <View style={ThemedStyles.style.flexContainer}>
          <Camera
            ref={camera}
            style={ThemedStyles.style.flexContainer}
            frameProcessor={frameProcessor}
            device={device}
            format={format}
            orientation="portrait"
            photo={true}
            video={true}
            audio={false}
            isActive={store.status === 'running'}
            frameProcessorFps={3}
            onLayout={(event: LayoutChangeEvent) => {
              store.setLayout(event.nativeEvent.layout, format);
            }}
          />
          <TargetFrame store={store} />
        </View>
      )}
      <CodeMessage
        title={texts[store.status].title}
        detail={texts[store.status].detail}
        action={texts[store.status].action}
        onPress={() => store.action()}
      />
    </View>
  );
}

const TargetFrame = observer(({ store }: { store: VerificationStoreType }) => {
  return (
    <View style={styles.rectangleContainer}>
      <View
        style={[
          styles.rectangle,
          ['success', 'uploading'].includes(store.status)
            ? styles.validated
            : store.status !== 'running'
            ? styles.error
            : null,
        ]}>
        {store.status === 'uploading' && (
          <ActivityIndicator
            size="large"
            color={ThemedStyles.getColor('Link')}
          />
        )}
        {store.status === 'success' && (
          <Icon name="checkmark-circle" size={35} style={styles.validated} />
        )}
        {(store.status === 'error' || store.status === 'timeout') && (
          <Icon name="alert-circle" size={35} style={styles.error} />
        )}
      </View>
    </View>
  );
});

export default observer(OcrCamera);

const styles = ThemedStyles.create({
  rectangleContainer: ['centered', 'absoluteFill'],
  validated: ['colorGreen', 'bcolorGreen'],
  error: ['colorAlert', 'bcolorAlert'],
  rectangle: {
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: 'white',
    borderWidth: 4,
    borderRadius: 20,
    width: width * TARGET_WIDTH_RATIO,
    aspectRatio: 3.1,
  },
});

export const messages = t => ({
  running: {
    title: t('Capture Code'),
    detail: t(
      'Align and center your 6-digit code in the rectangular area above to verify your account.',
    ),
    action: t('Resend code'),
  },
  timeout: {
    title: t('Timed out'),
    detail: t(
      "We noticed you weren't able to align the code. Make sure to center the code in the box.",
    ),
    action: t('Try Again'),
  },
  error: {
    title: t('Error'),
    detail: t('An error occurred, please try again.'),
    action: t('Try Again'),
  },
  expired: {
    title: t('Error'),
    detail: t('Verification request expired.'),
    action: t('Resend code'),
  },
  permissionError: {
    title: t('Permissions'),
    detail: t(
      'Please grant camera & geo-location permissions to proceed with the verification',
    ),
    action: t('Try Again'),
  },
  success: {
    title: t('Success'),
    detail: t('Congrats you successfully aligned and verified your code.'),
    action: t('Continue'),
  },
  uploading: {
    title: t('Processing'),
    detail: t('Please wait...'),
    action: '',
  },
});
