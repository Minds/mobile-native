import { observer } from 'mobx-react';
import React from 'react';
import { ScrollView } from 'react-native';
import ChannelListItem from '~/common/components/ChannelListItem';
import ChannelListItemPlaceholder from '~/common/components/ChannelListItemPlaceholder';
import UserModel from '../../../channel/UserModel';
import useApiFetch from '../../../common/hooks/useApiFetch';
import i18n from '../../../common/services/i18n.service';
import NavigationService from '../../../navigation/NavigationService';
import ThemedStyles from '../../../styles/ThemedStyles';
import ModalContainer from './ModalContainer';

/**
 * Subscribe channels Modal Screen
 */
export default observer(function SuggestedChannelsScreen() {
  const theme = ThemedStyles.style;
  const suggestions = useApiFetch<Array<UserModel>>('api/v2/suggestions/user', {
    updateState: newData =>
      UserModel.createMany(newData.suggestions.map(e => e.entity)),
    params: {
      limit: 12,
      offset: 0,
    },
  });

  return (
    <ModalContainer
      title={i18n.t('onboarding.subscribeToChannel')}
      contentContainer={theme.bgPrimaryBackgroundHighlight}
      onPressBack={NavigationService.goBack}>
      <ScrollView style={theme.flexContainer}>
        {suggestions.loading &&
          !suggestions.result?.length &&
          new Array(12).fill(true).map(() => <ChannelListItemPlaceholder />)}
        {suggestions.result?.slice().map(user => (
          <ChannelListItem
            updateFeed={false}
            navigation={NavigationService}
            channel={user}
            key={user.guid}
          />
        ))}
      </ScrollView>
    </ModalContainer>
  );
});
