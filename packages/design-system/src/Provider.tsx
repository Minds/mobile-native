import React, { useState } from 'react';
import { TamaguiProvider, TamaguiProviderProps, Theme } from '@tamagui/core';
import config from './tamagui.config';
import { useFontsLoaded } from './config/fonts';
import { Layout } from './View';
import { Button } from './Button';

export function UIProvider({
  children,
  ...rest
}: Omit<TamaguiProviderProps, 'config'>) {
  const [fontsLoaded] = useFontsLoaded();
  const [theme, setTheme] = useState<any>('light');
  if (!fontsLoaded) {
    return null;
  }
  return (
    <TamaguiProvider
      config={config}
      disableInjectCSS
      defaultTheme={theme}
      {...rest}>
      <Theme name={theme}>
        <Layout>
          <Button
            circular
            mt="$6"
            mb="$2"
            mx="$3"
            // theme={'primary'}
            onPress={() =>
              setTheme(oldTheme => (oldTheme === 'dark' ? 'light' : 'dark'))
            }>
            {theme === 'dark' ? 'L' : 'D'}
          </Button>
          {children}
        </Layout>
      </Theme>
    </TamaguiProvider>
  );
}
