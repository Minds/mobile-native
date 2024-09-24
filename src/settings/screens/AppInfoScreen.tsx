import React from 'react';
import { Platform, View } from 'react-native';
import { osVersion, deviceName, brand } from 'expo-device';
import TurboImage from 'react-native-turbo-image';

import { Version } from '~/config/Version';
import MText from '~/common/components/MText';
import { Screen } from '~/common/ui';
import sp from '~/services/serviceProvider';

export default function AppInfoScreen() {
  const theme = sp.styles.style;
  const logo = sp.styles.theme
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
      <TurboImage
        resizeMode="cover"
        style={[styles.logo, theme.marginTop18x]}
        source={logo}
      />
      <MText style={[styles.version, theme.colorSecondaryText]}>
        v{Version.VERSION} ({Version.BUILD})
      </MText>
      <View style={rowStyle}>
        <MText style={titleStyle}>Brand</MText>
        <MText style={valueStyle}>{brand}</MText>
      </View>
      <View style={rowStyle}>
        <MText style={titleStyle}>Type</MText>
        <MText style={valueStyle}>{deviceName}</MText>
      </View>
      <View style={rowStyle}>
        <MText style={titleStyle}>
          {Platform.select({ ios: 'iOS', android: 'Android' })}
        </MText>
        <MText style={valueStyle}>{osVersion}</MText>
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
