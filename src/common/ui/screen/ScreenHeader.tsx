import React, { ReactNode } from 'react';
import { View } from 'react-native';
import { H2 } from '~ui/typography';
import { Row, SpacerPropType } from '~ui/layout';
import ThemedStyles from '~/styles/ThemedStyles';

export type ScreenHeaderType = {
  title: string;
  extra?: ReactNode;
};

export const ScreenHeader = ({
  title,
  extra,
  ...more
}: ScreenHeaderType & SpacerPropType) => {
  return (
    <Row align="centerBetween" space="L" {...more}>
      <View style={ThemedStyles.style.flexContainer}>
        <H2 font="bold">{title}</H2>
      </View>
      <View>{extra}</View>
    </Row>
  );
};
