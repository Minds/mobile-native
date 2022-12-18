import { jsx, jsxs } from 'react/jsx-runtime';
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
  return /* @__PURE__ */ jsx(TamaguiProvider, {
    config,
    disableInjectCSS: true,
    defaultTheme: theme,
    ...rest,
    children: /* @__PURE__ */ jsx(Theme, {
      name: theme,
      children: /* @__PURE__ */ jsxs(Layout, {
        children: [
          /* @__PURE__ */ jsx(Button, {
            circular: true,
            mt: '$6',
            mb: '$2',
            mx: '$3',
            onPress: () =>
              setTheme(oldTheme => (oldTheme === 'dark' ? 'light' : 'dark')),
            children: theme === 'dark' ? 'L' : 'D',
          }),
          children,
        ],
      }),
    }),
  });
}
export { UIProvider };
//# sourceMappingURL=Provider.js.map
