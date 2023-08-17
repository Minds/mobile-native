import { observer } from 'mobx-react';
import React, { useCallback, useState } from 'react';
import { withErrorBoundary } from '../common/components/ErrorBoundary';
import GroupsListItem from './GroupsListItem';
import withPreventDoubleTap from '../common/components/PreventDoubleTap';
import OffsetList from '../common/components/OffsetList';
import GroupModel from './GroupModel';
import { ScreenHeader, Screen, Button, Row, HairlineRow } from '~/common/ui';
import i18n from '~/common/services/i18n.service';
import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';
import { GroupsEmpty } from '../modules/groups';
import { Recommendation } from '../modules/recommendation';
import Divider from '../common/components/Divider';
import AnimatedHeight from '../common/components/animations/AnimatedHeight';
import { useNavigation } from '@react-navigation/native';
import OnboardingOverlay from '~/components/OnboardingOverlay';

const DebouncedGroupsListItem = withErrorBoundary(
  withPreventDoubleTap(GroupsListItem),
);

const GroupsListScreen = observer(() => {
  const navigation = useNavigation();
  const [isEmpty, setIsEmpty] = useState(true);

  const navigateToDiscovery = () => navigation.navigate('GroupsDiscovery');
  const renderGroup = useCallback(
    (row: { item: GroupModel; index: number }) => (
      <DebouncedGroupsListItem group={row.item} index={row.index} />
    ),
    [],
  );

  return (
    <Screen safe>
      <ScreenHeader title={i18n.t('discovery.groups')} back />
      <OffsetList
        renderItem={renderGroup}
        header={
          !isEmpty ? (
            <>
              <Row left="L" bottom="L">
                <Button
                  right="M"
                  size="medium"
                  type="action"
                  spinner
                  onPress={navigateToDiscovery}>
                  Discover
                </Button>
              </Row>
              <Divider />
              <AnimatedHeight>
                <Recommendation size={1} location="feed" type="group" />
              </AnimatedHeight>
            </>
          ) : undefined
        }
        sticky
        fetchEndpoint={'api/v1/groups/member'}
        endpointData={'groups'}
        onListUpdate={data => {
          if (data.length && isEmpty) {
            setIsEmpty(false);
          }
        }}
        ListEmptyComponent={
          <>
            <HairlineRow />
            <GroupsEmpty />
            <Divider />
            <Recommendation size={5} location="feed" type="group" />
          </>
        }
      />
      <OnboardingOverlay type="groups_memberships" />
    </Screen>
  );
});

export default withErrorBoundaryScreen(GroupsListScreen, 'GroupsListScreen');
