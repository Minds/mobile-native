import React from 'react';
import { observer } from 'mobx-react';
import { View, StyleSheet, Text } from 'react-native';
import Input from '../../common/components/Input';
import ThemedStyles from '../../styles/ThemedStyles';
import type { FabScreenStore } from './FabScreen';
import LabeledComponent from '../../common/components/LabeledComponent';
import type WalletStore from '../../wallet/WalletStore';
import { CheckBox } from 'react-native-elements';

type propsType = {
  store: FabScreenStore;
  wallet: WalletStore;
};

const TokensForm = observer(({ store, wallet }: propsType) => {
  const theme = ThemedStyles.style;

  return (
    <View>
      <Input
        labelStyle={styles.label}
        style={[theme.marginBottom2x, styles.input]}
        placeholder={'Tokens'}
        onChangeText={store.setAmount}
        value={store.amount}
        testID="fabTokensInput"
        keyboardType="decimal-pad"
      />

      <LabeledComponent
        label="Wallet Balance"
        wrapperStyle={theme.marginBottom4x}>
        <Text style={theme.colorPrimaryText}>{wallet.formattedBalance}</Text>
      </LabeledComponent>

      <LabeledComponent label="Repeat Payment Monthly">
        <CheckBox
          containerStyle={[theme.checkbox, styles.checkbox]}
          title={<Text style={[theme.colorPrimaryText]}>Repeat ?</Text>}
          checked={store.recurring}
          onPress={store.setRepeat}
        />
      </LabeledComponent>
    </View>
  );
});

const styles = StyleSheet.create({
  label: {
    fontSize: 13,
    marginBottom: 10,
  },
  input: {
    height: 30,
    padding: 0,
    paddingLeft: 10,
  },
  checkbox: {
    marginRight: 0,
    marginTop: 0,
    paddingTop: 0,
  },
});

export default TokensForm;
