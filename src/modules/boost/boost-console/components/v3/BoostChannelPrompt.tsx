import { observer } from 'mobx-react';
import React from 'react';
import BaseNotice from '~/common/components/in-feed-notices/notices/BaseNotice';
import { useTranslation } from '../../../locales';
import { pushAudienceSelector } from '../../../../../compose/ComposeAudienceSelector';
import sp from '~/services/serviceProvider';

const BoostChannelPrompt = () => {
  const user = sp.session.getUser();
  const { t } = useTranslation();

  return (
    <BaseNotice
      dismissable={false}
      borderless
      title={t('Boost a channel or group that\nyou are in')}
      btnText={t('Boost Group')}
      description={t(
        'Get even more reach and engagement now by boosting your group or channel.',
      )}
      btnSecondaryText={t('Boost Channel')}
      onPress={() => {
        pushAudienceSelector({
          mode: 'groups',
          onSelect: audience => {
            if (!audience?.group) {
              return;
            }

            sp.navigation.navigate('BoostScreenV2', {
              entity: audience.group,
              boostType: 'group',
            });
          },
          title: 'Boost a group',
        });
      }}
      iconName="boost"
      onSecondaryPress={() =>
        sp.navigation.navigate('BoostScreenV2', {
          entity: user,
          boostType: 'channel',
        })
      }
    />
  );
};

export default observer(BoostChannelPrompt);
