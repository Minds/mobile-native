import React from 'react';
import { View } from 'react-native';

import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade,
} from 'rn-placeholder';
import ThemedStyles from '../styles/ThemedStyles';
import { useDimensions } from '@react-native-community/hooks';

export default function ActivityPlaceHolder() {
  const theme = ThemedStyles.style;
  const color = ThemedStyles.getColor('tertiary_background');
  const { width } = useDimensions().screen;

  const animation = (props) => (
    <Fade {...props} style={theme.backgroundPrimary} />
  );

  return (
    <View
      style={[
        theme.borderBottom8x,
        theme.borderBackgroundPrimary,
        theme.paddingBottom4x,
        theme.paddingTop2x,
      ]}>
      <Placeholder
        Left={() => (
          <PlaceholderMedia isRound color={color} style={theme.marginRight2x} />
        )}
        style={theme.paddingHorizontal3x}
        Animation={animation}>
        <View>
          <PlaceholderLine width={20} color={color} />
          <PlaceholderLine width={30} color={color} />
        </View>
      </Placeholder>
      <Placeholder Animation={animation}>
        <PlaceholderMedia size={width} color={color} />
      </Placeholder>
    </View>
  );
}
