import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { ShareMenuReactView } from 'react-native-share-menu';
import { DARK_THEME } from './src/styles/Colors';

const Share = () => {
  const logo = require('./src/assets/logos/logo-white.png');

  useEffect(() => {
    ShareMenuReactView.data().then(({ mimeType, data }) => {
      ShareMenuReactView.continueInApp();
    });
  }, []);

  return (
    <View style={styles.container}>
      <Image resizeMode={'cover'} style={styles.logo} source={logo} />
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
