import React, { ReactNode } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FitScrollView from '~/common/components/FitScrollView';
import LoadingOverlay from '~/common/components/LoadingOverlay';
import ThemedStyles from '~/styles/ThemedStyles';

export type ScreenPropType = {
  safe?: boolean;
  scroll?: boolean;
  loading?: boolean;
  background?: 'primary' | 'secondary' | 'tertiary';
  children?: ReactNode;
};

export const Screen = ({
  children,
  safe,
  scroll,
  loading,
  background = 'primary',
}: ScreenPropType) => {
  const Renderer = safe ? SafeAreaView : View;

  if (scroll) {
    return (
      <Renderer style={styles[background]}>
        <FitScrollView style={ThemedStyles.style.flexContainer}>
          {children}
        </FitScrollView>
        {loading && <LoadingOverlay />}
      </Renderer>
    );
  }

  return <Renderer style={styles[background]}>{children}</Renderer>;
};

const styles = ThemedStyles.create({
  primary: ['flexContainer', 'bgPrimaryBackground'],
  secondary: ['flexContainer', 'bgSecondaryBackground'],
  tertiary: ['flexContainer', 'bgTertiaryBackground'],
});
