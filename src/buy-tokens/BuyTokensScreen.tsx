import React, { useEffect } from 'react';
import { ScrollView, View, StyleSheet, Pressable, Linking } from 'react-native';
import { autorun } from 'mobx';
import { observer, useLocalStore } from 'mobx-react';
import ThemedStyles from '../styles/ThemedStyles';
import Button from '../common/components/Button';
import { CheckBox } from 'react-native-elements';
import UniswapWidget from '../common/components/uniswap-widget/UniswapWidget';
import TransakWidget, {
  TransakOrderProcessed,
} from './transak-widget/TransakWidget';
import OrderReportModal, {
  OrderReport,
} from './order-report-modal/OrderReportModal';
import { startCase as _startCase } from 'lodash';
import i18n from '../common/services/i18n.service';
import mindsConfigService from '../common/services/minds-config.service';
import MText from '../common/components/MText';

type PaymentMethod = 'card' | 'bank' | 'crypto';
type PaymentOption = { type: PaymentMethod; name: string };

export const navToTokens = () => {
  Linking.openURL('https://www.minds.com/token');
};

type Store = {
  transakApiKey: string;
  tokenAddress: string;
  paymentMethod: string | null;
  orderReport: OrderReport | null;
  showOrderReport: boolean;
  showUniswapWidget: boolean;
  showTransakWidget: boolean;
  aggressTerms: boolean;
  setTransakApiKey: (transakApiKey: string) => void;
  setTokenAddress: (tokenAddress: string) => void;
  setKeys: (transakApiKey: string, tokenAddress: string) => void;
  setPaymentMethod: (paymentMethod: PaymentMethod | null) => void;
  setOrderReport: (orderReport: OrderReport) => void;
  setShowOrderReport: (show: boolean) => void;
  setShowUniswapWidget: (show: boolean) => void;
  setShowTransakWidget: (show: boolean) => void;
  setAggressTerms: (agrees: boolean) => void;
  handleTransakOrderProcessed: (order: TransakOrderProcessed) => void;
  handleTransakError: (error: any) => void;
  handleOptionSelection: (newType: PaymentMethod) => void;
};

export default observer(() => {
  const theme = ThemedStyles.style;
  const store = useLocalStore<Store>(createStore);
  const canBuyTokens = !!store.paymentMethod && store.aggressTerms;

  useEffect(() => {
    const settings = mindsConfigService.getSettings();
    store.setKeys(
      settings.blockchain.transak.api_key,
      settings.blockchain.token.address,
    );
  }, [store]);

  useEffect(() => {
    autorun(() => {
      if (store.orderReport) {
        store.setShowTransakWidget(false);
        store.setShowOrderReport(true);
      }
    });
  }, [store]);

  return (
    <>
      <ScrollView
        style={[theme.flexContainer, theme.bgPrimaryBackground]}
        contentContainerStyle={theme.padding4x}>
        <View style={theme.alignCenter}>
          <MText
            style={[
              theme.colorPrimaryText,
              theme.marginBottom5x,
              theme.fontXXL,
              theme.bold,
            ]}>
            {i18n.t('buyTokensScreen.paymentMethod')}
          </MText>
        </View>
        <View
          style={[
            theme.flexContainer,
            theme.rowJustifySpaceBetween,
            theme.marginBottom5x,
            styles.optionsContainer,
            theme.border2x,
            styles.buttonsContainer,
            theme.bcolorPrimaryBorder,
          ]}>
          {paymentMethodsList.map(({ type, name }, index) => (
            <Pressable
              style={[
                theme.bcolorPrimaryBorder,
                styles.option,
                ...buildButtonStyles(index, store.paymentMethod === type),
                store.paymentMethod === type ? theme.bgLink : '',
              ]}
              onPress={() => store.handleOptionSelection(type)}>
              <MText
                style={
                  store.paymentMethod === type
                    ? theme.colorWhite
                    : theme.colorPrimaryText
                }>
                {name}
              </MText>
            </Pressable>
          ))}
        </View>
        <View style={[theme.flexContainer, theme.rowStretch]}>
          <MText style={theme.colorPrimaryText}>
            {i18n.t('buyTokensScreen.deliverEstimate', {
              estimate: store.paymentMethod === 'bank' ? 'days' : 'minutes',
            })}
          </MText>
        </View>
        <View>
          <CheckBox
            checked={store.aggressTerms}
            onPress={() => store.setAggressTerms(!store.aggressTerms)}
            containerStyle={[theme.checkbox]}
            title={
              <MText style={[theme.colorPrimaryText, theme.marginLeft3x]}>
                {i18n.to(
                  'buyTokensScreen.terms',
                  {},
                  {
                    link: (
                      <MText
                        style={theme.link}
                        onPress={() => {
                          Linking.openURL(
                            'https://cdn-assets.minds.com/front/dist/assets/documents/TermsOfSale-v0.1.pdf',
                          );
                        }}>
                        {i18n.t('buyTokensScreen.linkText')}
                      </MText>
                    ),
                  },
                )}
              </MText>
            }
          />
        </View>
        <View style={[theme.flexContainer, theme.rowJustifySpaceBetween]}>
          <MText
            style={[theme.colorPrimaryText, styles.learMoreLink]}
            onPress={navToTokens}>
            {i18n.t('buyTokensScreen.learnMore')}
          </MText>
          <Button
            text={i18n.t('buyTokensScreen.buy')}
            containerStyle={
              [
                theme.alignCenter,
                !canBuyTokens ? styles.disabledButton : null,
              ] as any
            }
            onPress={() => {
              if (store.paymentMethod === 'crypto') {
                store.setShowUniswapWidget(!store.showUniswapWidget);
              } else {
                store.setShowTransakWidget(!store.showTransakWidget);
              }
            }}
            disabled={!canBuyTokens}
          />
        </View>
      </ScrollView>
      <UniswapWidget
        isVisible={store.showUniswapWidget}
        onCloseButtonPress={() =>
          store.setShowUniswapWidget(!store.showUniswapWidget)
        }
        tokenAddress={store.tokenAddress}
      />
      <TransakWidget
        isVisible={store.showTransakWidget}
        onOrderProcessed={store.handleTransakOrderProcessed}
        onError={store.handleTransakError}
        onCloseButtonPress={() =>
          store.setShowTransakWidget(!store.showTransakWidget)
        }
        transakApiKey={store.transakApiKey}
      />
      {store.orderReport && (
        <OrderReportModal
          isVisible={store.showOrderReport}
          onCloseButtonPress={() =>
            store.setShowOrderReport(!store.showOrderReport)
          }
          report={store.orderReport}
        />
      )}
    </>
  );
});

const createStore = (): Store => ({
  transakApiKey: '',
  tokenAddress: '',
  paymentMethod: null,
  orderReport: null,
  showOrderReport: false,
  showUniswapWidget: false,
  showTransakWidget: false,
  aggressTerms: false,
  setTransakApiKey(transakApiKey) {
    this.transakApiKey = transakApiKey;
  },
  setTokenAddress(tokenAddress) {
    this.tokenAddress = tokenAddress;
  },
  setKeys(transakApiKey, tokenAddress) {
    this.transakApiKey = transakApiKey;
    this.tokenAddress = tokenAddress;
  },
  setPaymentMethod(paymentMethod: PaymentMethod | null) {
    this.paymentMethod = paymentMethod;
  },
  setOrderReport(orderReport: OrderReport) {
    this.orderReport = orderReport;
  },
  setShowOrderReport(show: boolean) {
    this.showOrderReport = show;
  },
  setShowUniswapWidget(show: boolean) {
    this.showUniswapWidget = show;
  },
  setShowTransakWidget(show: boolean) {
    this.showTransakWidget = show;
  },
  setAggressTerms(agrees: boolean) {
    this.aggressTerms = agrees;
  },
  handleTransakOrderProcessed(order: TransakOrderProcessed) {
    const { cryptoAmount, fiatAmount, fiatCurrency, paymentOptionId } = order;
    this.setOrderReport({
      fiatAmount,
      fiatCurrency,
      tokenAmount: cryptoAmount,
      paymentMethod: _startCase(paymentOptionId),
    });
  },
  handleOptionSelection(newType: PaymentMethod) {
    const isDeselection = this.paymentMethod === newType;
    this.setPaymentMethod(isDeselection ? null : newType);
  },
  handleTransakError(data) {
    console.error(data);
  },
});

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
  buttonsContainer: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  firstOption: {},
  lastOption: {},
  learMoreLink: {
    fontSize: 15,
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
    color: '#cccccc',
  },
  closeButton: {
    zIndex: 999,
    position: 'absolute',
    right: -10,
    top: -10,
  },
});

const paymentMethodsList: PaymentOption[] = [
  { type: 'card', name: 'Card / Bank' },
  { type: 'crypto', name: 'Crypto' },
];

const buildButtonStyles = (position: number, _) => {
  switch (position) {
    case 0:
      return [styles.firstOption];
    case 1:
      return [styles.lastOption];
    default:
      return [];
  }
};
