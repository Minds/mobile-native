import React from 'react';
import {View, Text} from 'react-native';

import {CommonStyle as CS} from '../styles/Common';

/**
 * Fallback boundary for feed views
 * @param {object} props
 */
export default function FallbackBoundary(props) {
  return (
    <View
      style={[
        CS.flexContainer,
        CS.centered,
        CS.paddingTop,
        CS.paddingBottom,
        CS.borderBottomHair,
        CS.fullWidth,
        CS.borderGreyed,
        CS.backgroundLight,
      ]}>
      <Text style={[CS.colorDarkGreyed, CS.fontXL]}>{props.title}</Text>
    </View>
  );
}
