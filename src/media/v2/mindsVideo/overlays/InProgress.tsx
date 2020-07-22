import React from 'react';
import { observer } from 'mobx-react';
import { ActivityIndicator, View } from 'react-native';
import { styles } from './styles';

const InProgress = observer(() => {
  return (
    <View style={[styles.overlayContainer, styles.overlayContainerTransparent]}>
      <ActivityIndicator size="large" />
    </View>
  );
});

export default InProgress;
