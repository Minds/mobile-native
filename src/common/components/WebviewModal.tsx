import React from 'react';
import WebView from 'react-native-webview';
import CloseableModal, { CloseableModalProps } from './CloseableModal';

const modalInjectedScript =
  'window.ReactNativeWebView.postMessage(Math.max(document.body.offsetHeight, document.body.scrollHeight));';

type Props = CloseableModalProps & {
  uri: string;
};

export default function ({
  isVisible,
  closeButtonPosition = 'right',
  uri,
  onCloseButtonPress,
}: Props) {
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
        scrollEnabled={false}
        injectedJavaScript={modalInjectedScript}
      />
    </CloseableModal>
  );
}
