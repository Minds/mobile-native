import * as React from 'react';

import { observer } from 'mobx-react';
import Icon from 'react-native-vector-icons/Ionicons';
import { View, Text, LayoutChangeEvent, Dimensions } from 'react-native';
import { Camera } from 'react-native-vision-camera';

import ThemedStyles from '~styles/ThemedStyles';
import { OcrStoreType, useOcrCamera } from './OcrCamera.logic';
import CodeMessage from './CodeMessage';
import i18n from '~/common/services/i18n.service';

const { width } = Dimensions.get('window');

type PropsType = {
  code: string;
};

const TARGET_WIDTH_RATIO = 0.65;

function OcrCamera({ code }: PropsType) {
  const { store, camera, device, format, frameProcessor } = useOcrCamera(code);

  return device !== undefined && store.hasPermission && format ? (
    <View style={ThemedStyles.style.flexContainer}>
      <View style={ThemedStyles.style.flexContainer}>
        <Camera
          ref={camera}
          style={ThemedStyles.style.flexContainer}
          frameProcessor={frameProcessor}
          device={device}
          format={format}
          orientation="portrait"
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
      <CodeMessage
        title={i18n.t(`inAppVerification.messages.${store.status}.title`)}
        detail={i18n.t(`inAppVerification.messages.${store.status}.detail`)}
        action={i18n.t(`inAppVerification.messages.${store.status}.action`)}
        onPress={() => store.action()}
      />
    </View>
  ) : (
    <View>
      <Text>No available cameras</Text>
    </View>
  );
}

const TargetFrame = observer(({ store }: { store: OcrStoreType }) => {
  return (
    <View style={styles.rectangleContainer}>
      <View
        style={[
          styles.rectangle,
          store.status === 'valid'
            ? styles.validated
            : store.status !== 'running'
            ? styles.error
            : null,
        ]}>
        {store.status === 'valid' && (
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
