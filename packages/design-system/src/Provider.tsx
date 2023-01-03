import React from 'react';
import { TamaguiProvider, TamaguiProviderProps } from '@tamagui/core';
import config from './tamagui.config';
import { useFontsLoaded } from './config/fonts';

export function UIProvider({
  children,
  ...rest
}: Omit<TamaguiProviderProps, 'config'>) {
  const [fontsLoaded] = useFontsLoaded();
  if (!fontsLoaded) {
    return null;
  }
  return (
    <TamaguiProvider
      config={config}
      disableInjectCSS
      defaultTheme={'light'}
      {...rest}>
      {children}
    </TamaguiProvider>
  );
}
