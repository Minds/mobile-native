import { useState } from 'react';
import { TamaguiProvider, Theme } from '@tamagui/core';
import config from './tamagui.config';
import { useFontsLoaded } from './config/fonts';
import { Layout } from './View';
import { Button } from './Button';
function UIProvider({ children, ...rest }) {
  const [fontsLoaded] = useFontsLoaded();
  const [theme, setTheme] = useState('light');
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
export { UIProvider };
//# sourceMappingURL=Provider.js.map
