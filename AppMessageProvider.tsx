import React from 'react';

import { ThemeProvider } from 'styled-components';
import {
  ToastContext,
  ToastProvider,
} from '@msantang78/react-native-styled-toast';
import { registerToast } from 'AppMessages';
import ThemedStyles from '~/styles/ThemedStyles';
const tinycolor = require('tinycolor2');

export default function AppMessageProvider({ children }) {
  const theme = React.useMemo(() => {
    const bg = ThemedStyles.theme
      ? tinycolor(ThemedStyles.getColor('PrimaryBackgroundHighlight'))
          // .lighten()
          .toString()
      : tinycolor(ThemedStyles.getColor('PrimaryBackgroundHighlight'))
          // .darken()
          .toString();
    return {
      space: [0, 4, 5, 12, 16, 20, 24, 32, 40, 48],
      colors: {
        text: ThemedStyles.getColor('PrimaryText'),
        background: bg,
        border: bg,
        muted: bg,
        success: '#7DBE31',
        error: '#FC0021',
        info: '#00FFFF',
      },
    };
  }, [ThemedStyles.theme]);
  return (
    <ThemeProvider theme={theme}>
      <ToastProvider position="TOP">
        <ToastContext.Consumer>
          {({ toast }) => {
            registerToast(toast);
            return <></>;
          }}
        </ToastContext.Consumer>
        {children}
      </ToastProvider>
    </ThemeProvider>
  );
}
