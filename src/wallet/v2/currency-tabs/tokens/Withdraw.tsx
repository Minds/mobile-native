import React, { useEffect } from 'react';
import { View } from 'react-native';
import { useLocalStore, observer } from 'mobx-react';
import Icon from 'react-native-vector-icons/Ionicons';
import ThemedStyles from '../../../../styles/ThemedStyles';
import InputContainer from '../../../../common/components/InputContainer';
import i18n from '../../../../common/services/i18n.service';
import type { WalletStoreType } from '../../createWalletStore';
import CenteredLoading from '../../../../common/components/CenteredLoading';
import createWithdrawStore from '../../../v3/currency-tabs/tokens/widthdrawal/createWithdrawStore';
import MText from '../../../../common/components/MText';

type PropsType = {
  walletStore: WalletStoreType;
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
            selectTextOnFocus={true}
          />
          <View
            style={[
              theme.borderBottom,
              theme.bcolorPrimaryBorder,
              theme.rowJustifySpaceBetween,
              theme.paddingHorizontal4x,
              theme.paddingVertical2x,
              theme.alignCenter,
            ]}>
            <MText style={[theme.colorSecondaryText, theme.fontL]}>
              {i18n.t('wallet.withdraw.acceptTerms')}
            </MText>
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
          <MText
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
          </MText>
        </>
      ) : (
        <MText
          style={[theme.fontXL, theme.colorSecondaryText, theme.textCenter]}>
          {i18n.t('wallet.withdraw.errorOnlyOnceDay')}
        </MText>
      )}
    </View>
  );
});

export default Withdraw;
