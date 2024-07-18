import { observer } from 'mobx-react';
import React, { useCallback, useState } from 'react';
import { withErrorBoundary } from '~/common/components/ErrorBoundary';
import GroupsListItem from '~/groups/GroupsListItem';
import withPreventDoubleTap from '~/common/components/PreventDoubleTap';
import OffsetList from '~/common/components/OffsetList';
import GroupModel from '~/groups/GroupModel';
import {
  ScreenHeader,
  Screen,
  Button,
  Row,
  HairlineRow,
  H4,
} from '~/common/ui';
import i18n from '~/common/services/i18n.service';
import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';
import { IS_IPAD } from '~/config/Config';
import { GroupsEmpty } from '..';
import { Recommendation } from '../../recommendation';
import Divider from '~/common/components/Divider';
import AnimatedHeight from '~/common/components/animations/AnimatedHeight';
import { useNavigation } from '@react-navigation/native';
import OnboardingOverlay from '~/components/OnboardingOverlay';
import GroupMemberships from '~/groups/components/GroupMemberships';
import Topbar from '~/topbar/Topbar';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '~/navigation/NavigationTypes';

const DebouncedGroupsListItem = withErrorBoundary(
  withPreventDoubleTap(GroupsListItem),
);

type Props = StackScreenProps<RootStackParamList, 'GroupsList'>;

const GroupsListScreen = observer(({ route }: Props) => {
  const { showTopBar } = route.params;
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
      {showTopBar ? (
        <Topbar
          title={i18n.t('discovery.filters.groups')}
          navigation={navigation}
          noInsets
        />
      ) : (
        <ScreenHeader
          title={i18n.t('discovery.filters.groups')}
          back={!IS_IPAD}
        />
      )}
      <OffsetList
        renderItem={renderGroup}
        header={
          <>
            {!isEmpty ? (
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
            ) : undefined}

            <GroupMemberships />

            <H4 horizontal="L" vertical="L">
              {i18n.t('groups.joined')}
            </H4>
          </>
        }
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
