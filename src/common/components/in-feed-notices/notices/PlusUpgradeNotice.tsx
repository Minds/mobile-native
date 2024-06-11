import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import React, { useCallback } from 'react';
import useCurrentUser from '~/common/hooks/useCurrentUser';
import i18n from '~/common/services/i18n.service';
import inFeedNoticesService from '~/common/services/in-feed.notices.service';
import InFeedNotice from './BaseNotice';
import { NoticeProps } from '.';

/**
 * Upgrade to Minds plus Notice
 */
function PlusUpgradeNotice({ name }: NoticeProps) {
  const navigation = useNavigation();
  const user = useCurrentUser()!;

  const description = i18n.t('inFeedNotices.plusUpgrade.description');

  const onPress = useCallback(() => {
    navigation.navigate('UpgradeScreen', {
      onComplete: (success: any) => {
        if (success) {
          user.togglePlus();
        }
      },
      pro: false,
    });
  }, [navigation, user]);

  if (!inFeedNoticesService.visible(name) || user.plus) {
    return null;
  }

  return (
    <InFeedNotice
      name={name}
      title={i18n.t('inFeedNotices.plusUpgrade.title')}
      description={description}
      btnText={i18n.t('inFeedNotices.plusUpgrade.action')}
      iconName="queue"
      onPress={onPress}
    />
  );
}

export default observer(PlusUpgradeNotice);
