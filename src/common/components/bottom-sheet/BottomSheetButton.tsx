import React from 'react';
import { Button } from '~ui';

interface PropsType {
  text: string;
  action?: boolean;
  onPress: () => void;
  testID?: string;
  loading?: boolean;
  disabled?: boolean;
}

export default function BottomSheetButton({
  text,
  onPress,
  action,
  loading,
  testID,
}: PropsType) {
  return (
    <Button
      top="L"
      horizontal="L"
      onPress={onPress}
      testID={testID}
      loading={loading}
      mode={action ? 'outline' : 'solid'}
      type={action ? 'action' : undefined}>
      {text}
    </Button>
  );
}
