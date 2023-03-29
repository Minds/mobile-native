import { observer } from 'mobx-react';
import React, { useCallback, useState } from 'react';
import { View } from 'react-native';
import TopbarTabbar from '../common/components/topbar-tabbar/TopbarTabbar';
import i18n from '../common/services/i18n.service';
import ThemedStyles from '../styles/ThemedStyles';
import DashboardTab from './tabs/dashboard/DashboardTab';
import TokensTab from './tabs/tokens/TokensTab';
import TrendingTab from './tabs/trending/TrendingTab';
import { ScreenHeader, Screen } from '~/common/ui/screen';

type TAnalyticsTabs =
  | 'earnings'
  | 'engagement'
  | 'traffic'
  | 'trending'
  | 'token';

interface AnalyticsScreenProps {
  navigation: any;
  route: any;
}

const AnalyticsScreen = ({ navigation, route }: AnalyticsScreenProps) => {
  const theme = ThemedStyles.style;
  const [activeTabId, setActiveTabId] = useState<TAnalyticsTabs>('token');
  const _onTabBarChange = useCallback(
    (id: string) => setActiveTabId(id as TAnalyticsTabs),
    [],
  );
  React.useEffect(() => {
    if (route.params?.type) {
      _onTabBarChange(route.params.type as TAnalyticsTabs);
    }
  }, [_onTabBarChange, route]);

  const Earnings = React.useMemo(
    () => (
      <DashboardTab
        key={'earnings'}
        url={'api/v2/analytics/dashboards/earnings'}
        defaultMetric={'earnings_total'}
      />
    ),
    [],
  );

  const Engagement = React.useMemo(
    () => (
      <DashboardTab
        key={'engagement'}
        url={'api/v2/analytics/dashboards/engagement'}
        defaultMetric={'votes_up'}
      />
    ),
    [],
  );

  const Traffic = React.useMemo(
    () => (
      <DashboardTab
        key={'traffic'}
        url={'api/v2/analytics/dashboards/traffic'}
        defaultMetric={'page_views'}
      />
    ),
    [],
  );

  const Trending = React.useMemo(
    () => <TrendingTab navigation={navigation} />,
    [navigation],
  );

  const Token = React.useMemo(() => <TokensTab route={route} />, [route]);

  const screen = React.useCallback(() => {
    switch (activeTabId) {
      case 'earnings':
        return Earnings;
      case 'engagement':
        return Engagement;
      case 'traffic':
        return Traffic;
      case 'trending':
        return Trending;
      case 'token':
        return Token;
      default:
        return <View />;
    }
  }, [Earnings, Engagement, Token, Traffic, Trending, activeTabId]);

  return (
    <Screen safe>
      <ScreenHeader title={i18n.t('analytics.title')} />
      <TopbarTabbar
        current={activeTabId}
        onChange={_onTabBarChange}
        tabs={[
          { id: 'traffic', title: i18n.t('analytics.traffic') },
          { id: 'token', title: i18n.t('analytics.tokens.title') },
          { id: 'engagement', title: i18n.t('analytics.engagement') },
          { id: 'earnings', title: i18n.t('analytics.earnings') },
          { id: 'trending', title: i18n.t('analytics.trending.title') },
        ]}
      />
      <View style={theme.centered}>{screen()}</View>
    </Screen>
  );
};

export default observer(AnalyticsScreen);
