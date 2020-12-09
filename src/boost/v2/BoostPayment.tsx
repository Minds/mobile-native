import React, { useRef } from 'react';
import { observer } from 'mobx-react';
import i18n from '../../common/services/i18n.service';
import Selector from '../../common/components/Selector';
import ThemedStyles from '../../styles/ThemedStyles';
import { BoostStoreType } from './createBoostStore';
import { Text, TouchableOpacity, View } from 'react-native';
import { WalletCurrency } from '../../wallet/v2/WalletTypes';

type PropsType = {
  localStore: BoostStoreType;
};

const BoostPayment = observer(({ localStore }: PropsType) => {
  const theme = ThemedStyles.style;
  const selectorRef = useRef<Selector>(null);

  const getMethodLabel = (method: WalletCurrency) => (
    <Text style={theme.fontL}>
      {method.label === 'Off-chain' ? 'Off-chain' : 'On-Chain'}{' '}
      <Text style={theme.colorSecondaryText}>({method.balance} tokens)</Text>
    </Text>
  );

  return (
    <View>
      <Text
        style={[
          theme.colorSecondaryText,
          theme.marginBottom3x,
          theme.paddingLeft3x,
        ]}>
        {i18n.t('boosts.paymentMethod')}
      </Text>
      <TouchableOpacity
        style={[
          theme.padding4x,
          theme.backgroundPrimaryHighlight,
          theme.borderPrimary,
          theme.borderTop,
          theme.borderBottom,
        ]}
        onPress={() =>
          selectorRef.current?.show(localStore.selectedPaymentMethod.label)
        }>
        {getMethodLabel(localStore.selectedPaymentMethod)}
      </TouchableOpacity>
      <Selector
        ref={selectorRef}
        onItemSelect={localStore.setPaymentMethod}
        title={''}
        data={localStore.paymentMethods}
        valueExtractor={getMethodLabel}
        keyExtractor={localStore.getMethodKey}
        textStyle={theme.fontXXL}
        backdropOpacity={0.95}
      />
    </View>
  );
});

export default BoostPayment;
