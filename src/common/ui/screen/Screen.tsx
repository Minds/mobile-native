import React from 'react';
import { View } from 'react-native';
import ThemedStyles from '~/styles/ThemedStyles';
import { SafeAreaView } from 'react-native-safe-area-context';

export const Screen = ({ children, safe }: any) => {
  const Renderer = safe ? SafeAreaView : View;
  return <Renderer style={styles.container}>{children}</Renderer>;
};

// themed
const styles = ThemedStyles.create({
  container: [{ flex: 1 }, 'bgPrimaryBackground'],
});
