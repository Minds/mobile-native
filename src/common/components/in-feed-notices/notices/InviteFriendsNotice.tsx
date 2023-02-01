import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import React, { useCallback } from 'react';
import i18nService from '~/common/services/i18n.service';
import inFeedNoticesService from '~/common/services/in-feed.notices.service';
import InFeedNotice from './BaseNotice';

/**
 * Invite a Friend Notice
 */
function InviteFriendsNotice() {
  const navigation = useNavigation();

  const onPress = useCallback(() => {
    navigation.navigate('Referrals');
  }, [navigation]);

  if (!inFeedNoticesService.visible('invite-friends')) {
    return null;
  }
  return (
    <InFeedNotice
      title={i18nService.t('inFeedNotices.inviteFriendsTitle')}
      description={i18nService.t('inFeedNotices.inviteFriendsDescription')}
      btnText={i18nService.t('inFeedNotices.inviteFriendsAction')}
      iconName="info-outline"
      onPress={onPress}
    />
  );
}

export default observer(InviteFriendsNotice);
