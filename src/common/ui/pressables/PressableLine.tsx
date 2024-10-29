import React from 'react';
import { TouchableHighlight, TouchableHighlightProps } from 'react-native';
import { TRANSPARENCY } from '~/styles/Tokens';
import sp from '~/services/serviceProvider';

export const PressableLine = ({
  children,
  ...props
}: TouchableHighlightProps) => {
  return (
    <TouchableHighlight
      style={sp.styles.style.flexContainer}
      underlayColor={TRANSPARENCY.DARKEN10}
      {...props}>
      {/*TouchableHighlight adds a style: undefined that break the layout of Row/Column  */}
      <>{children}</>
    </TouchableHighlight>
  );
};
