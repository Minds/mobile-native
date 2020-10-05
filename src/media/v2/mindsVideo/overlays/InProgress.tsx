import React from 'react';
import { DotIndicator } from 'react-native-reanimated-indicators';
import { styles } from './styles';
import ThemedStyles from '../../../../styles/ThemedStyles';

const InProgress = () => {
  return (
    <DotIndicator
      containerStyle={[
        styles.overlayContainer,
        styles.overlayContainerTransparent,
        ThemedStyles.style.rowJustifyCenter,
      ]}
      color={ThemedStyles.getColor('link')}
      dotSize={15}
      scaleEnabled={true}
    />
  );
};

export default InProgress;
