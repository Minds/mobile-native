import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';

import MText from '~/common/components/MText';

import type UserModel from '~/channel/UserModel';
import MenuItem from '~/common/components/menus/MenuItem';
import { AppStackScreenProps } from '~/navigation/NavigationTypes';
import { WalletStoreType } from '~/wallet/v2/createWalletStore';
import requireUniquenessVerification from '~/common/helpers/requireUniquenessVerification';
import sp from '~/services/serviceProvider';

type PropsType = {
  user: UserModel;
  walletStore: WalletStoreType;
  navigation: AppStackScreenProps<'InAppVerification'>['navigation'];
};

//TODO: Remove BottomOptions logic and replace it with new Bottomsheets
const Setup = ({ user, walletStore, navigation }: PropsType) => {
  const theme = sp.styles.style;
  const i18n = sp.i18n;
  const onComplete = useCallback(
    (success: any) => {
      if (success) {
        user.togglePlus();
      }
    },
    [user],
  );

  let walletSetup;

  walletSetup = [
    {
      title: (
        <MText style={[titleStyle, user.rewards ? theme.strikeThrough : null]}>
          {i18n.t('onboarding.verifyUniqueness')}
        </MText>
      ),
      onPress: requireUniquenessVerification,
      icon: user.rewards ? 'md-checkmark' : undefined,
      noIcon: !user.rewards,
    },
    {
      title: (
        <MText style={[titleStyle, user.plus ? theme.strikeThrough : null]}>
          {i18n.t('monetize.plusHeader')}
        </MText>
      ),
      onPress: () => {
        if (!user.plus) {
          navigation.navigate('UpgradeScreen', { onComplete, pro: false });
        }
      },
      icon: walletStore.wallet.receiver.address ? 'md-checkmark' : undefined,
      noIcon: !user.plus,
    },
  ];
  return (
    <View style={theme.paddingTop7x}>
      <MText style={[styles.text, theme.colorSecondaryText]}>
        {i18n.t('wallet.tokens.completeToTransfer')}
      </MText>
      {walletSetup.map((item, i) => (
        <MenuItem
          {...item}
          key={i}
          containerItemStyle={theme.bgPrimaryBackground}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    marginLeft: 20,
    marginBottom: 25,
    marginRight: 25,
  },
});

const titleStyle = sp.styles.combine(
  {
    paddingVertical: 15,
    fontSize: 17,
  },
  'colorPrimaryText',
);

export default Setup;
