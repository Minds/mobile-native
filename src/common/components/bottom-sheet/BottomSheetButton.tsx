import React from 'react';
import { Platform } from 'react-native';
import ThemedStyles from '../../../styles/ThemedStyles';
import Button from '../Button';

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
      action={action}
      color={ThemedStyles.getColor('TertiaryBackground')}
      containerStyle={action ? buttonActionStyle : buttonStyle}
      inverted={action !== true ? true : undefined}
      textStyle={ThemedStyles.style.colorPrimaryText}
      text={text}
      loading={loading}
      onPress={onPress}
      testID={testID}
    />
  );
}

const height = Platform.select({ ios: 42, android: 44 });

const buttonStyle = ThemedStyles.combine(
  'alignSelfStretch',
  'marginTop3x',
  'marginHorizontal5x',
  { height },
);
const buttonActionStyle = ThemedStyles.combine(
  'alignSelfStretch',
  'marginTop3x',
  'marginHorizontal5x',
  'bgTransparent',
  { height },
);
