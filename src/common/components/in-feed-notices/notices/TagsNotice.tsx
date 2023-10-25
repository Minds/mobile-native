import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import React, { useCallback } from 'react';
import i18nService from '~/common/services/i18n.service';
import inFeedNoticesService from '~/common/services/in-feed.notices.service';
import InFeedNotice from './BaseNotice';
import { NoticeProps } from '.';
import { TENANT } from '~/config/Config';

/**
 * Update Tags Notice
 */
function TagsNotice({ name }: NoticeProps) {
  const navigation = useNavigation();

  // on button press
  const onPress = useCallback(() => {
    navigation.navigate('SelectHashtags');
  }, [navigation]);

  if (!inFeedNoticesService.visible(name)) {
    return null;
  }
  return (
    <InFeedNotice
      name={name}
      title={i18nService.t('inFeedNotices.updatePreferences')}
      description={i18nService.t('inFeedNotices.tagsDescription', {
        TENANT,
      })}
      btnText={i18nService.t('inFeedNotices.update')}
      iconName="info-outline"
      onPress={onPress}
    />
  );
}

export default observer(TagsNotice);
