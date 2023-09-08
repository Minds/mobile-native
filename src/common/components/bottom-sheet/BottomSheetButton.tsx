import React from 'react';
import { Button } from '~ui';

interface PropsType {
  text: string;
  action?: boolean;
  onPress?: () => void;
  testID?: string;
  loading?: boolean;
  solid?: boolean;
  disabled?: boolean;
}

export default function BottomSheetButton({
  text,
  onPress,
  action,
  loading,
  testID,
  solid,
}: PropsType) {
  return (
    <Button
      top="L"
      horizontal="L"
      onPress={onPress}
      testID={testID}
      loading={loading}
      mode={action ? (solid ? 'solid' : 'outline') : 'solid'}
      type={action ? 'action' : undefined}>
      {text}
    </Button>
  );
}
