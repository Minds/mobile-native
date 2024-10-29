import { View } from 'react-native';
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';

import { SupermindGradient } from '~/styles/Colors';
import { Typography, TypographyType } from '../../ui/typography/Typography';
import sp from '~/services/serviceProvider';
import { useMemoStyle } from '~/styles/hooks';

type Props = {
  text?: string;
  font?: TypographyType;
  height?: number;
};

export default function SupermindLabel({
  text,
  font = 'B2',
  height = 24,
}: Props) {
  const outerStyle = useMemoStyle(
    () => [styles.outerStyle, { height: height }],
    [height],
  );
  return (
    <View style={outerStyle}>
      <LinearGradient
        style={sp.styles.style.flexContainerCenter}
        colors={SupermindGradient}
        start={start}
        end={end}
        locations={locations}>
        <Typography type={font} color="white" font="medium" horizontal="XS">
          {text || 'Supermind'}
        </Typography>
      </LinearGradient>
    </View>
  );
}

const start = { x: 0, y: 0 };
const end = { x: 1, y: 0 };
const locations = [0, 0.4, 1];
const styles = sp.styles.create({
  outerStyle: {
    borderRadius: 3,
    overflow: 'hidden',
  },
});
