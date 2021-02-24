import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useLocalStore, observer } from 'mobx-react';
import Icon from 'react-native-vector-icons/Ionicons';
import ThemedStyles from '../../../../styles/ThemedStyles';
import InputContainer from '../../../../common/components/InputContainer';
import i18n from '../../../../common/services/i18n.service';
import type { WalletStoreType } from '../../createWalletStore';
import type { BottomOptionsStoreType } from '../../../../common/components/BottomOptionPopup';
import CenteredLoading from '../../../../common/components/CenteredLoading';
import createWithdrawStore from '../../../v3/currency-tabs/tokens/widthdrawal/createWithdrawStore';
import type { WCStore } from '../../../../blockchain/v2/walletconnect/WalletConnectContext';

type PropsType = {
  walletStore: WalletStoreType;
  bottomStore: BottomOptionsStoreType;
  wc: WCStore;
};

/**
 * Withdraw component
 */
const Withdraw = observer((props: PropsType) => {
  const theme = ThemedStyles.style;

  // local store
  // @ts-ignore
  const store = useLocalStore(createWithdrawStore, props);

  useEffect(() => {
    store.init();
  }, [store]);

  if (store.inProgress) {
    return <CenteredLoading />;
  }

  return (
    <View style={[theme.fullWidth, theme.paddingTop4x]}>
      {store.canTransfer ? (
        <>
          <InputContainer
            placeholder={i18n.t('wallet.withdraw.amount')}
            onChangeText={store.setAmount}
            value={store.amount}
            testID="amountInput"
            style={store.error ? theme.colorAlert : null}
            error={store.error}
            selectTextOnFocus={true}
          />
          <View
            style={[
              theme.borderBottom,
              theme.borderPrimary,
              theme.rowJustifySpaceBetween,
              theme.paddingHorizontal4x,
              theme.paddingVertical2x,
              theme.alignCenter,
            ]}>
            <Text style={[theme.colorSecondaryText, theme.fontL]}>
              {i18n.t('wallet.withdraw.acceptTerms')}
            </Text>
            <Icon
              onPress={store.toggleAccept}
              name={
                store.accept
                  ? 'ios-checkmark-circle-outline'
                  : 'ios-close-circle-outline'
              }
              style={
                store.accept ? theme.colorIconActive : theme.colorTertiaryText
              }
              size={34}
            />
          </View>
          <Text
            style={[
              theme.marginTop4x,
              theme.marginHorizontal4x,
              theme.colorSecondaryText,
              theme.fontL,
            ]}>
            {i18n.t('wallet.withdraw.notes1', { amount: store.amount }) +
              '\n\n'}
            {i18n.t('wallet.withdraw.notes2') + '\n\n'}
            {i18n.t('wallet.withdraw.notes3')}
          </Text>
        </>
      ) : (
        <Text
          style={[theme.fontXL, theme.colorSecondaryText, theme.textCenter]}>
          {i18n.t('wallet.withdraw.errorOnlyOnceDay')}
        </Text>
      )}
    </View>
  );
});

export default Withdraw;
