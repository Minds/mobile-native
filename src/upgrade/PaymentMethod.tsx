import React from 'react';
import { View, StyleSheet } from 'react-native';
import i18n from '../common/services/i18n.service';
import ThemedStyles from '../styles/ThemedStyles';
import { UpgradeStoreType } from './createUpgradeStore';
import MText from '../common/components/MText';
import Switch from '~/common/components/controls/Switch';
import { observer } from 'mobx-react';

type PropsType = {
  store: UpgradeStoreType;
  cashName?: string;
};

const PaymentMethod = ({ store, cashName }: PropsType) => {
  const theme = ThemedStyles.style;
  const switchTextStyle = [styles.switchText, theme.colorPrimaryText];
  return (
    <View
      style={[
        theme.rowJustifyStart,
        theme.padding4x,
        theme.bcolorPrimaryBorder,
        theme.borderTopHair,
      ]}>
      <MText style={switchTextStyle}>{cashName || i18n.t('usd')}</MText>
      <Switch
        value={store.method === 'tokens'}
        onChange={store.toogleMethod}
        style={theme.marginHorizontal2x}
      />
      <MText style={switchTextStyle}>Tokens</MText>
    </View>
  );
};

export default observer(PaymentMethod);

const styles = StyleSheet.create({
  switchText: {
    fontFamily: 'Roboto_500Medium',
    fontSize: 15,
  },
});
