import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import React from 'react';

import i18n from '~/common/services/i18n.service';
// import openUrlService from '~/common/services/open-url.service';
import InFeedNotice from './BaseNotice';
import { NoticeProps } from '.';

/**
 * Boost partner notice
 */
function BoostPartnerNotice({ name }: NoticeProps) {
  const navigation = useNavigation();

  // on button press
  const onPress = () => {
    navigation.navigate('More', {
      screen: 'BoostSettingsScreen',
      initial: false,
    });
  };

  return (
    <InFeedNotice
      name={name}
      title={i18n.t('inFeedNotices.boostPartnerTitle')}
      description={i18n.t('inFeedNotices.boostPartnerDescription')}
      btnText={i18n.t('moreScreen.settings')}
      btnSecondaryText={i18n.t('inFeedNotices.boostPartnerButton')}
      iconName="info-outline"
      onPress={onPress}
      // onSecondaryPress={() =>
      //   openUrlService.open(
      //     'https://www.minds.com/info/blog/introducing-boost-partners-program-1477787849246904328',
      //   )
      // }
    />
  );
}

export default observer(BoostPartnerNotice);
