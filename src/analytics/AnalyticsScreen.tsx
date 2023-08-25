import { observer } from 'mobx-react';
import React, { useState } from 'react';
import { View } from 'react-native';
import TopbarTabbar from '../common/components/topbar-tabbar/TopbarTabbar';
import i18n from '../common/services/i18n.service';
import ThemedStyles from '../styles/ThemedStyles';
import DashboardTab from './tabs/dashboard/DashboardTab';
import TrendingTab from './tabs/trending/TrendingTab';
import { ScreenHeader, Screen } from '~/common/ui/screen';
import OnboardingOverlay from '~/components/OnboardingOverlay';

const AnalyticsScreen = observer(({ route }: { route: any }) => {
  const theme = ThemedStyles.style;
  const [activeTabId, setActiveTabId] = useState(defaultTab);
  React.useEffect(() => {
    setActiveTabId(route.params?.type ?? defaultTab);
  }, [route]);

  return (
    <Screen safe>
      <ScreenHeader back title={i18n.t('analytics.title')} />
      <TopbarTabbar
        current={activeTabId}
        onChange={setActiveTabId}
        tabs={Object.entries(tabs).map<any>(([id, { title }]) => ({
          id,
          title,
          key: id,
        }))}
      />
      <View style={theme.centered}>{tabs[activeTabId]?.screen}</View>
      <OnboardingOverlay type="analytics" />
    </Screen>
  );
});

const tabs = {
  traffic: {
    title: i18n.t('analytics.traffic'),
    screen: (
      <DashboardTab
        key={'traffic'}
        url={'api/v2/analytics/dashboards/traffic'}
        defaultMetric={'page_views'}
      />
    ),
  },
  // token: {
  //   title: i18n.t('analytics.tokens.title'),
  //   screen: <TokensTab key={'token'} />,
  // },
  engagement: {
    title: i18n.t('analytics.engagement'),
    screen: (
      <DashboardTab
        key={'engagement'}
        url={'api/v2/analytics/dashboards/engagement'}
        defaultMetric={'votes_up'}
      />
    ),
  },
  earnings: {
    title: i18n.t('analytics.earnings'),
    screen: (
      <DashboardTab
        key={'earnings'}
        url={'api/v2/analytics/dashboards/earnings'}
        defaultMetric={'earnings_total'}
      />
    ),
  },
  trending: {
    title: i18n.t('analytics.trending.title'),
    screen: <TrendingTab key={'trending'} />,
  },
} as const;

type Tab = keyof typeof tabs;
const defaultTab: Tab = 'traffic';

export default AnalyticsScreen;
