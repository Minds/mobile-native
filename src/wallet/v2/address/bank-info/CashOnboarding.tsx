import React from 'react';
import { observer } from 'mobx-react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import CountrySelector from '../../../../common/components/CountrySelector';
import MenuItem from '../../../../common/components/menus/MenuItem';
import Icon from 'react-native-vector-icons/Ionicons';
import ThemedStyles from '../../../../styles/ThemedStyles';
import SettingInput from '../../../../common/components/SettingInput';
import PhoneInput from 'react-native-phone-input';
import i18n from '../../../../common/services/i18n.service';
import { BankInfoStore } from './createBankInfoStore';

type PropsType = {
  localStore: BankInfoStore;
  friendlyFormKeys: any;
};

const CashOnboarding = observer(
  ({ localStore, friendlyFormKeys }: PropsType) => {
    const theme = ThemedStyles.style;

    const checkIcon = (
      <Icon size={30} name="md-checkmark" style={theme.colorIcon} />
    );

    return (
      <ScrollView keyboardShouldPersistTaps={true}>
        <CountrySelector
          onlyAllowed="allowedCountriesBankAccount"
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
            value={localStore.dob}
            testID="firstNameInput"
            wrapperBorder={theme.borderTop}
            dateFormat={'ISOString'}
            inputType={'dateInput'}
          />
        </View>
        <View style={[theme.backgroundSecondary, styles.phoneContainer]}>
          <Text
            style={[
              theme.colorSecondaryText,
              theme.fontL,
              theme.marginBottom2x,
            ]}>
            {i18n.t('wallet.bank.phoneNumber')}
          </Text>
          <PhoneInput
            style={styles.phoneInput}
            textStyle={theme.colorPrimaryText}
            value={localStore.wallet.stripeDetails.phoneNumber}
            onChangePhoneNumber={localStore.setPhoneNumber}
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
        <View style={theme.marginVertical3x}>
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
          {!localStore.isCountry(['US', 'AU', 'CA', 'IE']) && (
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
        <View>
          <MenuItem
            item={{
              onPress: localStore.setStripeAgree,
              title: friendlyFormKeys.stripeAgree,
              icon: localStore.stripeAgree ? checkIcon : undefined,
              noIcon: !localStore.stripeAgree,
            }}
          />
        </View>
      </ScrollView>
    );
  },
);

const styles = StyleSheet.create({
  phoneContainer: {
    paddingTop: 15,
    paddingBottom: 20,
    paddingLeft: 20,
    marginVertical: 15,
  },
  phoneInput: {
    flexBasis: 0,
    flexGrow: 1,
    marginLeft: 0,
    paddingRight: 10,
  },
});

export default CashOnboarding;
