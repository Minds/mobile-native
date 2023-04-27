import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import React from 'react';

import i18nService from '~/common/services/i18n.service';
import InFeedNotice from './BaseNotice';
import { NoticeProps } from '.';

/**
 * Pending Supermind Notice
 */
function PendingSupermindNotice({ name }: NoticeProps) {
  const navigation = useNavigation();

  // on button press
  const onPress = () => {
    navigation.navigate('More', { screen: 'SupermindConsole', initial: false });
  };

  return (
    <InFeedNotice
      name={name}
      title={i18nService.t('inFeedNotices.pendingSupermind')}
      description={i18nService.t('inFeedNotices.pendingSupermindDescription')}
      btnText={i18nService.t('inFeedNotices.pendingSupermindButton')}
      iconName="info-outline"
      onPress={onPress}
    />
  );
}

export default observer(PendingSupermindNotice);
