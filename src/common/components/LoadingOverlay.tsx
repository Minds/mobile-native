import { View } from 'react-native';
import React from 'react';
import { Flow } from 'react-native-animated-spinkit';
import sp from '~/services/serviceProvider';

export default function LoadingOverlay() {
  return (
    <View style={styles.loading}>
      <Flow color={sp.styles.getColor('White')} />
    </View>
  );
}

const styles = sp.styles.create({
  loading: [
    'positionAbsolute',
    'centered',
    { backgroundColor: 'rgba(0,0,0,0.45)' },
  ],
});
