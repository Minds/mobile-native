import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { View, Text } from 'react-native';
import ThemedStyles from '../../styles/ThemedStyles';
import type { FabScreenStore } from './FabScreen';
import LabeledComponent from '../../common/components/LabeledComponent';
import { CheckBox } from 'react-native-elements';
import MindsSwitch from '../../common/components/MindsSwitch';
import i18nService from '../../common/services/i18n.service';
import InputContainer from '../../common/components/InputContainer';

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
      <InputContainer
        containerStyle={styles.inputContainer}
        labelStyle={styles.label}
        style={styles.inputText}
        placeholder={'Tokens'}
        onChangeText={store.setAmount}
        value={store.amount.toString()}
        keyboardType="decimal-pad"
        testID="fabTokensInput"
      />
      <View style={theme.paddingHorizontal4x}>
        <LabeledComponent
          label="Wallet Type"
          wrapperStyle={theme.marginBottom4x}>
          <MindsSwitch
            leftText={i18nService.t('blockchain.offchain')}
            rightText={i18nService.t('blockchain.onchain')}
            initialValue={true}
            rightValue={false}
            leftValue={true}
            onSelectedValueChange={v => store.wire.setTokenType(v)}
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
    </View>
  );
});

export const styles = ThemedStyles.create({
  inputContainer: [
    'bgPrimaryBackgroundHighlight_Dark',
    'bcolorPrimaryBorder_Dark',
    'marginBottom4x',
  ],
  label: ['colorSecondaryText_Dark'],
  inputText: ['colorPrimaryText_Dark', 'marginBottom0x'],
  checkbox: {
    marginRight: 0,
    marginTop: 0,
    paddingTop: 0,
  },
});

export default TokensForm;
