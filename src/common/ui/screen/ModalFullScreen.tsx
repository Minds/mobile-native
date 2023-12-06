import { useNavigation } from '@react-navigation/core';
import { MotiView } from 'moti';
import React from 'react';
import { StatusBar, View } from 'react-native';
import { Screen, ScreenHeader } from '~ui';
import ThemedStyles from '../../../styles/ThemedStyles';

type PropsType = {
  title?: string;
  children: React.ReactNode;
  loading?: boolean;
  scroll?: boolean;
  extra?: React.ReactNode;
  onBack?: () => void;
  back?: boolean;
  leftComponent?: React.ReactNode;
  borderless?: boolean;
  headerHidden?: boolean;
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
  borderless,
  headerHidden,
}: PropsType) => {
  const theme = ThemedStyles.style;
  const navigation = useNavigation();
  const goBackPress = React.useCallback(
    () => navigation.goBack(),
    [navigation],
  );

  return (
    <Screen loading={loading} scroll={scroll} safe hasMaxWidth={false}>
      <StatusBar backgroundColor={theme.bgPrimaryBackground.backgroundColor} />
      <MotiView
        transition={{
          mass: 0.3,
        }}
        animate={{
          transform: [{ translateY: headerHidden ? -100 : 0 }],
        }}>
        <ScreenHeader
          title={title}
          extra={extra}
          centerTitle
          backIcon="close"
          onBack={onBack || goBackPress}
          back={back}
          border={!borderless}
          leftComponent={leftComponent}
        />
      </MotiView>

      <View style={theme.flexContainer}>{children}</View>
    </Screen>
  );
};
