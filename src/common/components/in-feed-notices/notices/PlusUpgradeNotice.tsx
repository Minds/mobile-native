import { useNavigation } from '@react-navigation/native';
import { useFeature } from 'ExperimentsProvider';
import { observer } from 'mobx-react-lite';
import React, { useCallback } from 'react';
import useCurrentUser from '~/common/hooks/useCurrentUser';
import i18n from '~/common/services/i18n.service';
import inFeedNoticesService from '~/common/services/in-feed.notices.service';
// import openUrlService from '~/common/services/open-url.service';
import InFeedNotice from './BaseNotice';
import { NoticeProps } from '.';

/**
 * Upgrade to Minds plus Notice
 */
function PlusUpgradeNotice({ name }: NoticeProps) {
  const navigation = useNavigation();
  const user = useCurrentUser()!;
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
          user.togglePlus();
        }
      },
      pro: false,
    });
  }, [navigation, user]);

  if (!inFeedNoticesService.visible(name) || user.plus) {
    return null;
  }

  return (
    <InFeedNotice
      name={name}
      title={i18n.t('inFeedNotices.plusUpgrade.title')}
      description={description}
      btnText={i18n.t('inFeedNotices.plusUpgrade.action')}
      iconName="queue"
      onPress={onPress}
      // btnSecondaryText={i18n.t('inFeedNotices.plusUpgrade.secondaryAction')}
      // onSecondaryPress={() =>
      //   openUrlService.openLinkInInAppBrowser('https://minds.com/plus')
      // }
    />
  );
}

export default observer(PlusUpgradeNotice);
