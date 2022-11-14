import { View } from 'react-native';
import React from 'react';
import { B1, Button, H2 } from '~/common/ui';
import ThemedStyles from '~/styles/ThemedStyles';

type PropsType = {
  title: string;
  detail: string;
  action: string;
  onPress: () => void;
};

export default function CodeMessage({
  title,
  detail,
  action,
  onPress,
}: PropsType) {
  return (
    <View style={containerStyle}>
      <H2 vertical="L" font="medium">
        {title}
      </H2>
      <B1 bottom="L" align="center">
        {detail}
      </B1>
      <Button mode="flat" type="action" onPress={onPress}>
        {action}
      </Button>
    </View>
  );
}

const containerStyle = ThemedStyles.combine(
  'bgPrimaryBackground',
  'centered',
  'fullWidth',
  'padding3x',
  { borderTopLeftRadius: 10, borderTopRightRadius: 10, marginTop: -10 },
);
