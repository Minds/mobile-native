import React, { useEffect } from 'react';
import { View, StyleSheet, Pressable, Linking } from 'react-native';
import { autorun } from 'mobx';
import { observer, useLocalStore } from 'mobx-react';
import ThemedStyles from '../styles/ThemedStyles';
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
import {
  B1,
  B2,
  B3,
  ScreenHeader,
  ScreenSection,
  Row,
  Screen,
  Button,
} from '~ui';
import { LIQUIDITY_ENABLED } from '~/config/Config';

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

  const handleButtonPress = () => {
    if (store.paymentMethod === 'crypto') {
      store.setShowUniswapWidget(!store.showUniswapWidget);
    } else {
      store.setShowTransakWidget(!store.showTransakWidget);
    }
  };

  return (
    <>
      <Screen screenName="BuyTokensScreen" safe scroll>
        <ScreenHeader title={i18n.t('buyTokensScreen.paymentMethod')} />
        <ScreenSection>
          <Row
            align="centerBetween"
            bottom="XL"
            containerStyle={[
              styles.optionsContainer,
              theme.border2x,
              styles.buttonsContainer,
              theme.bcolorPrimaryBorder,
            ]}>
            {paymentMethodsList.map(({ type, name }, index) => {
              const isSelected = store.paymentMethod === type;
              return (
                <Pressable
                  style={[
                    theme.bcolorPrimaryBorder,
                    styles.option,
                    ...buildButtonStyles(index, isSelected),
                    isSelected ? theme.bgLink : '',
                  ]}
                  onPress={() => store.handleOptionSelection(type)}>
                  <B1 color={isSelected ? 'white' : undefined} font="bold">
                    {name}
                  </B1>
                </Pressable>
              );
            })}
          </Row>
          <B3>
            {i18n.t('buyTokensScreen.deliverEstimate', {
              estimate: store.paymentMethod === 'bank' ? 'days' : 'minutes',
            })}
          </B3>
          <View>
            <CheckBox
              checked={store.aggressTerms}
              onPress={() => store.setAggressTerms(!store.aggressTerms)}
              containerStyle={theme.checkbox}
              title={
                <B3 left="XS">
                  {i18n.to(
                    'buyTokensScreen.terms',
                    {},
                    {
                      link: (
                        <B3
                          color="link"
                          onPress={() => {
                            Linking.openURL(
                              'https://cdn-assets.minds.com/front/dist/assets/documents/TermsOfSale-v0.1.pdf',
                            );
                          }}>
                          {i18n.t('buyTokensScreen.linkText')}
                        </B3>
                      ),
                    },
                  )}
                </B3>
              }
            />
          </View>
          <Button
            top="L"
            stretch
            type="action"
            mode="outline"
            onPress={handleButtonPress}
            disabled={!canBuyTokens}>
            {i18n.t('buyTokensScreen.buy')}
          </Button>
          <Row top="XL" align="centerBoth">
            <B2 font="bold" onPress={navToTokens}>
              {i18n.t('buyTokensScreen.learnMore')}
            </B2>
          </Row>
        </ScreenSection>
      </Screen>
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
  paymentMethod: 'card',
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
    height: '100%',
    flexGrow: 1,
    flex: 1,
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

const paymentMethodsList: PaymentOption[] = LIQUIDITY_ENABLED
  ? [
      { type: 'card', name: 'Card / Bank' },
      { type: 'crypto', name: 'Crypto' },
    ]
  : [{ type: 'card', name: 'Card / Bank' }];

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
