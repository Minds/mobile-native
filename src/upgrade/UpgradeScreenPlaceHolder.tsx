import React from 'react';
import { View } from 'react-native';

import { Placeholder, PlaceholderLine, Fade } from 'rn-placeholder';
import ThemedStyles from '../styles/ThemedStyles';

export default function ActivityPlaceHolder() {
  const theme = ThemedStyles.style;
  const color = ThemedStyles.getColor('TertiaryBackground');

  const animation = props => (
    <Fade {...props} style={theme.bgSecondaryBackground} />
  );

  const lineWidth = 100;
  const lineHeight = 30;

  return (
    <View>
      <Placeholder style={container} Animation={animation}>
        <View>
          <PlaceholderLine
            width={lineWidth}
            height={lineHeight}
            color={color}
          />
          <PlaceholderLine
            width={lineWidth}
            height={lineHeight}
            color={color}
          />
          <PlaceholderLine
            width={lineWidth}
            height={lineHeight}
            color={color}
          />
          <PlaceholderLine
            width={lineWidth}
            height={lineHeight}
            color={color}
          />
        </View>
      </Placeholder>
    </View>
  );
}

const container = ThemedStyles.combine('paddingHorizontal3x', 'marginTop4x');
