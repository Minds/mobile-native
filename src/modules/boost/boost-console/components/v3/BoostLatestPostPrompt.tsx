import React from 'react';
import BaseNotice from '~/common/components/in-feed-notices/notices/BaseNotice';
import ActivityModel from '~/newsfeed/ActivityModel';
import { showNotification } from '../../../../../../AppMessages';
import { useTranslation } from '../../../locales';
import { observer } from 'mobx-react';
import sp from '~/services/serviceProvider';

const BoostLatestPostPrompt = () => {
  const user = sp.session.getUser();
  const { t } = useTranslation();

  const boostLatestPost = async () => {
    const response = await sp.api.get<any>(
      `api/v2/feeds/container/${user.guid}/activities`,
      {
        sync: 1,
        limit: 12,
        as_activities: 1,
        export_user_counts: 0,
        unseen: false,
      },
    );

    if (!response?.entities.length) {
      showNotification('No posts found', 'warning');
      return;
    }

    const sortedEntitesByTimeCreated = response?.entities.sort((a, b) => {
      if (Number(a.entity?.time_created) > Number(b.entity?.time_created)) {
        return -1;
      }

      if (Number(a.entity?.time_created) < Number(b.entity?.time_created)) {
        return 1;
      }

      return 0;
    });

    const latestPost = ActivityModel.create(sortedEntitesByTimeCreated[0]);

    return sp.navigation.navigate('BoostScreenV2', {
      entity: latestPost,
    });
  };

  return (
    <BaseNotice
      dismissable={false}
      borderless
      title={t('Boost your latest post')}
      btnText={t('Boost Post')}
      description={t(
        'Get even more reach and engagement now by boosting your post.',
      )}
      iconName="boost"
      onPress={boostLatestPost}
    />
  );
};

export default observer(BoostLatestPostPrompt);
