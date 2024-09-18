import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import React, { useCallback } from 'react';
import InFeedNotice from './BaseNotice';
import { NoticeProps } from '.';
import { TENANT } from '~/config/Config';
import serviceProvider from '~/services/serviceProvider';

/**
 * Invite a Friend Notice
 */
function InviteFriendsNotice({ name }: NoticeProps) {
  const navigation = useNavigation();
  const i18n = serviceProvider.i18n;
  const onPress = useCallback(() => {
    navigation.navigate('AffiliateProgram');
  }, [navigation]);
  const inFeedNoticesService = serviceProvider.resolve('inFeedNotices');
  if (!inFeedNoticesService.visible(name)) {
    return null;
  }
  return (
    <InFeedNotice
      name={name}
      title={i18n.t('inFeedNotices.inviteFriendsTitle')}
      description={i18n.t('inFeedNotices.inviteFriendsDescription', {
        TENANT,
      })}
      btnText={i18n.t('inFeedNotices.inviteFriendsAction')}
      iconName="info-outline"
      onPress={onPress}
    />
  );
}

export default observer(InviteFriendsNotice);
