import React from 'react';
import { observer } from 'mobx-react';
import { ScrollView, View } from 'react-native';

import MenuSubtitle from '~/common/components/menus/MenuSubtitle';
import CountrySelector, {
  allowedCountries,
} from '~/common/components/CountrySelector';
import SettingInput from '~/common/components/SettingInput';

import { BankInfoStore } from './createBankInfoStore';
import sp from '~/services/serviceProvider';

type PropsType = {
  localStore: BankInfoStore;
  friendlyFormKeys: any;
};

const CashForm = observer(({ localStore, friendlyFormKeys }: PropsType) => {
  const theme = sp.styles.style;
  const i18n = sp.i18n;
  return (
    <ScrollView keyboardShouldPersistTaps={true}>
      <MenuSubtitle>{i18n.t('wallet.bank.finish')}</MenuSubtitle>
      <CountrySelector
        allowed={allowedCountries.allowedCountriesBankAccount}
        onSelected={localStore.setCountry}
        selected={localStore.wallet.stripeDetails.country}
      />
      <View style={theme.marginVertical3x}>
        <SettingInput
          placeholder={friendlyFormKeys.accountNumber}
          onChangeText={localStore.setIban}
          value={localStore.wallet.stripeDetails.accountNumber}
          testID="accountNumberInput"
          wrapperBorder={theme.borderTop}
          selectTextOnFocus={true}
        />
      </View>
      {localStore.isCountry(['US']) && (
        <View>
          <SettingInput
            placeholder={friendlyFormKeys.routingNumber}
            onChangeText={localStore.setSortCode}
            value={localStore.wallet.stripeDetails.routingNumber}
            testID="routingNumberInput"
            wrapperBorder={[theme.borderTop, theme.borderBottom]}
            selectTextOnFocus={true}
          />
        </View>
      )}
    </ScrollView>
  );
});

export default CashForm;
