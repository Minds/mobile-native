import React from 'react';
import { useNavigation } from '@react-navigation/core';
import { StatusBar, View } from 'react-native';

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
  leftComponent?: React.ReactNode;
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
  leftComponent,
  onBack,
}: PropsType) => {
  const theme = ThemedStyles.style;
  const navigation = useNavigation();
  const goBackPress = React.useCallback(() => navigation.goBack(), [
    navigation,
  ]);
  return (
    <Screen loading={loading} scroll={scroll} safe>
      <StatusBar backgroundColor={theme.bgPrimaryBackground.backgroundColor} />
      <ScreenHeader
        title={title}
        extra={extra}
        centerTitle
        backIcon="close"
        onBack={onBack || goBackPress}
        back={back}
        leftComponent={leftComponent}
        border
      />
      <View style={theme.flexContainer}>{children}</View>
    </Screen>
  );
};
