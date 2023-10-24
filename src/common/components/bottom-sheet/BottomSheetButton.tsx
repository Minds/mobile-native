import React from 'react';
import { ViewStyle } from 'react-native';
import { Button } from '~ui';

interface PropsType {
  text: string;
  action?: boolean;
  onPress?: () => void;
  testID?: string;
  loading?: boolean;
  solid?: boolean;
  disabled?: boolean;
  containerStyle?: ViewStyle | ViewStyle[];
}

export default function BottomSheetButton({
  text,
  onPress,
  action,
  loading,
  testID,
  solid,
  containerStyle,
}: PropsType) {
  return (
    <Button
      top="L"
      horizontal="L"
      onPress={onPress}
      testID={testID}
      loading={loading}
      mode={action ? (solid ? 'solid' : 'outline') : 'solid'}
      type={action ? 'action' : undefined}
      containerStyle={containerStyle}>
      {text}
    </Button>
  );
}
