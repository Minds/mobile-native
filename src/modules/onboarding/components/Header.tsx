import React from 'react';
import { View } from 'react-native';
import { B1, H3, H4, ScreenSection } from '~/common/ui';
import ThemedStyles from '~/styles/ThemedStyles';

type PropsType = {
  title: string;
  description: string;
  skip?: boolean;
  onSkip?: () => void;
};

export default function Header({
  title,
  description,
  skip,
  onSkip,
}: PropsType) {
  return (
    <ScreenSection vertical="L">
      <View>
        <H3 align="center">{title}</H3>
        {skip && (
          <View style={ThemedStyles.style.positionAbsoluteTopRight}>
            <H4 align="center" font="medium" color="link" onPress={onSkip}>
              Skip
            </H4>
          </View>
        )}
      </View>
      <B1 align="center" top="M">
        {description}
      </B1>
    </ScreenSection>
  );
}
