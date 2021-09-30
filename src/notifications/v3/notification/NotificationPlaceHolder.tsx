import React from 'react';
import { View } from 'react-native';

import {
  Placeholder,
  PlaceholderMedia,
  PlaceholderLine,
  Fade,
} from 'rn-placeholder';
import ThemedStyles from '../../../styles/ThemedStyles';

export default function NotificationPlaceHolder() {
  const theme = ThemedStyles.style;
  const color = ThemedStyles.getColor('TertiaryBackground');

  const animation = props => (
    <Fade {...props} style={theme.bgPrimaryBackground} />
  );

  return (
    <View
      style={[
        theme.borderBottom8x,
        theme.bcolorPrimaryBackground,
        theme.paddingBottom4x,
        theme.paddingTop2x,
      ]}
    >
      <Placeholder
        Left={() => (
          <PlaceholderMedia isRound color={color} style={theme.marginRight2x} />
        )}
        style={theme.paddingHorizontal3x}
        Animation={animation}
      >
        <View style={lineStyle}>
          <PlaceholderLine color={color} width={70} />
        </View>
      </Placeholder>
    </View>
  );
}

const lineStyle = ThemedStyles.combine('paddingTop2x', 'paddingLeft4x');
