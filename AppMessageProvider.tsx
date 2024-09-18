import React from 'react';

import { ThemeProvider } from 'styled-components';
import {
  ToastContext,
  ToastProvider,
} from '@msantang78/react-native-styled-toast';
import { registerToast } from 'AppMessages';
import sp from '~/services/serviceProvider';

export default function AppMessageProvider({ children }) {
  const themedStyles = sp.styles;
  const themeValue = themedStyles.theme;

  const theme = React.useMemo(() => {
    const bg = themedStyles.getColor('PrimaryBorder');

    return {
      space: [0, 4, 8, 12, 16, 20, 24, 32, 40, 48],
      colors: {
        text: themedStyles.getColor('PrimaryText'),
        background: bg,
        border: bg,
        muted: bg,
        success: '#7DBE31',
        error: '#FC0021',
        info: '#00FFFF',
      },
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [themeValue]);
  return (
    <ThemeProvider theme={theme}>
      {/* @ts-ignore TODO: Add children type to the fork*/}
      <ToastProvider position="TOP" offset={20} maxToasts={5}>
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
