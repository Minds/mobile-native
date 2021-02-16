import { useNavigation } from '@react-navigation/native';
import React, { useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  BottomOptionsStoreType,
  useBottomOption,
} from '../../../../../common/components/BottomOptionPopup';
import MenuItem from '../../../../../common/components/menus/MenuItem';
import { useStores } from '../../../../../common/hooks/use-stores';
import i18n from '../../../../../common/services/i18n.service';
import sessionService from '../../../../../common/services/session.service';
import ThemedStyles from '../../../../../styles/ThemedStyles';
import { WalletStoreType } from '../../../../v2/createWalletStore';
import PhoneValidator from './PhoneValidator';

const showPhoneValidator = (bottomStore: BottomOptionsStoreType) => {
  bottomStore.show(
    i18n.t('wallet.phoneVerification'),
    i18n.t('send'),
    <PhoneValidator bottomStore={bottomStore} />,
  );
};

const Setup = () => {
  const theme = ThemedStyles.style;
  const walletStore: WalletStoreType = useStores().wallet;
  const bottomStore: BottomOptionsStoreType = useBottomOption();
  const navigation = useNavigation();
  const user = sessionService.getUser();
  const onComplete = useCallback(
    (success: any) => {
      if (success) {
        user.togglePlus();
      }
    },
    [user],
  );
  const showSetup = !user.rewards || !user.plus;
  let walletSetup;

  if (showSetup) {
    walletSetup = [
      {
        title: (
          <Text
            style={[
              theme.listItemTitle,
              user.rewards ? theme.strikethrough : '',
            ]}>
            {i18n.t('wallet.phoneVerification')}
          </Text>
        ),
        onPress: () => showPhoneValidator(bottomStore),
        icon: user.rewards
          ? { name: 'md-checkmark', type: 'ionicon' }
          : undefined,
        noIcon: !user.rewards,
      },
      {
        title: (
          <Text
            style={[theme.listItemTitle, user.plus ? theme.strikethrough : '']}>
            {i18n.t('monetize.plusHeader')}
          </Text>
        ),
        onPress: () => {
          if (!user.plus) {
            navigation.navigate('PlusScreen', { onComplete, pro: false });
          }
        },
        icon: walletStore.wallet.receiver.address
          ? { name: 'md-checkmark', type: 'ionicon' }
          : undefined,
        noIcon: !user.plus,
      },
    ];
  }
  const body = showSetup ? (
    <View style={theme.paddingTop7x}>
      <Text style={[styles.text, theme.colorSecondaryText]}>
        {i18n.t('wallet.tokens.completeToTransfer')}
      </Text>
      {walletSetup.map((item, i) => (
        <MenuItem
          item={item}
          key={i}
          containerItemStyle={theme.backgroundPrimary}
        />
      ))}
    </View>
  ) : null;
  return body;
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    marginLeft: 20,
    marginBottom: 25,
    marginRight: 25,
  },
});

export default Setup;
