import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import React, { useCallback } from 'react';
import InFeedNotice from './BaseNotice';
import { NoticeProps } from '.';
import serviceProvider from '~/services/serviceProvider';

/**
 * Verify Uniqueness Notice
 */
function VerifyUniquenessNotice({ name }: NoticeProps) {
  const navigation = useNavigation();
  const i18n = serviceProvider.i18n;
  // on button press
  const onPress = useCallback(() => {
    navigation.navigate('VerifyUniqueness');
  }, [navigation]);
  const inFeedNoticesService = serviceProvider.resolve('inFeedNotices');
  if (!inFeedNoticesService.visible(name)) {
    return null;
  }

  return (
    <InFeedNotice
      name={name}
      title={i18n.t('inFeedNotices.uniquenessTitle')}
      description={i18n.t('inFeedNotices.uniquenessDescription')}
      btnText={i18n.t('onboarding.verifyUniqueness')}
      iconName="info-outline"
      onPress={onPress}
    />
  );
}

export default observer(VerifyUniquenessNotice);
