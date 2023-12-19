import { BarCodeScanner } from 'expo-barcode-scanner';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Linking, StyleSheet } from 'react-native';
import { B1, Button } from '~/common/ui';

export const QRScanner = ({ setScan }) => {
  const [hasPermission, setHasPermission] = useState<Boolean | null>(null);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ data }) => {
    if (data.startsWith('mindspreview://preview/')) {
      Linking.openURL(data);
    }
    setScan(false);
  };

  if (!hasPermission) {
    return (
      <>
        <View style={{ padding: 16, flex: 1 }}>
          <B1 numberOfLines={1} align="center">
            {hasPermission === false
              ? 'No access to camera'
              : 'Requesting for camera permission'}
          </B1>
        </View>
      </>
    );
  }
  return (
    <>
      <BarCodeScanner
        onBarCodeScanned={handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
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
