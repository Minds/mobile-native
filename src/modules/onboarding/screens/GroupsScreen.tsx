import React from 'react';

import { Button, Screen, ScreenSection } from '~/common/ui';
import Header from '../components/Header';
import { ScrollView } from 'react-native-gesture-handler';
import GroupsListItem from '~/groups/GroupsListItem';
import { withErrorBoundary } from '~/common/components/ErrorBoundary';
import GroupModel from '~/groups/GroupModel';
import useApiQuery from '~/services/hooks/useApiQuery';
import CenteredLoading from '~/common/components/CenteredLoading';
import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';
import AuthService from '~/auth/AuthService';
const Item = withErrorBoundary(GroupsListItem);

const next = () => AuthService.setCompletedOnboard();

function GroupsScreen() {
  return (
    <Screen safe>
      <Header
        title="Join a group"
        description="Find your community, speak your mind."
        skip
        onSkip={next}
      />
      <Body />
      <ScreenSection bottom="L">
        <Button type="action" size="large" onPress={next}>
          Continue
        </Button>
      </ScreenSection>
    </Screen>
  );
}

export default withErrorBoundaryScreen(GroupsScreen);

const Body = () => {
  const { groups, isLoading } = useSuggestedGroups();

  return (
    <ScrollView>
      {isLoading && <CenteredLoading />}
      {groups &&
        groups.map(group => <Item group={group} key={group.guid} noNavigate />)}
    </ScrollView>
  );
};

type ApiResponse = {
  suggestions: Array<{ entity: GroupModel }>;
};

const useSuggestedGroups = () => {
  const query = useApiQuery<ApiResponse>(
    ['suggestedgroups'],
    'api/v2/suggestions/group',
    {
      limit: 12,
      offset: 0,
    },
  );
  const groups = React.useMemo(
    () =>
      query.data?.suggestions
        ? GroupModel.createMany(query.data.suggestions.map(item => item.entity))
        : null,
    [query.data],
  );

  return { ...query, groups };
};
