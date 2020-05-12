//@ts-nocheck
import React from 'react';
import { View, Text } from 'react-native-animatable';
import ThemedStyles from '../../styles/ThemedStyles';
import i18n from '../../common/services/i18n.service';
import { Version } from '../../config/Version';
import FastImage from 'react-native-fast-image';

export default function () {
  const CS = ThemedStyles.style;
  const logo = ThemedStyles.theme
    ? require('../../assets/logos/logo-white.png')
    : require('../../assets/logos/logo.png');

  return (
    <View
      style={[
        styles.logoBackground,
        CS.flexContainer,
        CS.centered,
        CS.backgroundPrimary,
      ]}>
      <FastImage
        resizeMode={FastImage.resizeMode.cover}
        style={[styles.logo, CS.marginTop2x]}
        source={logo}
      />
      <View style={styles.footer}>
        <Text
          style={[styles.version, CS.colorSecondaryText]}
          textAlign={'center'}>
          v{Version.VERSION} ({Version.BUILD})
        </Text>
      </View>
    </View>
  );
}

const styles = {
  logoBackground: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 20,
    width: '100%',
  },
  logo: {
    height: 85,
    width: 230,
  },
  footer: {
    alignItems: 'stretch',
    width: '100%',
    height: 50,
  },
  version: {
    marginTop: 16,
    fontSize: 16,
    padding: 8,
    textAlign: 'center',
    fontWeight: '200',
  },
};
