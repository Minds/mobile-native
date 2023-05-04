import { observer } from 'mobx-react';
import React from 'react';
import BaseNotice from '~/common/components/in-feed-notices/notices/BaseNotice';
import sessionService from '~/common/services/session.service';
import NavigationService from '~/navigation/NavigationService';
import { useTranslation } from '../../../locales';

const BoostChannelPrompt = () => {
  const user = sessionService.getUser();
  const { t } = useTranslation();

  return (
    <BaseNotice
      dismissable={false}
      borderless
      title={t('Boost your channel')}
      btnText={t('Boost Channel')}
      description={t(
        'Get even more reach and engagement now by boosting your channel.',
      )}
      iconName="boost"
      onPress={() =>
        NavigationService.navigate('BoostScreenV2', {
          entity: user,
          boostType: 'channel',
        })
      }
    />
  );
};

export default observer(BoostChannelPrompt);
