import { observer } from 'mobx-react';
import React, { useCallback } from 'react';
import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';
import i18n from '~/common/services/i18n.service';
import { Screen, ScreenHeader } from '~/common/ui';
import { withErrorBoundary } from '../common/components/ErrorBoundary';
import OffsetList from '../common/components/OffsetList';
import withPreventDoubleTap from '../common/components/PreventDoubleTap';
import GroupModel from './GroupModel';
import GroupsListItem from './GroupsListItem';

const DebouncedGroupsListItem = withErrorBoundary(
  withPreventDoubleTap(GroupsListItem),
);

const params = {
  membership_level: 2,
  membership_level_gte: true,
};

const GroupsManageScreen = observer(() => {
  const renderGroup = useCallback(
    (row: { item: { entity: GroupModel }; index: number }) => (
      <DebouncedGroupsListItem group={row.item} index={row.index} />
    ),
    [],
  );

  return (
    <Screen safe>
      <ScreenHeader title={i18n.t('groups.manage')} back />
      <OffsetList
        renderItem={renderGroup}
        fetchEndpoint={'api/v1/groups/member'}
        endpointData={'groups'}
        params={params}
        offsetPagination
      />
    </Screen>
  );
});

export default withErrorBoundaryScreen(
  GroupsManageScreen,
  'GroupsManageScreen',
);
