import { View } from 'react-native';
import React from 'react';
import { Flow } from 'react-native-animated-spinkit';
import ThemedStyles from '~/styles/ThemedStyles';

export default function LoadingOverlay() {
  return (
    <View style={styles.loading}>
      <Flow color={ThemedStyles.getColor('White')} />
    </View>
  );
}

const styles = ThemedStyles.create({
  loading: [
    'positionAbsolute',
    'centered',
    { backgroundColor: 'rgba(0,0,0,0.45)' },
  ],
});
