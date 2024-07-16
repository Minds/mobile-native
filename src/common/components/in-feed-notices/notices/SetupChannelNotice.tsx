import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import React, { useCallback } from 'react';
import useCurrentUser from '~/common/hooks/useCurrentUser';
import InFeedNotice from './BaseNotice';
import { NoticeProps } from '.';
import { TENANT } from '~/config/Config';
import serviceProvider from '~/services/serviceProvider';

/**
 * Setup Channel Notice
 */
function SetupChannelNotice({ name }: NoticeProps) {
  const navigation = useNavigation();
  const user = useCurrentUser();
  const i18n = serviceProvider.i18n;

  const inFeedNoticesService = serviceProvider.resolve('inFeedNotices');
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
      title={i18n.t('inFeedNotices.whois', { name: user?.name })}
      description={i18n.t('inFeedNotices.userDescription', {
        TENANT,
      })}
      btnText={i18n.t('inFeedNotices.userButton')}
      iconName="info-outline"
      onPress={onPress}
    />
  );
}

export default observer(SetupChannelNotice);
