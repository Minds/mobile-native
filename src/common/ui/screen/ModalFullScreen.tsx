import React from 'react';
import { useNavigation } from '@react-navigation/core';
import { View } from 'react-native';

import { Screen, ScreenHeader } from '~ui';
import ThemedStyles from '~/styles/ThemedStyles';

type PropsType = {
  title: string;
  children: React.ReactNode;
  loading?: boolean;
  scroll?: boolean;
  extra?: React.ReactNode;
  onBack?: () => void;
  back?: boolean;
};

/**
 * Base full screen modal
 */
export const ModalFullScreen = ({
  title,
  children,
  loading,
  scroll,
  extra,
  back,
  onBack,
}: PropsType) => {
  const theme = ThemedStyles.style;
  const navigation = useNavigation();
  const goBackPress = React.useCallback(() => navigation.goBack(), [
    navigation,
  ]);
  return (
    <Screen loading={loading} scroll={scroll} safe>
      <ScreenHeader
        title={title}
        extra={extra}
        centerTitle
        backIcon="close"
        onBack={onBack || goBackPress}
        back={back}
        border
      />
      <View style={theme.flexContainer}>{children}</View>
    </Screen>
  );
};
