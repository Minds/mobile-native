import React from 'react';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

const withModalProvider = Component => props =>
  (
    <BottomSheetModalProvider>
      <Component {...props} />
    </BottomSheetModalProvider>
  );

export default withModalProvider;
