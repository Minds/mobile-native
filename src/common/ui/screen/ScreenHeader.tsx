import React, { ReactNode } from 'react';
import { View } from 'react-native';
import { H2 } from '~ui/typography';
import { Row, SpacerPropType } from '~ui/layout';
import ThemedStyles from '~/styles/ThemedStyles';
import { IconButton } from '..';
import { useNavigation } from '@react-navigation/native';

export type ScreenHeaderType = {
  title: string;
  extra?: ReactNode;
  back?: boolean;
};

export const ScreenHeader = ({
  title,
  extra,
  back,
  ...more
}: ScreenHeaderType & SpacerPropType) => {
  const navigation = useNavigation();
  return (
    <Row align="centerBetween" space="L" {...more}>
      <View style={ThemedStyles.style.rowJustifyStart}>
        {back && (
          <IconButton
            name="chevron-left"
            size="large"
            right="S"
            onPress={() => navigation.goBack()}
          />
        )}
        <H2 font="bold">{title}</H2>
      </View>
      <View>{extra}</View>
    </Row>
  );
};
