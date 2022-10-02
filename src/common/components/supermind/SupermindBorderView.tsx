import React from 'react';
import GradientBorderView from '../GradientBorderView';
import { SupermindGradient } from '~/styles/Colors';
import { View } from 'react-native';
import ThemedStyles from '~/styles/ThemedStyles';

type PropsType = {
  children: React.ReactNode;
};

/**
 * Supermind border view
 */
export default function SupermindBorderView({ children }: PropsType) {
  return (
    <View style={styles.outerStyle}>
      <GradientBorderView
        colors={SupermindGradient}
        borderWidth={1}
        start={start}
        end={end}>
        <View style={styles.innerStyle}>{children}</View>
      </GradientBorderView>
    </View>
  );
}

const start = { x: 0, y: 0 };
const end = { x: 1, y: 0 };

const styles = ThemedStyles.create({
  outerStyle: [
    {
      borderRadius: 5,
      overflow: 'hidden',
    },
    'margin3x',
    'marginHorizontal4x',
  ],
  innerStyle: {
    borderRadius: 4,
    overflow: 'hidden',
  },
});
