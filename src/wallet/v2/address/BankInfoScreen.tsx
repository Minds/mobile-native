import React, { useCallback } from 'react';

import i18n from '../../../common/services/i18n.service';
import SaveButton from '../../../common/components/SaveButton';
import { UserError, isUserError } from '../../../common/UserError';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '../../../navigation/NavigationTypes';
import CenteredLoading from '../../../common/components/CenteredLoading';
import { observer, useLocalStore } from 'mobx-react';
import logService from '../../../common/services/log.service';
import CashOnboarding from './bank-info/CashOnboarding';
import CashForm from './bank-info/CashForm';
import createBankInfoStore from './bank-info/createBankInfoStore';

export type BankInfoScreenRouteProp = RouteProp<
  AppStackParamList,
  'BankInfoScreen'
>;
export type BankInfoScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'BankInfoScreen'
>;

type PropsType = {
  navigation: BankInfoScreenNavigationProp;
  route: BankInfoScreenRouteProp;
};

const BankInfoScreen = observer(({ navigation, route }: PropsType) => {
  const walletStore = route.params.walletStore;

  const localStore = useLocalStore(createBankInfoStore, walletStore);

  const friendlyFormKeys = {
    country: i18n.t('wallet.bank.country'),
    firstName: i18n.t('wallet.bank.firstName'),
    lastName: i18n.t('wallet.bank.lastName'),
    dob: i18n.t('wallet.bank.dob'),
    ssn: i18n.t('wallet.bank.ssn'),
    personalIdNumber: localStore.isCountry(['HK'])
      ? i18n.t('wallet.bank.hkid')
      : i18n.t('wallet.bank.nric'),
    street: i18n.t('wallet.bank.address'),
    city: i18n.t('wallet.bank.town'),
    state: localStore.isCountry(['US'])
      ? i18n.t('wallet.bank.state')
      : i18n.t('wallet.bank.province'),
    postCode: localStore.isCountry(['US'])
      ? i18n.t('wallet.bank.zip')
      : i18n.t('wallet.bank.postal'),
    stripeAgree: `${i18n.t('wallet.bank.agree')} ${i18n.t('wallet.bank.ssa')}`,
    accountNumber: i18n.t('wallet.bank.iban'),
    routingNumber: i18n.t('wallet.bank.sortCode'),
  };

  /**
   * SAVE PERSONAL INFO
   */
  const save = useCallback(async () => {
    try {
      localStore.setLoading(true);

      const form = {
        country: walletStore.stripeDetails.country,
        firstName: walletStore.stripeDetails.firstName,
        lastName: walletStore.stripeDetails.lastName,
        gender: '',
        dob: walletStore.stripeDetails.dob,
        phoneNumber: walletStore.stripeDetails.phoneNumber,
        ssn: walletStore.stripeDetails.ssn,
        personalIdNumber: walletStore.stripeDetails.personalIdNumber,
        street: walletStore.stripeDetails.street,
        city: walletStore.stripeDetails.city,
        state: walletStore.stripeDetails.state,
        postCode: walletStore.stripeDetails.postCode,
        stripeAgree: localStore.stripeAgree,
      };

      Object.keys(form).forEach((key) => {
        if (!localStore.validate(form, key)) {
          const msg = i18n.t('wallet.bank.check', {
            input: `${friendlyFormKeys[key]}`,
          });

          throw new UserError(msg);
        }
      });

      await walletStore.createStripeAccount(form);
    } catch (err) {
      if (!isUserError(err)) {
        logService.exception('[BankInfoScreen] createStripeAccount', err);
      }
    } finally {
      localStore.setLoading(false);
    }
  }, [localStore, walletStore, friendlyFormKeys]);

  /**
   * SAVE BANK ACCOUNT
   */
  const saveBank = useCallback(async () => {
    try {
      localStore.setLoading(true);

      const form = {
        country: walletStore.stripeDetails.country,
        accountNumber: walletStore.stripeDetails.accountNumber,
        routingNumber: walletStore.stripeDetails.routingNumber,
      };

      Object.keys(form).forEach((key) => {
        if (!localStore.validate(form, key)) {
          const msg = i18n.t('wallet.bank.check', {
            input: `${friendlyFormKeys[key]}`,
          });

          throw new UserError(msg);
        }
      });
      await walletStore.addStripeBank(form);
      navigation.goBack();
    } catch (err) {
      if (!isUserError(err)) {
        logService.exception('[BankInfoScreen] createStripeAccount', err);
      }
    } finally {
      localStore.setLoading(false);
    }
  }, [localStore, walletStore, friendlyFormKeys, navigation]);

  if (localStore.loading) {
    return <CenteredLoading />;
  }

  /**
   * Cash Form
   */
  if (
    localStore.wallet.stripeDetails &&
    localStore.wallet.stripeDetails.hasAccount
  ) {
    navigation.setOptions({
      headerRight: () => <SaveButton onPress={saveBank} />,
    });
    return (
      <CashForm localStore={localStore} friendlyFormKeys={friendlyFormKeys} />
    );
  }

  /**
   * Personal Info
   */
  navigation.setOptions({
    headerRight: () => <SaveButton onPress={save} />,
  });

  return (
    <CashOnboarding
      localStore={localStore}
      friendlyFormKeys={friendlyFormKeys}
    />
  );
});

export default BankInfoScreen;
