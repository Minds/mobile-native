import { observer } from 'mobx-react';
import React from 'react';
import { withErrorBoundary } from '../common/components/ErrorBoundary';
import GroupsListItem from './GroupsListItem';
import withPreventDoubleTap from '../common/components/PreventDoubleTap';
import OffsetList from '../common/components/OffsetList';

const DebouncedGroupsListItem = withErrorBoundary(
  withPreventDoubleTap(GroupsListItem),
);

const GroupsListScreen = observer(({ navigation }) => {
  const navigateToGroup = (group) => {
    navigation.push('GroupView', {
      group: group,
      scrollToBottom: true,
    });
  };

  const renderGroup = (row) => {
    return (
      <DebouncedGroupsListItem
        group={row.item}
        onPress={() => navigateToGroup(row.item)}
      />
    );
  };

  return (
    <OffsetList
      renderItem={renderGroup}
      fetchEndpoint={'api/v1/groups/member'}
      endpointData={'groups'}
    />
  );
});

export default GroupsListScreen;
