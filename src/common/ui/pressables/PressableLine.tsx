import React from 'react';
import { TouchableHighlight } from 'react-native';
import { TRANSPARENCY } from '~/styles/Tokens';
import ThemedStyles from '~/styles/ThemedStyles';

export const PressableLine = props => {
  return (
    <TouchableHighlight
      style={styles.container}
      underlayColor={TRANSPARENCY.DARKEN05}
      {...props}
    />
  );
};

const styles = ThemedStyles.create({
  container: {
    flex: 1,
  },
});
