import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import React from 'react';
import InFeedNotice from './BaseNotice';
import { NoticeProps } from '.';
import sp from '~/services/serviceProvider';

/**
 * Boost partner notice
 */
function BoostPartnerNotice({ name }: NoticeProps) {
  const navigation = useNavigation();
  const i18n = sp.i18n;
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
