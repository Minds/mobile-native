import { useNavigation } from '@react-navigation/core';
import React from 'react';
import BaseNotice from '~/common/components/in-feed-notices/notices/BaseNotice';
import i18n from '~/common/services/i18n.service';

export default function InAppVerificationPrompt() {
  const navigation = useNavigation();
  return (
    <BaseNotice
      title={i18n.t('inAppVerification.notice.title')}
      description={i18n.t('inAppVerification.notice.description')}
      btnText={i18n.t('verify')}
      iconName="warning"
      onPress={() => navigation.navigate('InAppVerification')}
    />
  );
}
