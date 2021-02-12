import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { View, StyleSheet, Text } from 'react-native';
import Input from '../../common/components/Input';
import ThemedStyles from '../../styles/ThemedStyles';
import type { FabScreenStore } from './FabScreen';
import LabeledComponent from '../../common/components/LabeledComponent';
import { CheckBox } from 'react-native-elements';
import MindsSwitch from '../../common/components/MindsSwitch';
import i18nService from '../../common/services/i18n.service';

type propsType = {
  store: FabScreenStore;
};

const TokensForm = observer(({ store }: propsType) => {
  const theme = ThemedStyles.style;

  useEffect(() => {
    store.getLastAmount();
  }, [store]);

  useEffect(() => {
    store.getWalletBalance();
  }, [store]);

  return (
    <View>
      <Input
        labelStyle={styles.label}
        style={[theme.marginBottom2x, styles.input]}
        placeholder={'Tokens'}
        onChangeText={store.setAmount}
        value={store.amount.toString()}
        testID="fabTokensInput"
        keyboardType="decimal-pad"
      />
      <LabeledComponent label="Wallet Type" wrapperStyle={theme.marginBottom4x}>
        <MindsSwitch
          leftText={i18nService.t('blockchain.offchain')}
          rightText={i18nService.t('blockchain.onchain')}
          initialValue={true}
          rightValue={false}
          leftValue={true}
          onSelectedValueChange={(v) => store.wire.setTokenType(v)}
        />
      </LabeledComponent>

      <LabeledComponent
        label="Wallet Balance"
        wrapperStyle={theme.marginBottom4x}>
        <Text style={[theme.colorPrimaryText, theme.fontMedium, theme.fontL]}>
          {store.walletBalance}
        </Text>
      </LabeledComponent>

      {store.wire.offchain && (
        <LabeledComponent label="Repeat Payment Monthly">
          <CheckBox
            containerStyle={[theme.checkbox, styles.checkbox]}
            title={
              <Text
                style={[
                  theme.colorPrimaryText,
                  theme.fontMedium,
                  theme.paddingLeft,
                  theme.fontL,
                ]}>
                Repeat ?
              </Text>
            }
            checked={store.wire.recurring}
            onPress={store.setRepeat}
          />
        </LabeledComponent>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    height: 37,
    padding: 0,
    fontSize: 18,
    fontWeight: '400',
    fontFamily: 'Roboto-Medium',
    paddingLeft: 10,
  },
  checkbox: {
    marginRight: 0,
    marginTop: 0,
    paddingTop: 0,
  },
});

export default TokensForm;
