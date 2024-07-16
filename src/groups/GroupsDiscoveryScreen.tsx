import { observer } from 'mobx-react';
import React, { useCallback } from 'react';
import { withErrorBoundary } from '../common/components/ErrorBoundary';
import GroupsListItem from './GroupsListItem';
import withPreventDoubleTap from '../common/components/PreventDoubleTap';
import OffsetList from '../common/components/OffsetList';
import GroupModel from './GroupModel';
import { ScreenHeader, Screen } from '~/common/ui';
import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';
import { IS_TENANT } from '~/config/Config';
import sp from '~/services/serviceProvider';

const DebouncedGroupsListItem = withErrorBoundary(
  withPreventDoubleTap(GroupsListItem),
);

const GroupsDiscoveryScreen = observer(() => {
  const renderGroup = useCallback(
    (row: { item: { entity: GroupModel }; index: number }) => (
      <DebouncedGroupsListItem group={row.item.entity} index={row.index} />
    ),
    [],
  );

  const endpoint = IS_TENANT
    ? 'api/v3/multi-tenant/lists/group'
    : 'api/v2/suggestions/group';

  return (
    <Screen safe>
      <ScreenHeader title={sp.i18n.t('discovery.discoverGroups')} back />
      <OffsetList
        renderItem={renderGroup}
        fetchEndpoint={endpoint}
        endpointData={IS_TENANT ? 'data' : 'suggestions'}
        offsetPagination
      />
    </Screen>
  );
});

export default withErrorBoundaryScreen(
  GroupsDiscoveryScreen,
  'GroupsDiscoveryScreen',
);
