import { observer } from 'mobx-react';
import React, { useCallback } from 'react';
import { withErrorBoundary } from '../common/components/ErrorBoundary';
import GroupsListItem from './GroupsListItem';
import withPreventDoubleTap from '../common/components/PreventDoubleTap';
import OffsetList from '../common/components/OffsetList';
import GroupModel from './GroupModel';
import { ScreenHeader, Screen } from '~/common/ui';
import i18n from '~/common/services/i18n.service';
import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';

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
    <Screen safe>
      <ScreenHeader title={i18n.t('discovery.groups')} />
      <OffsetList
        renderItem={renderGroup}
        fetchEndpoint={'api/v1/groups/member'}
        endpointData={'groups'}
      />
    </Screen>
  );
});

export default withErrorBoundaryScreen(GroupsListScreen, 'GroupsListScreen');
