import React from 'react';
import CloseableModal, { CloseableModalProps } from './CloseableModal';

type Props = CloseableModalProps & {
  uri: string;
};

export default function ({
  isVisible,
  closeButtonPosition = 'right',
  uri,
  onCloseButtonPress,
}: Props) {
  // lazy load
  const WebView = require('react-native-webview').WebView;
  return (
    <CloseableModal
      isVisible={isVisible}
      coverScreen={false}
      onCloseButtonPress={onCloseButtonPress}
      closeButtonPosition={closeButtonPosition}>
      <WebView
        source={{
          uri,
        }}
        bounces={true}
        scrollEnabled={true}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
      />
    </CloseableModal>
  );
}
