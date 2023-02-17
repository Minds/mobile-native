import React, { ReactNode } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FitScrollView from '~/common/components/FitScrollView';
import LoadingOverlay from '~/common/components/LoadingOverlay';
import ThemedStyles from '~/styles/ThemedStyles';
import { PerformanceView } from 'services/performance';

export type ScreenPropType = {
  safe?: boolean;
  scroll?: boolean;
  loading?: boolean;
  background?: 'primary' | 'secondary' | 'tertiary';
  children?: ReactNode;
  onlyTopEdge?: boolean;
  name?: string;
};

export const Screen = ({
  children,
  safe,
  scroll,
  loading,
  background = 'primary',
  onlyTopEdge,
  name,
}: ScreenPropType) => {
  const Renderer = safe ? SafeAreaView : View;

  if (scroll) {
    return (
      <PerformanceView screenName={name ?? 'Unknown Screen'} interactive>
        <Renderer style={styles[background]}>
          <FitScrollView style={ThemedStyles.style.flexContainer}>
            {children}
          </FitScrollView>
          {loading && <LoadingOverlay />}
        </Renderer>
      </PerformanceView>
    );
  }

  return (
    <PerformanceView screenName={name ?? 'Unknown Screen'} interactive>
      <Renderer
        edges={onlyTopEdge ? ['top'] : undefined}
        style={styles[background]}>
        {children}
      </Renderer>
    </PerformanceView>
  );
};

const styles = ThemedStyles.create({
  primary: ['flexContainer', 'bgPrimaryBackground'],
  secondary: ['flexContainer', 'bgSecondaryBackground'],
  tertiary: ['flexContainer', 'bgTertiaryBackground'],
});
