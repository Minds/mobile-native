import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import React from 'react';

import i18n from '~/common/services/i18n.service';
// import openUrlService from '~/common/services/open-url.service';
import sessionService from '~/common/services/session.service';
import InFeedNotice from './BaseNotice';
import { NoticeProps } from '.';
import { TENANT } from '~/config/Config';

/**
 * Boost channel notice
 */
function BoostChannelNotice({ name }: NoticeProps) {
  const navigation = useNavigation();

  // on button press
  const onPress = () => {
    const channel = sessionService.getUser();
    if (channel) {
      navigation.navigate('BoostScreenV2', {
        entity: channel,
        boostType: 'channel',
      });
    }
  };

  return (
    <InFeedNotice
      name={name}
      title={i18n.t('inFeedNotices.boostChannelTitle')}
      description={i18n.t('inFeedNotices.boostChannelDescription', {
        TENANT,
      })}
      btnText={i18n.t('inFeedNotices.boostChannelButton')}
      btnSecondaryText={i18n.t('inFeedNotices.boostChannelLearMoreButton')}
      iconName="info-outline"
      onPress={onPress}
      // onSecondaryPress={() => {
      //   openUrlService.open('https://www.minds.com/boost');
      // }}
    />
  );
}

export default observer(BoostChannelNotice);
