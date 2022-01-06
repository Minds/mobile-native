import React from 'react';
import { Flow } from 'react-native-animated-spinkit';
import { styles } from './styles';
import ThemedStyles from '../../../../styles/ThemedStyles';
import { View } from 'react-native';

const InProgress = () => {
  return (
    <View
      style={[
        styles.overlayContainer,
        styles.overlayContainerTransparent,
        ThemedStyles.style.rowJustifyCenter,
      ]}>
      <Flow color={ThemedStyles.getColor('Link')} size={15} />
    </View>
  );
};

export default InProgress;
