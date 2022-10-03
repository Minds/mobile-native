import React from 'react';
import { StyleSheet } from 'react-native';
import MenuItem from './menus/MenuItem';
import { Icon } from '../ui';
import i18n from '../services/i18n.service';

type RefundTermsProps = {
  termsAgreed: boolean;
  onToggleTerms: (value: React.SetStateAction<boolean>) => void;
  title?: string;
};

export function RefundTermsMenuItem({
  termsAgreed,
  onToggleTerms,
  title = i18n.t('wallet.transactions.refundTerms'),
}: RefundTermsProps) {
  return (
    <MenuItem
      containerItemStyle={styles.termsContainer}
      item={{
        title,
        onPress: () => onToggleTerms(val => !val),
        icon: (
          <Icon
            size={30}
            name={termsAgreed ? 'checkbox-marked' : 'checkbox-blank'}
            color={termsAgreed ? 'Link' : 'Icon'}
          />
        ),
      }}
    />
  );
}

const styles = StyleSheet.create({
  termsContainer: { borderTopWidth: 0, borderBottomWidth: 0 },
});
