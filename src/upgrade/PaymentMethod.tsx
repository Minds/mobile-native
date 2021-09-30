import React from 'react';
import { View, StyleSheet } from 'react-native';
import i18n from '../common/services/i18n.service';
import ThemedStyles from '../styles/ThemedStyles';
import Switch from 'react-native-switch-pro';
import { UpgradeStoreType } from './createUpgradeStore';
import MText from '../common/components/MText';

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
      ]}
    >
      <MText style={switchTextStyle}>{i18n.t('usd')}</MText>
      <Switch
        value={store.method === 'tokens'}
        onSyncPress={store.setMethod}
        circleColorActive={ThemedStyles.getColor('SecondaryText')}
        circleColorInactive={ThemedStyles.getColor('SecondaryText')}
        backgroundActive={ThemedStyles.getColor('TertiaryBackground')}
        backgroundInactive={ThemedStyles.getColor('TertiaryBackground')}
        style={theme.marginHorizontal2x}
      />
      <MText style={switchTextStyle}>tokens</MText>
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
