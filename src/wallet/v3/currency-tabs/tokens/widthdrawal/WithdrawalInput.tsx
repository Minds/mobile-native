import { observer, useLocalStore } from 'mobx-react';
import React, { useEffect } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { WCStore } from '../../../../../blockchain/v2/walletconnect/WalletConnectContext';
import Button from '../../../../../common/components/Button';
import InputContainer from '../../../../../common/components/InputContainer';
import MText from '../../../../../common/components/MText';
import i18n from '../../../../../common/services/i18n.service';
import ThemedStyles from '../../../../../styles/ThemedStyles';
import { WalletStoreType } from '../../../../v2/createWalletStore';
import createWithdrawStore from './createWithdrawStore';

type TypeProps = {
  walletStore: WalletStoreType;
  navigation: any;
  wc: WCStore;
};

const WithdrawalInput = observer((props: TypeProps) => {
  const theme = ThemedStyles.style;
  const balance = props.walletStore.wallet.offchain.balance;
  const store = useLocalStore(createWithdrawStore, props);
  useEffect(() => {
    store.init();
  }, [store]);
  const vPadding =
    Platform.OS === 'android' ? theme.paddingVertical0x : theme.paddingVertical;
  const marginB =
    Platform.OS === 'android' ? theme.marginBottom0x : theme.marginBottom;
  const commonProps = {
    keyboardType: 'decimal-pad',
    selectTextOnFocus: true,
    style: vPadding,
    containerStyle: [theme.bgPrimaryBackgroundHighlight, theme.borderBottom],
    labelStyle: [marginB, theme.fontM],
  };
  return (
    <View style={[theme.paddingTop7x, theme.flexContainer]}>
      <InputContainer
        placeholder={i18n.t('wallet.tokens.tokenAmount')}
        onChangeText={store.setAmount}
        value={store.amount}
        noBottomBorder
        {...commonProps}
      />
      <MText style={[styles.balanceText, theme.colorSecondaryText]}>
        {i18n.t('blockchain.balance')}:{' '}
        <MText style={[styles.balanceText, theme.colorPrimaryText]}>
          {balance}
        </MText>{' '}
        tokens
      </MText>
      <MText
        style={[theme.colorSecondaryText, styles.text, theme.marginBottom3x]}>
        {i18n.t('wallet.tokens.transferRequest')}
      </MText>
      <MText style={[theme.colorSecondaryText, styles.text]}>
        {i18n.t('wallet.tokens.transferNote')}
      </MText>
      <View style={styles.buttonContainer}>
        <Button
          onPress={store.onPressTransfer}
          text={i18n.t('wallet.withdraw.transfer')}
          containerStyle={theme.alignSelfEnd}
          action
          loading={store.inProgress}
        />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  text: {
    marginLeft: 25,
    marginRight: 20,
    fontSize: 16,
  },
  balanceText: {
    textAlign: 'right',
    paddingRight: 20,
    marginTop: 20,
    marginBottom: 47,
    fontSize: 15,
  },
});

export default WithdrawalInput;
