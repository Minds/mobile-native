import React, { useRef } from 'react';
import { observer } from 'mobx-react';
import i18n from '../../common/services/i18n.service';
import Selector from '../../common/components/Selector';
import ThemedStyles from '../../styles/ThemedStyles';
import { BoostStoreType } from './createBoostStore';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { WalletCurrency } from '../../wallet/v2/WalletTypes';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { style } from '../../common/components/phoneValidation/partials/styles';

type PropsType = {
  localStore: BoostStoreType;
};

const BoostPayment = observer(({ localStore }: PropsType) => {
  const theme = ThemedStyles.style;
  const selectorRef = useRef<Selector>(null);

  const getMethodLabel = (method: WalletCurrency) => (
    <Text style={[theme.fontL, theme.centered]}>
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
          theme.paddingLeft4x,
        ]}>
        {i18n.t('boosts.paymentMethod')}
      </Text>
      <TouchableOpacity
        style={[
          styles.touchable,
          theme.paddingHorizontal4x,
          theme.backgroundPrimaryHighlight,
          theme.borderPrimary,
          theme.borderTop,
          theme.borderBottom,
        ]}
        onPress={() =>
          selectorRef.current?.show(localStore.selectedPaymentMethod.label)
        }>
        {getMethodLabel(localStore.selectedPaymentMethod)}
        <Icon
          name="menu-down"
          size={24}
          color={ThemedStyles.getColor('icon')}
          style={theme.centered}
        />
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

const styles = StyleSheet.create({
  touchable: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 60,
  },
});

export default BoostPayment;
