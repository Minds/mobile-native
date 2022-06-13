import React from 'react';
import { View } from 'react-native';
import Placeholder from '~/common/components/Placeholder';

export default function UpgradeScreenPlaceHolder() {
  return (
    <View>
      <Placeholder width="25%" height={16} bottom="M" />
      <Placeholder width="100%" height={35} bottom="M" />
      <Placeholder width="25%" height={16} bottom="M" />
      <Placeholder width="100%" height={35} bottom="M" />
    </View>
  );
}
