import React from 'react';
import MenuItem from './menus/MenuItem';
import { Icon } from '../ui';
import ThemedStyles from '~/styles/ThemedStyles';

type RefundTermsProps = {
  termsAgreed: boolean;
  onToggleTerms: (value: React.SetStateAction<boolean>) => void;
  title?: string;
};

export function RefundTermsMenuItem({
  termsAgreed,
  onToggleTerms,
  title = 'I understand this transaction is non-refundable once the recipient approves my offer',
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

const styles = ThemedStyles.create({
  termsContainer: [
    'bgPrimaryBackground',
    { borderTopWidth: 0, borderBottomWidth: 0 },
  ],
});
