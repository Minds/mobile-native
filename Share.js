import React from 'react';
import { View, StyleSheet } from 'react-native';
import deeplinkService from './src/common/services/deeplinks-router.service';
import { Image } from 'expo-image';
import assets from '@assets';

const Share = ({ url }: { url: string }) => {
  if (url.startsWith('http')) {
    return deeplinkService.navigate(url);
  }
  return (
    <View style={styles.container}>
      <Image
        contentFit="cover"
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
    marginVertical: 10,
  },
});

export default Share;
