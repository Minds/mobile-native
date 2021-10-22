import React from 'react';
import { Spacer } from '~ui/layout';

const ScreenSection = ({ children, ...more }) => {
  return (
    <Spacer horizontal="4x" {...more}>
      {children}
    </Spacer>
  );
};

export default ScreenSection;
