import { useNavigation } from '@react-navigation/native';
import { useFeature } from 'ExperimentsProvider';
import { observer } from 'mobx-react-lite';
import React, { useCallback } from 'react';
import { useLegacyStores } from '~/common/hooks/use-stores';
import i18n from '~/common/services/i18n.service';
import inFeedNoticesService from '~/common/services/in-feed.notices.service';
import { PRO_PLUS_SUBSCRIPTION_ENABLED } from '~/config/Config';
import InFeedNotice from './BaseNotice';
import openUrlService from '../../../services/open-url.service';

/**
 * Upgrade to Minds plus Notice
 */
function PlusUpgradeNotice() {
  const navigation = useNavigation();
  const { user } = useLegacyStores();
  const { value: activeExperiment } = useFeature('minds-3639-plus-notice');
  let description = i18n.t('inFeedNotices.plusUpgrade.description');

  if ([1, 2, 3, 4].includes(activeExperiment)) {
    description = i18n.t(
      `inFeedNotices.plusUpgrade.descriptionVariations.${
        activeExperiment as 1 | 2 | 3 | 4
      }`,
    );
  }

  const onPress = useCallback(() => {
    navigation.navigate('UpgradeScreen', {
      onComplete: (success: any) => {
        if (success) {
          user.me.togglePlus();
        }
      },
      pro: false,
    });
  }, [navigation, user]);

  if (
    !inFeedNoticesService.visible('plus-upgrade') ||
    user.me.plus ||
    !PRO_PLUS_SUBSCRIPTION_ENABLED
  ) {
    return null;
  }

  return (
    <InFeedNotice
      title={i18n.t('inFeedNotices.plusUpgrade.title')}
      description={description}
      btnText={i18n.t('inFeedNotices.plusUpgrade.action')}
      iconName="queue"
      onPress={onPress}
      btnSecondaryText={i18n.t('inFeedNotices.plusUpgrade.secondaryAction')}
      onSecondaryPress={() =>
        openUrlService.openLinkInInAppBrowser('https://minds.com/plus')
      }
      onClose={() => inFeedNoticesService.dismiss('plus-upgrade')}
    />
  );
}

export default observer(PlusUpgradeNotice);
