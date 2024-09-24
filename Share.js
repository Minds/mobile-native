import TurboImage from 'react-native-turbo-image';
import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { ShareMenuReactView } from 'react-native-share-menu';
import assets from '@assets';

const Share = () => {
  useEffect(() => {
    ShareMenuReactView.data().then(({ mimeType, data }) => {
      ShareMenuReactView.continueInApp();
    });
  }, []);

  return (
    <View style={styles.container}>
      <TurboImage
        resizeMode="cover"
        style={styles.logo}
        source={assets.LOGO_HORIZONTAL}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  logo: {
    height: 85,
    width: 230,
    marginTop: 10,
  },
});

export default Share;
