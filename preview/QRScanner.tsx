import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from 'react-native-vision-camera';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Linking, StyleSheet } from 'react-native';
import { B1, Button } from '~/common/ui';

export const QRScanner = ({ setScan }) => {
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');
  const [isActive, setIsActive] = useState(true);

  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: codes => {
      if (codes.length > 0 && isActive) {
        setIsActive(false);
        const data = codes[0].value;
        if (data?.startsWith('mindspreview://preview/')) {
          Linking.openURL(data);
        }
        setScan(false);
      }
    },
  });

  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  if (!hasPermission || !device) {
    return (
      <View style={{ padding: 16, flex: 1 }}>
        <B1 numberOfLines={1} align="center">
          {hasPermission === false
            ? 'No access to camera'
            : 'Requesting for camera permission'}
        </B1>
      </View>
    );
  }

  return (
    <>
      <Camera
        style={StyleSheet.absoluteFillObject}
        device={device}
        isActive={isActive}
        codeScanner={codeScanner}
      />
      <View
        style={{
          position: 'absolute',
          bottom: 60,
          left: 0,
          width: '100%',
          height: 120,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View>
          <Button onPress={() => setScan(false)}>Cancel</Button>
        </View>
      </View>
    </>
  );
};
