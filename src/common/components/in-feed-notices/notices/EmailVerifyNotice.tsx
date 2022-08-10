import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';

import i18nService from '~/common/services/i18n.service';
import inFeedNoticesService from '~/common/services/in-feed.notices.service';
import { hasVariation } from 'ExperimentsProvider';
import sessionService from '~/common/services/session.service';
import InFeedNotice from './BaseNotice';

/**
 * Email Verify Notice
 */
function EmailVerifyNotice() {
  const navigation = useNavigation();
  if (!inFeedNoticesService.visible('verify-email')) {
    return null;
  }
  return (
    <InFeedNotice
      title={i18nService.t('onboarding.verifyEmailAddress')}
      description={i18nService.t('inFeedNotices.verifyEmailDescription')}
      btnText={i18nService.t('inFeedNotices.verifyEmail')}
      iconName="warning"
      onPress={() => {
        if (hasVariation('minds-3055-email-codes')) {
          sessionService.getUser().confirmEmailCode();
        } else {
          navigation.navigate('VerifyEmail');
        }
      }}
    />
  );
}

export default observer(EmailVerifyNotice);
