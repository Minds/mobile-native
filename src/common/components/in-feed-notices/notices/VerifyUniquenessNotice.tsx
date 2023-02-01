import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import React, { useCallback } from 'react';
import i18nService from '~/common/services/i18n.service';
import inFeedNoticesService from '~/common/services/in-feed.notices.service';
import { InAppVerificationPrompt } from 'modules/in-app-verification';
import InFeedNotice from './BaseNotice';
import { hasVariation } from 'ExperimentsProvider';

/**
 * Verify Uniqueness Notice
 */
function VerifyUniquenessNotice() {
  const navigation = useNavigation();

  // on button press
  const onPress = useCallback(() => {
    navigation.navigate('VerifyUniqueness');
  }, [navigation]);

  if (!inFeedNoticesService.visible('verify-uniqueness')) {
    return null;
  }

  return hasVariation('mob-4472-in-app-verification') ? (
    <InAppVerificationPrompt />
  ) : (
    <InFeedNotice
      title={i18nService.t('inFeedNotices.uniquenessTitle')}
      description={i18nService.t('inFeedNotices.uniquenessDescription')}
      btnText={i18nService.t('onboarding.verifyUniqueness')}
      iconName="info-outline"
      onPress={onPress}
    />
  );
}

export default observer(VerifyUniquenessNotice);
