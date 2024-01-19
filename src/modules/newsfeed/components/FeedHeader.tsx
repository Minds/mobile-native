import { View } from 'react-native';
import React from 'react';
import { H2 } from '~/common/ui';
import ThemedStyles from '~/styles/ThemedStyles';

/**
 * Feed Header
 */
export default function FeedHeader({ text }: { text: string }) {
  return (
    <View style={ThemedStyles.style.padding3x}>
      <H2>{text}</H2>
    </View>
  );
}
