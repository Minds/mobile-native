import { View } from 'react-native';
import ThemedStyles from '../../../styles/ThemedStyles';
import React from 'react';

const Handle = ({ children, showHandle = false }) => (
  <View style={styles.container}>
    {showHandle && (
      <View style={ThemedStyles.style.alignCenter}>
        <View style={styles.handleBar} />
      </View>
    )}

    {children}
  </View>
);

export default Handle;

const styles = ThemedStyles.create({
  container: [
    {
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingTop: 10,
      paddingBottom: 5,
    },
    'bgPrimaryBackground',
    'borderBottomHair',
    'bcolorPrimaryBorder',
  ],
  handleBar: [
    {
      width: 30,
      height: 5,
      borderRadius: 10,
    },
    'bgTertiaryBackground',
  ],
});
