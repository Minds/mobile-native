import { observer } from 'mobx-react';
import React, { useCallback } from 'react';
import { withErrorBoundary } from '../common/components/ErrorBoundary';
import GroupsListItem from './GroupsListItem';
import withPreventDoubleTap from '../common/components/PreventDoubleTap';
import OffsetList from '../common/components/OffsetList';
import GroupModel from './GroupModel';

const DebouncedGroupsListItem = withErrorBoundary(
  withPreventDoubleTap(GroupsListItem),
);

const GroupsListScreen = observer(() => {
  const renderGroup = useCallback(
    (row: { item: GroupModel; index: number }) => (
      <DebouncedGroupsListItem group={row.item} index={row.index} />
    ),
    [],
  );

  return (
    <OffsetList
      renderItem={renderGroup}
      fetchEndpoint={'api/v1/groups/member'}
      endpointData={'groups'}
    />
  );
});

export default GroupsListScreen;
