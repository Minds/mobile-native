import React from 'react';
import ThemedStyles from '../../styles/ThemedStyles';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/AntDesign';
import { WebView } from 'react-native-webview';
import { StyleSheet, View } from 'react-native';
import { BLOCKCHAIN_TOKEN_ADDRESS } from '../../config/Config';

type UniswapAction = 'swap' | 'add';

type Props = {
  isVisible: boolean;
  action?: UniswapAction;
  onBackButtonPress: () => void;
  onCloseButtonPress: () => void;
};

const getUniSwapURL = (action: UniswapAction) => {
  const baseURL = 'https://app.uniswap.org/#';

  if (action === 'swap') {
    return `${baseURL}/${action}?outputCurrency=${BLOCKCHAIN_TOKEN_ADDRESS}`;
  } else {
    return `${baseURL}/${action}/ETH/${BLOCKCHAIN_TOKEN_ADDRESS}`;
  }
};

const modalInjectedScript =
  'window.ReactNativeWebView.postMessage(Math.max(document.body.offsetHeight, document.body.scrollHeight));';

const styles = StyleSheet.create({
  closeButton: {
    zIndex: 999,
    position: 'absolute',
    right: -10,
    top: -10,
    margin: 5,
  },
});

export default function ({
  isVisible,
  onBackButtonPress,
  onCloseButtonPress,
  action = 'swap',
}: Props) {
  const theme = ThemedStyles.style;
  return (
    <Modal
      isVisible={isVisible}
      coverScreen={false}
      onBackButtonPress={onBackButtonPress}>
      <View
        style={[
          theme.flexContainer,
          theme.justifyCenter,
          theme.borderRadius2x,
        ]}>
        <Icon
          name="closecircleo"
          onPress={onCloseButtonPress}
          size={28}
          style={[
            theme.colorTertiaryText,
            theme.positionAbsoluteTopRight,
            styles.closeButton,
          ]}
        />
        <WebView
          source={{
            uri: getUniSwapURL(action),
          }}
          bounces={true}
          scrollEnabled={false}
          injectedJavaScript={modalInjectedScript}
        />
      </View>
    </Modal>
  );
}
