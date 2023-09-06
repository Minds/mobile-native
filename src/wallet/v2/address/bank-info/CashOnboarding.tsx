import React from 'react';
import { observer } from 'mobx-react';
import { View } from 'react-native';
import CountrySelector, {
  allowedCountries,
} from '../../../../common/components/CountrySelector';
import ThemedStyles from '../../../../styles/ThemedStyles';
import SettingInput from '../../../../common/components/SettingInput';
import i18n from '../../../../common/services/i18n.service';
import { BankInfoStore } from './createBankInfoStore';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DismissKeyboard from '../../../../common/components/DismissKeyboard';
import PhoneInput from 'react-native-phone-number-input';
import MText from '../../../../common/components/MText';
// import { B1 } from '../../../../common/ui';
// import MenuItemOption from '../../../../common/components/menus/MenuItemOption';
// import openUrlService from '../../../../common/services/open-url.service';

type PropsType = {
  localStore: BankInfoStore;
  friendlyFormKeys: any;
};

const CashOnboarding = observer(
  ({ localStore, friendlyFormKeys }: PropsType) => {
    const theme = ThemedStyles.style;

    return (
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="always"
        contentContainerStyle={theme.paddingBottom10x}>
        <DismissKeyboard style={theme.flexContainer}>
          <CountrySelector
            allowed={allowedCountries.allowedCountriesBankAccount}
            onSelected={localStore.setCountry}
            selected={localStore.wallet.stripeDetails.country}
          />
          <View style={theme.marginVertical3x}>
            <SettingInput
              placeholder={friendlyFormKeys.firstName}
              onChangeText={localStore.setFirstName}
              value={localStore.wallet.stripeDetails.firstName}
              testID="firstNameInput"
              wrapperBorder={theme.borderTop}
              selectTextOnFocus={true}
            />
            <SettingInput
              placeholder={friendlyFormKeys.lastName}
              onChangeText={localStore.setLastName}
              value={localStore.wallet.stripeDetails.lastName}
              testID="lastNameInput"
              wrapperBorder={[theme.borderTop, theme.borderBottom]}
              selectTextOnFocus={true}
            />
          </View>
          <View>
            <SettingInput
              placeholder={friendlyFormKeys.dob}
              onChangeText={localStore.setDob}
              value={localStore.dob || undefined}
              testID="dob"
              wrapperBorder={[theme.borderTop, theme.borderBottom]}
              dateFormat={'ISOString'}
              inputType={'dateInput'}
            />
          </View>
          <View
            style={[
              theme.bgSecondaryBackground,
              styles.phoneContainer,
              theme.bcolorPrimaryBorder,
              theme.borderTop,
              theme.borderBottom,
            ]}>
            <MText style={[theme.colorSecondaryText, theme.fontL]}>
              {i18n.t('wallet.bank.phoneNumber')}
            </MText>
            <PhoneInput
              defaultCode="US"
              onChangeFormattedText={localStore.setPhoneNumber}
              placeholder=" "
              countryPickerProps={{
                countryCodes: allowedCountries.allowedCountriesBankAccount,
              }}
              {...phoneInputStyles}
            />
          </View>
          {localStore.isCountry(['HK', 'SG']) && (
            <View style={theme.marginBottom3x}>
              <SettingInput
                placeholder={friendlyFormKeys.personalIdNumber}
                onChangeText={localStore.setPersonalId}
                value={localStore.wallet.stripeDetails.personalIdNumber}
                testID="personalIdInput"
                wrapperBorder={[theme.borderTop, theme.borderBottom]}
                selectTextOnFocus={true}
              />
            </View>
          )}
          {localStore.isCountry(['US']) && (
            <View style={theme.marginBottom3x}>
              <SettingInput
                placeholder={friendlyFormKeys.ssn}
                onChangeText={localStore.setSsn}
                value={localStore.wallet.stripeDetails.ssn}
                testID="personalIdInput"
                wrapperBorder={[theme.borderTop, theme.borderBottom]}
                selectTextOnFocus={true}
              />
            </View>
          )}
          <View style={theme.marginBottom3x}>
            <SettingInput
              placeholder={friendlyFormKeys.street}
              onChangeText={localStore.setAddress}
              value={localStore.wallet.stripeDetails.street}
              testID="addressInput"
              wrapperBorder={theme.borderTop}
              selectTextOnFocus={true}
            />
            {!localStore.isCountry(['SG']) && (
              <SettingInput
                placeholder={friendlyFormKeys.city}
                onChangeText={localStore.setCity}
                value={localStore.wallet.stripeDetails.city}
                testID="cityInput"
                wrapperBorder={theme.borderTop}
                selectTextOnFocus={true}
              />
            )}
            {localStore.isCountry(['US', 'AU', 'CA', 'IE', 'IN']) && (
              <SettingInput
                placeholder={friendlyFormKeys.state}
                onChangeText={localStore.setState}
                value={localStore.wallet.stripeDetails.state}
                testID="stateInput"
                wrapperBorder={theme.borderTop}
                selectTextOnFocus={true}
              />
            )}
            <SettingInput
              placeholder={friendlyFormKeys.postCode}
              onChangeText={localStore.setPostCode}
              value={localStore.wallet.stripeDetails.postCode}
              testID="postCodeInput"
              wrapperBorder={[theme.borderTop, theme.borderBottom]}
              selectTextOnFocus={true}
            />
          </View>
          {/* <View>
            <MenuItemOption
              onPress={localStore.setStripeAgree}
              multiLine
              borderless
              title={
                <B1>
                  {i18n.t('wallet.bank.agree')}{' '}
                  <MText
                    style={styles.link}
                    onPress={() =>
                      openUrlService.open('https://stripe.com/legal')
                    }>
                    {i18n.t('wallet.bank.ssa')}
                  </MText>
                  <B1> {i18n.t('and')} </B1>
                  <MText
                    style={styles.link}
                    onPress={() =>
                      openUrlService.open(
                        'https://www.minds.com/p/monetization-terms',
                      )
                    }>
                    {i18n.t('wallet.bank.mmt')}
                  </MText>
                </B1>
              }
              selected={localStore.stripeAgree}
              mode="checkbox"
            />
          </View> */}
        </DismissKeyboard>
      </KeyboardAwareScrollView>
    );
  },
);

const phoneInputStyles = ThemedStyles.create({
  containerStyle: ['bgSecondaryBackground'],
  textContainerStyle: ['bgSecondaryBackground'],
  codeTextStyle: ['colorPrimaryText'],
  textInputStyle: ['colorPrimaryText'],
  flagButtonStyle: [{ justifyContent: 'flex-start', width: 20 }],
});

const styles = ThemedStyles.create({
  phoneContainer: ['marginVertical3x', 'paddingVertical3x', 'paddingLeft3x'],
  phoneInput: {
    flexBasis: 0,
    flexGrow: 1,
    marginLeft: 0,
    paddingRight: 10,
  },
  link: [{ textDecorationLine: 'underline' }, 'colorLink'],
});

export default CashOnboarding;
