import React from 'react';
import { TouchableHighlight } from 'react-native';
import { TRANSPARENCY } from '~/styles/Tokens';
import ThemedStyles from '~/styles/ThemedStyles';

export const PressableLine = ({ children, ...props }) => {
  return (
    <TouchableHighlight
      style={ThemedStyles.style.flexContainer}
      underlayColor={TRANSPARENCY.DARKEN10}
      {...props}>
      {/*TouchableHighlight adds a style: undefined that break the layout of Row/Column  */}
      <>{children}</>
    </TouchableHighlight>
  );
};
