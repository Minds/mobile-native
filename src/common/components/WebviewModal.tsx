import React from 'react';
import ThemedStyles from '../../styles/ThemedStyles';
import { StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import WebView from 'react-native-webview';
import Modal from 'react-native-modal';

const styles = StyleSheet.create({
  closeButton: {
    zIndex: 999,
    position: 'absolute',
    margin: 5,
    top: -10,
  },
  buttonRight: {
    right: -10,
  },
  buttonLeft: {
    left: -10,
  },
});

const modalInjectedScript =
  'window.ReactNativeWebView.postMessage(Math.max(document.body.offsetHeight, document.body.scrollHeight));';

type Props = {
  isVisible: boolean;
  uri: string;
  children?: React.ReactNode;
  coverScreen?: boolean;
  closeButtonPosition?: 'right' | 'left';
  onCloseButtonPress: () => void;
};

export default function ({
  isVisible,
  closeButtonPosition = 'right',
  coverScreen = false,
  uri,
  onCloseButtonPress,
}: Props) {
  const theme = ThemedStyles.style;
  return (
    <Modal
      isVisible={isVisible}
      coverScreen={coverScreen}
      onBackButtonPress={onCloseButtonPress}>
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
            closeButtonPosition === 'right'
              ? styles.buttonRight
              : styles.buttonLeft,
          ]}
        />
        <WebView
          source={{
            uri,
          }}
          bounces={true}
          scrollEnabled={false}
          injectedJavaScript={modalInjectedScript}
        />
      </View>
    </Modal>
  );
}
