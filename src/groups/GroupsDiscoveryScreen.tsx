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

const GroupsDiscoveryScreen = observer(() => {
  const renderGroup = useCallback(
    (row: { item: { entity: GroupModel }; index: number }) => (
      <DebouncedGroupsListItem group={row.item.entity} index={row.index} />
    ),
    [],
  );

  return (
    <Screen safe>
      <ScreenHeader title={i18n.t('discovery.discoverGroups')} back />
      <OffsetList
        renderItem={renderGroup}
        fetchEndpoint={'api/v2/suggestions/group'}
        endpointData={'suggestions'}
        offsetPagination
      />
    </Screen>
  );
});

export default withErrorBoundaryScreen(
  GroupsDiscoveryScreen,
  'GroupsDiscoveryScreen',
);
