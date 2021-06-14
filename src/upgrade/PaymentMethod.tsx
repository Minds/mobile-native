import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import i18n from '../common/services/i18n.service';
import ThemedStyles from '../styles/ThemedStyles';
import Switch from 'react-native-switch-pro';
import { UpgradeStoreType } from './createUpgradeStore';

type PropsType = {
  store: UpgradeStoreType;
};

const PaymentMethod = ({ store }: PropsType) => {
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
      <Text style={switchTextStyle}>{i18n.t('usd')}</Text>
      <Switch
        value={store.method === 'tokens'}
        onSyncPress={store.setMethod}
        circleColorActive={ThemedStyles.getColor('SecondaryText')}
        circleColorInactive={ThemedStyles.getColor('SecondaryText')}
        backgroundActive={ThemedStyles.getColor('TertiaryBackground')}
        backgroundInactive={ThemedStyles.getColor('TertiaryBackground')}
        style={theme.marginHorizontal2x}
      />
      <Text style={switchTextStyle}>tokens</Text>
    </View>
  );
};

export default PaymentMethod;

const styles = StyleSheet.create({
  switchText: {
    fontFamily: 'Roboto-Medium',
    fontSize: 15,
  },
});
