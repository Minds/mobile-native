import { observer } from 'mobx-react';
import React, { useCallback } from 'react';
import { withErrorBoundary } from '../common/components/ErrorBoundary';
import GroupsListItem from './GroupsListItem';
import withPreventDoubleTap from '../common/components/PreventDoubleTap';
import OffsetList from '../common/components/OffsetList';
import GroupModel from './GroupModel';
import { View } from 'react-native';
import { ScreenHeader } from '~/common/ui';
import i18n from '~/common/services/i18n.service';
import ThemedStyles from '~/styles/ThemedStyles';

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
    <View style={ThemedStyles.style.flexContainer}>
      <ScreenHeader title={i18n.t('discovery.groups')} />
      <OffsetList
        renderItem={renderGroup}
        fetchEndpoint={'api/v1/groups/member'}
        endpointData={'groups'}
      />
    </View>
  );
});

export default GroupsListScreen;
