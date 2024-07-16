import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { TouchableOpacityProps, TouchableOpacity } from 'react-native';
import { B2 } from '~/common/ui';
import { SupermindGradient } from '~/styles/Colors';
import sp from '~/services/serviceProvider';

type Props = {
  title?: string;
} & TouchableOpacityProps;

export default function GradientButton({ title, style, ...props }: Props) {
  return (
    <TouchableOpacity
      {...props}
      activeOpacity={0.7}
      style={[styles.outerStyle, style]}>
      <LinearGradient
        style={styles.gradient}
        colors={SupermindGradient}
        start={start}
        end={end}
        locations={locations}>
        <B2 color="white" font="medium" horizontal="XS" align="center">
          {title}
        </B2>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const start = { x: 0, y: 0 };
const end = { x: 1, y: 0 };
const locations = [0, 0.4, 1];
const styles = sp.styles.create({
  outerStyle: [
    {
      height: 36,
      borderRadius: 100,
      overflow: 'hidden',
    },
  ],
  gradient: ['flexContainerCenter', 'paddingHorizontal2x'],
});
