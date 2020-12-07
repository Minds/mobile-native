import React, { useState } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import ThemedStyles from '../styles/ThemedStyles';
import Button from '../common/components/Button';
import Modal from 'react-native-modal';
import { WebView } from 'react-native-webview';
import { Text } from 'react-native-animatable';

const styles = StyleSheet.create({
  optionsContainer: {
    borderWidth: 1,
    borderColor: 'green',
    height: 70,
  },
  option: {
    borderColor: 'red',
    borderWidth: 1,
    flexGrow: 1,
    flexBasis: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const modalInjectedScript =
  'window.ReactNativeWebView.postMessage(Math.max(document.body.offsetHeight, document.body.scrollHeight));';

export default function () {
  const [isModalVisible, setModalVisible] = useState(false);
  const theme = ThemedStyles.style;
  const toggleModal = () => setModalVisible(!isModalVisible);

  return (
    <>
      <Modal
        isVisible={isModalVisible}
        coverScreen={false}
        onBackButtonPress={toggleModal}>
        <View
          style={[
            theme.flexContainer,
            theme.justifyCenter,
            theme.borderRadius2x,
          ]}>
          <Button
            text="Close"
            style={[theme.padding2x]}
            onPress={toggleModal}
          />
          <WebView
            source={{
              uri:
                //TODO: this has to be dynamic
                'https://app.uniswap.org/#/swap?outputCurrency=0xb26631c6dda06ad89b93c71400d25692de89c068',
            }}
            bounces={true}
            scrollEnabled={false}
            injectedJavaScript={modalInjectedScript}
          />
        </View>
      </Modal>
      <ScrollView
        style={[theme.flexContainer, theme.backgroundPrimary]}
        contentContainerStyle={theme.padding4x}>
        <View style={[theme.alignCenter]}>
          <Text style={[theme.marginBottom5x, theme.fontXXL, theme.bold]}>
            Payment Method
          </Text>
        </View>
        <View
          style={[
            theme.flexContainer,
            theme.rowJustifySpaceBetween,
            styles.optionsContainer,
          ]}>
          <View style={styles.option}>
            <Text>Card</Text>
          </View>
          <View style={styles.option}>
            <Text>Bank</Text>
          </View>
          <View style={styles.option}>
            <Text>Crypto</Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
}
