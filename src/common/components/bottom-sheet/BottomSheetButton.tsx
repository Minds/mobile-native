import React from 'react';
import ThemedStyles from '../../../styles/ThemedStyles';
import Button from '../Button';

interface PropsType {
  text: string;
  action?: boolean;
  onPress: () => void;
}

export default function BottomSheetButton({
  text,
  onPress,
  action,
}: PropsType) {
  return (
    <Button
      action={action}
      color={ThemedStyles.getColor('TertiaryBackground')}
      containerStyle={action ? buttonActionStyle : buttonStyle}
      inverted={action !== true ? true : undefined}
      textStyle={ThemedStyles.style.colorPrimaryText}
      text={text}
      onPress={onPress}
    />
  );
}

const buttonStyle = ThemedStyles.combine(
  'alignSelfStretch',
  'marginTop3x',
  'marginHorizontal5x',
);
const buttonActionStyle = ThemedStyles.combine(
  'alignSelfStretch',
  'marginTop3x',
  'marginHorizontal5x',
  'bgTransparent',
);
