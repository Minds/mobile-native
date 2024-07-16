import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react-lite';
import React, { useCallback } from 'react';
import InFeedNotice from './BaseNotice';
import { NoticeProps } from '.';
import { TENANT } from '~/config/Config';
import serviceProvider from '~/services/serviceProvider';

/**
 * Update Tags Notice
 */
function TagsNotice({ name }: NoticeProps) {
  const navigation = useNavigation();
  const i18n = serviceProvider.i18n;
  // on button press
  const onPress = useCallback(() => {
    navigation.navigate('SelectHashtags');
  }, [navigation]);
  const inFeedNoticesService = serviceProvider.resolve('inFeedNotices');
  if (!inFeedNoticesService.visible(name)) {
    return null;
  }
  return (
    <InFeedNotice
      name={name}
      title={i18n.t('inFeedNotices.updatePreferences')}
      description={i18n.t('inFeedNotices.tagsDescription', {
        TENANT,
      })}
      btnText={i18n.t('inFeedNotices.update')}
      iconName="info-outline"
      onPress={onPress}
    />
  );
}

export default observer(TagsNotice);
