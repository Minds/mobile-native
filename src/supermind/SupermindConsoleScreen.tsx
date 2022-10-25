import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { observer } from 'mobx-react';
import { AnimatePresence } from 'moti';
import React, { useCallback } from 'react';
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
import AddBankInformation from './AddBankInformation';
import SupermindRequest from './SupermindRequest';
import SupermindRequestModel from './SupermindRequestModel';

type TabModeType = 'inbound' | 'outbound';
type SupermindConsoleScreenRouteProp = RouteProp<
  MoreStackParamList,
  'SupermindConsole'
>;
type SupermindConsoleScreenNavigationProp = StackNavigationProp<
  MoreStackParamList,
  'SupermindConsole'
>;

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
    route.params?.tab || 'inbound',
  );
  const listRef = React.useRef<any>(null);
  const [onboarding, dismissOnboarding] = useSupermindOnboarding('producer');
  const scrollToTopAndRefresh = useCallback(() => {
    listRef.current?.scrollToTop();
    return listRef.current?.refreshList();
  }, [listRef]);

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
        onTitlePress={() => listRef.current?.scrollToTop()}
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
        header={
          <>
            <TopbarTabbar
              titleStyle={theme.fontXL}
              tabs={tabs}
              onChange={mode => setMode(mode)}
              current={mode}
              tabStyle={theme.paddingVertical}
            />
            <AddBankInformation />
          </>
        }
        contentContainerStyle={ThemedStyles.style.paddingTop2x}
        map={mapRequests}
        fetchEndpoint={
          mode === 'inbound'
            ? 'api/v3/supermind/inbox'
            : 'api/v3/supermind/outbox'
        }
        offsetPagination
        renderItem={
          mode === 'inbound' ? renderSupermindInbound : renderSupermindOutbound
        }
        endpointData=""
      />

      <SeeLatestButton
        countEndpoint={`api/v3/supermind/${
          mode === 'inbound' ? 'inbox' : 'outbox'
        }/count`}
        onPress={scrollToTopAndRefresh}
      />

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
});
