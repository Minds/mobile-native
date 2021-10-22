import React from 'react';
import { Spacer } from '~ui/layout';

export const ScreenSection = ({ children, ...more }) => {
  return (
    <Spacer horizontal="L" {...more}>
      {children}
    </Spacer>
  );
};
