import React from 'react';
import { View } from 'react-native';
import { useDimensions } from '@react-native-community/hooks';
import {
  Fade,
  Placeholder,
  PlaceholderLine,
  PlaceholderMedia,
} from 'rn-placeholder';

import ThemedStyles from '../../../styles/ThemedStyles';

const mediaHeight = { height: 280 };

/**
 * Trend list placeholder
 */
export default function DiscoveryTrendPlaceHolder() {
  const color = ThemedStyles.getColor('TertiaryBackground');
  const { width } = useDimensions().screen;
  const animation = props => (
    <Fade {...props} style={ThemedStyles.style.bgPrimaryBackground} />
  );
  return (
    <View>
      <Placeholder Animation={animation}>
        <PlaceholderMedia size={width} color={color} style={mediaHeight} />
      </Placeholder>
      <Placeholder style={ThemedStyles.style.padding3x} Animation={animation}>
        <View>
          <PlaceholderLine width={70} color={color} />
          <PlaceholderLine width={30} color={color} />
        </View>
      </Placeholder>
      <Placeholder
        style={styles.items}
        Animation={animation}
        Right={() => <PlaceholderMedia size={100} color={color} />}
      >
        <View>
          <PlaceholderLine width={80} color={color} />
          <PlaceholderLine width={60} color={color} />
        </View>
      </Placeholder>
      <Placeholder
        style={styles.items}
        Animation={animation}
        Right={() => <PlaceholderMedia size={100} color={color} />}
      >
        <View>
          <PlaceholderLine width={80} color={color} />
          <PlaceholderLine width={60} color={color} />
        </View>
      </Placeholder>
    </View>
  );
}

const styles = ThemedStyles.create({
  items: ['padding3x', 'borderTopHair', 'bcolorPrimaryBorder'],
});
