import { observer } from 'mobx-react';
import React from 'react';
import { ScrollView } from 'react-native';
import ChannelListItem from '~/common/components/ChannelListItem';
import ChannelListItemPlaceholder from '~/common/components/ChannelListItemPlaceholder';
import Empty from '~/common/components/Empty';
import UserModel from '~/channel/UserModel';
import useApiFetch from '~/common/hooks/useApiFetch';

import ModalContainer from './ModalContainer';
import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';
import sp from '~/services/serviceProvider';

/**
 * Subscribe channels Modal Screen
 */
export default withErrorBoundaryScreen(
  observer(function SuggestedChannelsScreen() {
    const theme = sp.styles.style;
    const suggestions = useApiFetch<Array<UserModel>>(
      'api/v2/suggestions/user',
      {
        updateState: newData =>
          UserModel.createMany(newData.suggestions.map(e => e.entity)),
        params: {
          limit: 12,
          offset: 0,
        },
      },
    );

    const empty =
      !suggestions.loading && !suggestions.result?.length ? <Empty /> : null;

    const loadingPlaceholder =
      suggestions.loading &&
      !suggestions.result?.length &&
      new Array(12)
        .fill(true)
        .map((_, index) => <ChannelListItemPlaceholder key={index} />);

    return (
      <ModalContainer
        title={sp.i18n.t('onboarding.subscribeToChannel')}
        contentContainer={[
          theme.bgPrimaryBackgroundHighlight,
          theme.alignSelfCenterMaxWidth,
        ]}
        onPressBack={() => sp.navigation.goBack()}>
        <ScrollView style={theme.flexContainer}>
          {empty}
          {loadingPlaceholder}
          {suggestions.result?.slice().map(user => (
            <ChannelListItem
              updateFeed={false}
              navigation={sp.navigation}
              channel={user}
              key={user.guid}
            />
          ))}
        </ScrollView>
      </ModalContainer>
    );
  }),
  'SuggestedChannelsScreen',
);
