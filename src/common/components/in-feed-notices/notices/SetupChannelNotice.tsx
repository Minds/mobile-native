import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import React, { useCallback } from 'react';
import useCurrentUser from '~/common/hooks/useCurrentUser';
import i18nService from '~/common/services/i18n.service';
import inFeedNoticesService from '~/common/services/in-feed.notices.service';
import InFeedNotice from './BaseNotice';
import { NoticeProps } from '.';
import { tenant } from '~/config/Config';

/**
 * Setup Channel Notice
 */
function SetupChannelNotice({ name }: NoticeProps) {
  const navigation = useNavigation();
  const user = useCurrentUser();

  // on button press
  const onPress = useCallback(() => {
    navigation.navigate('SetupChannel');
  }, [navigation]);

  if (!inFeedNoticesService.visible(name)) {
    return null;
  }
  return (
    <InFeedNotice
      name={name}
      title={i18nService.t('inFeedNotices.whois', { name: user?.name })}
      description={i18nService.t('inFeedNotices.userDescription', {
        tenant,
      })}
      btnText={i18nService.t('inFeedNotices.userButton')}
      iconName="info-outline"
      onPress={onPress}
    />
  );
}

export default observer(SetupChannelNotice);
