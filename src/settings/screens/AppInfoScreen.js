import React from 'react';
import { View } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import FastImage from 'react-native-fast-image';
import ThemedStyles from '../../styles/ThemedStyles';
import { Version } from '../../config/Version';
import MText from '../../common/components/MText';

export default function AppInfoScreen() {
  const theme = ThemedStyles.style;
  const logo = ThemedStyles.theme
    ? require('../../assets/logos/logo-white.png')
    : require('../../assets/logos/logo.png');

  const rowStyle = [
    theme.rowJustifySpaceBetween,
    theme.padding4x,
    theme.borderBottomHair,
    theme.bcolorPrimaryBorder,
  ];

  const valueStyle = [theme.colorSecondaryText, theme.fontL, theme.fontThin];

  const titleStyle = [theme.colorSecondaryText, theme.fontXL];

  return (
    <View
      style={[
        styles.logoBackground,
        theme.flexContainer,
        theme.centered,
        theme.bgPrimaryBackground,
      ]}>
      <FastImage
        resizeMode={FastImage.resizeMode.cover}
        style={[styles.logo, theme.marginTop2x]}
        source={logo}
      />
      <View style={styles.footer}>
        <MText
          style={[styles.version, theme.colorSecondaryText]}
          textAlign={'center'}>
          v{Version.VERSION} ({Version.BUILD})
        </MText>
        <View style={rowStyle}>
          <MText style={titleStyle}>Brand</MText>
          <MText style={valueStyle}>{DeviceInfo.getBrand()}</MText>
        </View>
        <View style={rowStyle}>
          <MText style={titleStyle}>Type</MText>
          <MText style={valueStyle}>{DeviceInfo.getDeviceType()}</MText>
        </View>
        <View style={rowStyle}>
          <MText style={titleStyle}>Device</MText>
          <MText style={valueStyle}>{DeviceInfo.getModel()}</MText>
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
