import React from 'react';
import { View } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { Image } from 'expo-image';

import ThemedStyles from '~/styles/ThemedStyles';
import { Version } from '~/config/Version';
import MText from '~/common/components/MText';
import { Screen } from '~/common/ui';

export default function AppInfoScreen() {
  const theme = ThemedStyles.style;
  const logo = ThemedStyles.theme
    ? require('../../../assets/images/logo_horizontal.png')
    : require('../../../assets/images/logo_horizontal_dark.png');

  const rowStyle = [
    theme.rowJustifySpaceBetween,
    theme.padding4x,
    theme.borderBottomHair,
    theme.bcolorPrimaryBorder,
  ];

  const valueStyle = [theme.colorSecondaryText, theme.fontL, theme.fontThin];

  const titleStyle = [theme.colorSecondaryText, theme.fontXL];

  return (
    <Screen>
      <Image
        contentFit="cover"
        style={[styles.logo, theme.marginTop18x]}
        source={logo}
      />
      <MText style={[styles.version, theme.colorSecondaryText]}>
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
    </Screen>
  );
}

const styles = {
  logo: {
    height: 85,
    width: 230,
    alignSelf: 'center',
  },
  version: {
    marginTop: 16,
    fontSize: 16,
    padding: 8,
    textAlign: 'center',
    fontWeight: '200',
  },
};
