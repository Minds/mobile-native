import { useNavigation } from '@react-navigation/core';
import React from 'react';
import BaseNotice from '~/common/components/in-feed-notices/notices/BaseNotice';
import { useTranslation } from '../locales';

export default function InAppVerificationPrompt() {
  const navigation = useNavigation();
  const { t } = useTranslation();
  return (
    <BaseNotice
      title={t('Verify Account')}
      description={t(
        'Please verify your channel with the privacy-preserving human detector in order to be eligible for rewards.',
      )}
      btnText={t('Verify')}
      iconName="warning"
      onPress={() => navigation.navigate('InAppVerification')}
    />
  );
}
