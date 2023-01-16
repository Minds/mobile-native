import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import React, { useCallback } from 'react';
import useCurrentUser from '~/common/hooks/useCurrentUser';
import i18nService from '~/common/services/i18n.service';
import inFeedNoticesService from '~/common/services/in-feed.notices.service';
import InFeedNotice from './BaseNotice';

/**
 * Setup Channel Notice
 */
function SetupChannelNotice() {
  const navigation = useNavigation();
  const user = useCurrentUser();

  // on button press
  const onPress = useCallback(() => {
    navigation.navigate('SetupChannel');
  }, [navigation]);

  if (!inFeedNoticesService.visible('setup-channel')) {
    return null;
  }
  return (
    <InFeedNotice
      title={i18nService.t('inFeedNotices.whois', { name: user?.name })}
      description={i18nService.t('inFeedNotices.userDescription')}
      btnText={i18nService.t('inFeedNotices.userButton')}
      iconName="info-outline"
      onPress={onPress}
    />
  );
}

export default observer(SetupChannelNotice);
