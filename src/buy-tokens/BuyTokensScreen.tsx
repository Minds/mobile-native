import React, { useState } from 'react';
import { ScrollView, View, StyleSheet, Pressable } from 'react-native';
import ThemedStyles from '../styles/ThemedStyles';
import Button from '../common/components/Button';
import Modal from 'react-native-modal';
import { WebView } from 'react-native-webview';
import { Text } from 'react-native-elements';
import { CheckBox } from 'react-native-elements';

type PaymentMethod = 'card' | 'bank' | 'crypto';
type PaymentOption = { type: PaymentMethod; name: string };

const styles = StyleSheet.create({
  optionsContainer: {
    height: 70,
  },
  option: {
    flexGrow: 1,
    flexBasis: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  firstOption: {
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  lastOption: {
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  learMoreLink: {
    fontSize: 15,
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
    color: '#cccccc',
  },
});

const paymentMethodsList: PaymentOption[] = [
  { type: 'card', name: 'Card' },
  { type: 'bank', name: 'Bank' },
  { type: 'crypto', name: 'Crypto' },
];

const modalInjectedScript =
  'window.ReactNativeWebView.postMessage(Math.max(document.body.offsetHeight, document.body.scrollHeight));';

export default function () {
  const theme = ThemedStyles.style;
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(
    null,
  );
  const [isModalVisible, setModalVisible] = useState(false);
  const [aggressTerms, setAggressTerms] = useState(false);
  const canBuyTokens = !!paymentMethod && aggressTerms;

  const toggleModal = () => setModalVisible(!isModalVisible);
  const toggleAgreesTerms = () => setAggressTerms(!aggressTerms);

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
            theme.marginBottom5x,
            styles.optionsContainer,
          ]}>
          {paymentMethodsList.map(({ type, name }, index) => (
            <Pressable
              style={[
                theme.borderPrimary,
                styles.option,
                index === 0 ? styles.firstOption : '',
                index === 1
                  ? [theme.borderTop2x, theme.borderBottom2x]
                  : theme.border2x,
                index === 2 ? styles.lastOption : '',
                paymentMethod === type ? theme.backgroundSecondary : '',
              ]}
              onPress={() => setPaymentMethod(type)}>
              <Text>{name}</Text>
            </Pressable>
          ))}
        </View>
        <View style={[theme.flexContainer, theme.rowStretch]}>
          <Text>
            {'Deliver Estimate: '}
            <Text>{`1-2 ${
              paymentMethod === 'bank' ? 'days' : 'minutes'
            }`}</Text>
          </Text>
        </View>
        <View>
          <CheckBox
            checked={aggressTerms}
            onPress={toggleAgreesTerms}
            containerStyle={[theme.checkbox]}
            title={
              <Text style={[theme.colorPrimaryText, theme.marginLeft3x]}>
                {'I have read and accept the '}
                <Text style={theme.link} onPress={() => {}}>
                  Terms Of Sale
                </Text>
                {' for the Minds Token.'}
              </Text>
            }
          />
        </View>
        <View style={[theme.flexContainer, theme.rowJustifySpaceBetween]}>
          <Text style={styles.learMoreLink}>Learn more about tokens</Text>
          <Button
            text="Buy Tokens"
            containerStyle={[
              theme.alignCenter,
              !canBuyTokens ? styles.disabledButton : '',
            ]}
            onPress={toggleModal}
            disabled={!canBuyTokens}
          />
        </View>
      </ScrollView>
    </>
  );
}
