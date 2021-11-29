import React, { ReactNode } from 'react';
import { View, ScrollView, SafeAreaView } from 'react-native';
import ThemedStyles from '~/styles/ThemedStyles';

export type ScreenPropType = {
  safe?: boolean;
  scroll?: boolean;
  background?: 'primary' | 'secondary' | 'tertiary';
  children?: ReactNode;
};

export const Screen = ({
  children,
  safe,
  scroll,
  background = 'primary',
}: ScreenPropType) => {
  const Renderer = safe ? SafeAreaView : View;

  if (scroll) {
    return (
      <Renderer style={styles[background]}>
        <ScrollView style={ThemedStyles.style.flexContainer}>
          {children}
        </ScrollView>
      </Renderer>
    );
  }

  return <Renderer style={styles[background]}>{children}</Renderer>;
};

const styles = ThemedStyles.create({
  primary: ['flexContainer', 'bgPrimaryBackground'],
  secondary: ['flexContainer', 'bgPrimaryBackground'],
  tertiary: ['flexContainer', 'bgPrimaryBackground'],
});
