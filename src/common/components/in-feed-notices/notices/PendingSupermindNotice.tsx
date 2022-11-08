import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import React from 'react';

import i18nService from '~/common/services/i18n.service';
import InFeedNotice from './BaseNotice';

/**
 * Pending Supermind Notice
 */
function PendingSupermindNotice() {
  const navigation = useNavigation();

  // on button press
  const onPress = () => {
    navigation.navigate('More', { screen: 'SupermindConsole' });
  };

  return (
    <InFeedNotice
      title={i18nService.t('inFeedNotices.pendingSupermind')}
      description={i18nService.t('inFeedNotices.pendingSupermindDescription')}
      btnText={i18nService.t('inFeedNotices.pendingSupermindButton')}
      iconName="info-outline"
      onPress={onPress}
      dismissable={false}
    />
  );
}

export default observer(PendingSupermindNotice);
