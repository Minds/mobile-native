import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import React from 'react';

import i18n from '~/common/services/i18n.service';
import openUrlService from '~/common/services/open-url.service';
import InFeedNotice from './BaseNotice';

/**
 * Boost partner notice
 */
function BoostPartnerNotice() {
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
      title={i18n.t('inFeedNotices.boostPartnerTitle')}
      description={i18n.t('inFeedNotices.boostPartnerDescription')}
      btnText={i18n.t('inFeedNotices.boostPartnerButton')}
      btnSecondaryText={i18n.t('moreScreen.settings')}
      iconName="info-outline"
      onPress={() =>
        openUrlService.open(
          'https://www.minds.com/info/blog/introducing-boost-partners-program-1477787849246904328',
        )
      }
      onSecondaryPress={onPress}
    />
  );
}

export default observer(BoostPartnerNotice);
