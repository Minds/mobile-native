import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';

import InFeedNotice from './BaseNotice';
import { NoticeProps } from '.';
import serviceProvider from '~/services/serviceProvider';

/**
 * Pending Supermind Notice
 */
function PendingSupermindNotice({
  name,
  onPress,
}: NoticeProps & { onPress?: () => void }) {
  const navigation = useNavigation();
  const i18n = serviceProvider.i18n;
  // on button press
  const onPressDefault = () => {
    navigation.navigate('More', {
      screen: 'SupermindConsole',
      initial: false,
      tab: 'inbound',
    });
  };

  return (
    <InFeedNotice
      name={name}
      title={i18n.t('inFeedNotices.pendingSupermind')}
      description={i18n.t('inFeedNotices.pendingSupermindDescription')}
      btnText={i18n.t('inFeedNotices.pendingSupermindButton')}
      iconName="info-outline"
      onPress={onPress || onPressDefault}
    />
  );
}

export default observer(PendingSupermindNotice);
