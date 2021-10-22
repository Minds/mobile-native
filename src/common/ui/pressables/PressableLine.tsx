import React from 'react';
import { TouchableHighlight } from 'react-native';
import ThemedStyles from '~/styles/ThemedStyles';

const PressableLine = props => {
  return (
    <TouchableHighlight
      underlayColor={ThemedStyles.getColor('Darken10')}
      {...props}
    />
  );
};

export default PressableLine;
