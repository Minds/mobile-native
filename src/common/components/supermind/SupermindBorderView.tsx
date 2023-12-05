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
        borderRadius={5}
        borderWidth={1}
        style={styles.outerStyle}
        start={start}
        end={end}>
        {children}
      </GradientBorderView>
    </View>
  );
}

const start = { x: 0, y: 0 };
const end = { x: 1, y: 0 };

const styles = ThemedStyles.create({
  outerStyle: ['margin3x', 'marginHorizontal4x'],
});
