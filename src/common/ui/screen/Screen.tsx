import React, { ReactNode } from 'react';
import { View } from 'react-native';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';
import FitScrollView from '~/common/components/FitScrollView';
import LoadingOverlay from '~/common/components/LoadingOverlay';
import ThemedStyles from '~/styles/ThemedStyles';

export type ScreenPropType = {
  safe?: boolean;
  scroll?: boolean;
  loading?: boolean;
  background?: 'primary' | 'secondary' | 'tertiary';
  children?: ReactNode;
  onlyTopEdge?: boolean;
  edges?: Edge[];
  hasMaxWidth?: boolean;
};

export const Screen = ({
  children,
  safe,
  scroll,
  loading,
  background = 'primary',
  onlyTopEdge,
  edges,
  hasMaxWidth = true,
}: ScreenPropType) => {
  const Renderer = safe ? SafeAreaView : View;

  if (scroll) {
    return (
      <Renderer
        edges={onlyTopEdge ? ['top'] : edges}
        style={[styles[background], hasMaxWidth && styles.maxWidth]}>
        <FitScrollView style={ThemedStyles.style.flexContainer}>
          {children}
        </FitScrollView>
        {loading && <LoadingOverlay />}
      </Renderer>
    );
  }

  return (
    <Renderer
      edges={onlyTopEdge ? ['top'] : edges}
      style={[styles[background], hasMaxWidth && styles.maxWidth]}>
      {children}
    </Renderer>
  );
};

const styles = ThemedStyles.create({
  primary: ['flexContainer', 'bgPrimaryBackground'],
  secondary: ['flexContainer', 'bgSecondaryBackground'],
  tertiary: ['flexContainer', 'bgTertiaryBackground'],
  maxWidth: ['alignSelfCenterMaxWidth'],
});
