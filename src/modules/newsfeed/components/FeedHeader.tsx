import { View } from 'react-native';
import React from 'react';
import { H2 } from '~/common/ui';
import sp from '~/services/serviceProvider';
/**
 * Feed Header
 */
export default function FeedHeader({ text }: { text: string }) {
  return (
    <View style={sp.styles.style.padding3x}>
      <H2>{text}</H2>
    </View>
  );
}
