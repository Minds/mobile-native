import React from 'react';
import { View, Text } from 'react-native-animatable';
import DeviceInfo from 'react-native-device-info';
import FastImage from 'react-native-fast-image';
import ThemedStyles from '../../styles/ThemedStyles';
import { Version } from '../../config/Version';

export default function AppInfoScreen() {
  const theme = ThemedStyles.style;
  const logo = ThemedStyles.theme
    ? require('../../assets/logos/logo-white.png')
    : require('../../assets/logos/logo.png');

  const rowStyle = [
    theme.rowJustifySpaceBetween,
    theme.padding4x,
    theme.borderBottomHair,
    theme.borderPrimary,
  ];

  const valueStyle = [theme.colorSecondaryText, theme.fontL, theme.fontThin];

  const titleStyle = [theme.colorSecondaryText, theme.fontXL];

  return (
    <View
      style={[
        styles.logoBackground,
        theme.flexContainer,
        theme.centered,
        theme.backgroundPrimary,
      ]}>
      <FastImage
        resizeMode={FastImage.resizeMode.cover}
        style={[styles.logo, theme.marginTop2x]}
        source={logo}
      />
      <View style={styles.footer}>
        <Text
          style={[styles.version, theme.colorSecondaryText]}
          textAlign={'center'}>
          v{Version.VERSION} ({Version.BUILD})
        </Text>
        <View style={rowStyle}>
          <Text style={titleStyle}>Brand</Text>
          <Text style={valueStyle}>{DeviceInfo.getBrand()}</Text>
        </View>
        <View style={rowStyle}>
          <Text style={titleStyle}>Type</Text>
          <Text style={valueStyle}>{DeviceInfo.getDeviceType()}</Text>
        </View>
        <View style={rowStyle}>
          <Text style={titleStyle}>Device</Text>
          <Text style={valueStyle}>{DeviceInfo.getModel()}</Text>
        </View>
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
  },
  version: {
    marginTop: 16,
    fontSize: 16,
    padding: 8,
    textAlign: 'center',
    fontWeight: '200',
  },
};
