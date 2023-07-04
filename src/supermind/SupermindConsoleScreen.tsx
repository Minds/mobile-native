import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { observer } from 'mobx-react';
import { AnimatePresence } from 'moti';
import React from 'react';
import OffsetList from '~/common/components/OffsetList';
import TopbarTabbar, {
  TabType,
} from '~/common/components/topbar-tabbar/TopbarTabbar';
import i18n from '~/common/services/i18n.service';
import { IconButton, Screen, ScreenHeader } from '~/common/ui';
import { IS_IOS } from '~/config/Config';
import ThemedStyles from '~/styles/ThemedStyles';
import {
  SupermindOnboardingOverlay,
  useSupermindOnboarding,
} from '../compose/SupermindOnboarding';
import { MoreStackParamList } from '../navigation/NavigationTypes';
import SeeLatestButton from '../newsfeed/SeeLatestButton';
import StripeConnectButton from '../wallet/v2/stripe-connect/StripeConnectButton';
import SupermindConsoleFeedFilter, {
  SupermindFilterType,
} from './SupermindConsoleFeedFilter';
import SupermindRequest from './SupermindRequest';
import SupermindRequestModel from './SupermindRequestModel';
import {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import Animated from 'react-native-reanimated';
import {
  ScrollContext,
  ScrollDirection,
} from '~/common/contexts/scroll.context';

type TabModeType = 'inbound' | 'outbound';
type SupermindConsoleScreenRouteProp = RouteProp<
  MoreStackParamList,
  'SupermindConsole'
>;
type SupermindConsoleScreenNavigationProp = StackNavigationProp<
  MoreStackParamList,
  'SupermindConsole'
>;

const MIN_SCROLL_THRESHOLD = 5;
const filterValues: Record<SupermindFilterType, string> = {
  all: '',
  pending: '1',
  accepted: '2',
  revoked: '3',
  declined: '4',
  failed: '6',
  paymentFailed: '5',
  expired: '7',
};

interface SupermindConsoleScreenProps {
  navigation: SupermindConsoleScreenNavigationProp;
  route: SupermindConsoleScreenRouteProp;
}

function SupermindConsoleScreen({
  navigation,
  route,
}: SupermindConsoleScreenProps) {
  const theme = ThemedStyles.style;
  const [mode, setMode] = React.useState<TabModeType>(
    route.params?.tab ?? 'inbound',
  );
  const [filter, setFilter] = React.useState<SupermindFilterType>(
    route.params?.tab === 'outbound' ? 'all' : 'pending',
  );
  const listRef = React.useRef<any>(null);
  const [onboarding, dismissOnboarding] = useSupermindOnboarding('producer');
  const scrollDirection = useSharedValue(0);
  const scrollY = useSharedValue(0);

  const scrollToTopAndRefresh = () => {
    listRef.current?.scrollToOffset({ offset: 0 });
    return listRef.current?.refreshList();
  };

  const handleModeChange = (selectedMode: TabModeType) => {
    setMode(selectedMode);
    if (selectedMode === 'inbound') {
      setFilter('pending');
    } else {
      setFilter('all');
    }
  };

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      if (
        Math.abs(event.contentOffset.y - scrollY.value) > MIN_SCROLL_THRESHOLD
      ) {
        scrollDirection.value =
          event.contentOffset.y > scrollY.value
            ? ScrollDirection.down
            : ScrollDirection.up;
      }
      scrollY.value = event.contentOffset.y;
    },
  });

  const filterParam = filterValues[filter]
    ? `?status=${filterValues[filter]}`
    : '';

  const tabs: Array<TabType<TabModeType>> = React.useMemo(
    () => [
      {
        id: 'inbound',
        title: i18n.t('inbound'),
      },
      {
        id: 'outbound',
        title: i18n.t('outbound'),
      },
    ],
    [],
  );

  return (
    <Screen safe>
      <ScreenHeader
        title="Supermind"
        onTitlePress={() => listRef.current?.scrollToOffset({ offset: 0 })}
        extra={
          !onboarding && (
            <IconButton
              name="settings"
              // @ts-ignore
              onPress={() => navigation.navigate('SupermindSettingsScreen')}
            />
          )
        }
        back
        shadow
      />
      <OffsetList
        ref={listRef}
        ListComponent={Animated.FlatList}
        header={
          <>
            <TopbarTabbar
              titleStyle={theme.fontXL}
              tabs={tabs}
              onChange={handleModeChange}
              current={mode}
              tabStyle={theme.paddingVertical}
              right={
                <SupermindConsoleFeedFilter
                  value={filter}
                  onFilterChange={setFilter}
                  containerStyles={styles.filterContainer}
                />
              }
            />
            <StripeConnectButton background="secondary" top="M" bottom="L" />
          </>
        }
        contentContainerStyle={ThemedStyles.style.paddingTop2x}
        map={mapRequests}
        fetchEndpoint={
          mode === 'inbound'
            ? `api/v3/supermind/inbox${filterParam}`
            : `api/v3/supermind/outbox${filterParam}`
        }
        offsetPagination
        renderItem={
          mode === 'inbound' ? renderSupermindInbound : renderSupermindOutbound
        }
        endpointData=""
        onScroll={scrollHandler}
      />

      <ScrollContext.Provider
        value={{
          scrollDirection,
          translationY: { value: -60 },
          headerHeight: 0,
          scrollY,
        }}>
        <SeeLatestButton
          countEndpoint={`api/v3/supermind/${
            mode === 'inbound' ? 'inbox' : 'outbox'
          }/count${filterParam}`}
          onPress={scrollToTopAndRefresh}
        />
      </ScrollContext.Provider>

      <AnimatePresence>
        {onboarding && (
          <SupermindOnboardingOverlay
            type="producer"
            onDismiss={dismissOnboarding}
            style={styles.onboardingOverlay}
          />
        )}
      </AnimatePresence>
    </Screen>
  );
}

export default observer(SupermindConsoleScreen);

const renderSupermindInbound = row => <SupermindRequest request={row.item} />;
const renderSupermindOutbound = row => (
  <SupermindRequest request={row.item} outbound />
);
const mapRequests = items => SupermindRequestModel.createMany(items);

const styles = ThemedStyles.create({
  onboardingOverlay: {
    marginTop: IS_IOS ? 125 : 70,
  },
  filterContainer: ['paddingTop2x', 'paddingRight4x'],
});
