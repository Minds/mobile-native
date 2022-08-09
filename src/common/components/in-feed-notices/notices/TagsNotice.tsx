import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import React, { useCallback } from 'react';
import i18nService from '~/common/services/i18n.service';
import inFeedNoticesService from '~/common/services/in-feed.notices.service';
import InFeedNotice from './BaseNotice';

/**
 * Update Tags Notice
 */
function TagsNotice() {
  const navigation = useNavigation();

  // on button press
  const onPress = useCallback(() => {
    navigation.navigate('SelectHashtags');
  }, [navigation]);

  if (!inFeedNoticesService.visible('update-tags')) {
    return null;
  }
  return (
    <InFeedNotice
      title={i18nService.t('inFeedNotices.updatePreferences')}
      description={i18nService.t('inFeedNotices.tagsDescription')}
      btnText={i18nService.t('inFeedNotices.update')}
      iconName="info-outline"
      onPress={onPress}
    />
  );
}

export default observer(TagsNotice);
