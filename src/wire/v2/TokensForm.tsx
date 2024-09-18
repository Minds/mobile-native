import React, { useEffect } from 'react';
import { observer } from 'mobx-react';
import { View } from 'react-native';

import type { FabScreenStore } from './FabScreen';
import LabeledComponent from '../../common/components/LabeledComponent';
import { CheckBox } from 'react-native-elements';
import MindsSwitch from '../../common/components/MindsSwitch';
import InputContainer from '../../common/components/InputContainer';
import { ONCHAIN_ENABLED } from '../../config/Config';
import MText from '../../common/components/MText';
import sp from '~/services/serviceProvider';

type propsType = {
  store: FabScreenStore;
};

const TokensForm = observer(({ store }: propsType) => {
  const theme = sp.styles.style;
  const i18n = sp.i18n;

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
        error={store.errors.amount}
      />
      <View style={theme.paddingHorizontal4x}>
        <LabeledComponent
          label="Wallet Type"
          wrapperStyle={theme.marginBottom4x}>
          {ONCHAIN_ENABLED ? (
            <MindsSwitch
              leftText={i18n.t('blockchain.offchain')}
              rightText={i18n.t('blockchain.onchain')}
              initialValue={true}
              rightValue={false}
              leftValue={true}
              onSelectedValueChange={v => store.wire.setTokenType(v)}
            />
          ) : (
            <MText style={styles.type}>{i18n.t('blockchain.offchain')}</MText>
          )}
        </LabeledComponent>

        <LabeledComponent
          label="Wallet Balance"
          wrapperStyle={theme.marginBottom4x}>
          <MText
            style={[theme.colorPrimaryText, theme.fontMedium, theme.fontL]}>
            {store.walletBalance}
          </MText>
        </LabeledComponent>

        {store.wire.offchain && (
          <LabeledComponent label="Repeat Payment Monthly">
            <CheckBox
              containerStyle={[theme.checkbox, styles.checkbox]}
              title={
                <MText
                  style={[
                    theme.colorPrimaryText,
                    theme.fontMedium,
                    theme.paddingLeft,
                    theme.fontL,
                  ]}>
                  Repeat ?
                </MText>
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

export const styles = sp.styles.create({
  type: ['fontL', 'fontMedium'],
  inputContainer: [
    'bgPrimaryBackgroundHighlight',
    'bcolorPrimaryBorder',
    'marginBottom4x',
  ],
  label: ['colorSecondaryText'],
  inputText: ['colorPrimaryText', 'marginBottom0x'],
  checkbox: {
    marginRight: 0,
    marginTop: 0,
    paddingTop: 0,
  },
});

export default TokensForm;
