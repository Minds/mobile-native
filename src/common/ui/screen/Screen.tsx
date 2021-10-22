import React from 'react';
import { View, StyleSheet } from 'react-native';
import ThemedStyles from '~/styles/ThemedStyles';
import { SafeAreaView } from 'react-native-safe-area-context';

const Screen = ({ children, safe }: any) => {
  const Renderer = safe ? SafeAreaView : View;
  return <Renderer style={styles.container}>{children}</Renderer>;
};

// themed
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ThemedStyles.getColor('PrimaryBackground'),
  },
});

export default Screen;
