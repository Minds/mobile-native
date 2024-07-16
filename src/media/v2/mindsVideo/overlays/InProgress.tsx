import React from 'react';
import { Flow } from 'react-native-animated-spinkit';
import { View } from 'react-native';

import { styles } from './styles';
import sp from '~/services/serviceProvider';

const InProgress = () => {
  return (
    <View
      style={[
        styles.overlayContainer,
        styles.overlayContainerTransparent,
        sp.styles.style.rowJustifyCenter,
      ]}>
      <Flow color={sp.styles.getColor('Link')} />
    </View>
  );
};

export default InProgress;
