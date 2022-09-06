import { View } from 'react-native';
import React from 'react';
import ThemedStyles from '~/styles/ThemedStyles';
import { LinearGradient } from 'expo-linear-gradient';
import { B2 } from '~/common/ui';
import { SupermindGradient } from '~/styles/Colors';

type Props = {
  text?: string;
};

export default function SupermindLabel({ text }: Props) {
  return (
    <View style={styles.outerStyle}>
      <LinearGradient
        colors={SupermindGradient}
        start={start}
        end={end}
        locations={locations}>
        <B2 color="white" font="medium" horizontal="XS">
          {text || 'Supermind'}
        </B2>
      </LinearGradient>
    </View>
  );
}

const start = { x: 0, y: 0 };
const end = { x: 1, y: 0 };
const locations = [0, 0.3, 1];
const styles = ThemedStyles.create({
  outerStyle: {
    height: 20,
    borderRadius: 3,
    overflow: 'hidden',
  },
});
