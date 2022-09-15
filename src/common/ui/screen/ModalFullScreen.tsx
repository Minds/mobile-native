import { useNavigation } from '@react-navigation/core';
import { MotiView } from 'moti';
import React from 'react';
import { View } from 'react-native';
import ThemedStyles from '~/styles/ThemedStyles';
import { Screen, ScreenHeader } from '~ui';

type PropsType = {
  title?: string;
  children: React.ReactNode;
  loading?: boolean;
  scroll?: boolean;
  extra?: React.ReactNode;
  onBack?: () => void;
  back?: boolean;
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
  onBack,
  borderless,
  headerHidden,
}: PropsType) => {
  const theme = ThemedStyles.style;
  const navigation = useNavigation();
  const goBackPress = React.useCallback(() => navigation.goBack(), [
    navigation,
  ]);

  return (
    <Screen loading={loading} scroll={scroll} safe>
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
        />
      </MotiView>

      <View style={theme.flexContainer}>{children}</View>
    </Screen>
  );
};
