import { observer, useLocalStore } from 'mobx-react';
import React, { useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import ActivityIndicator from '../../../common/components/ActivityIndicator';
import TopBarButtonTabBar, {
  ButtonTabType,
} from '../../../common/components/topbar-tabbar/TopBarButtonTabBar';
import { useStores } from '../../../common/hooks/use-stores';
import useApiFetch from '../../../common/hooks/useApiFetch';
import i18n from '../../../common/services/i18n.service';
import ThemedStyles from '../../../styles/ThemedStyles';
import { CardType, TokensMetrics } from '../../AnalyticsTypes';
import LiquidityDashboard from './LiquidityDashboard';
import RewardsDashboard from './RewardsDashboard';
import SupplyDashboard from './SupplyDashboard';
import TransactionsDashboard from './TransactionsDashboard';
import capitalize from '../../../common/helpers/capitalize';
import { activityIndicatorStyle, errorStyle } from '../dashboard/DashboardTab';
import MText from '../../../common/components/MText';

export type DashBoardPropsType = {
  metrics: MetricsSubType;
};

type TokensOptions = 'Supply' | 'Transactions' | 'Liquidity' | 'Rewards';

export type MetricsSubType = {
  [K in CardType]: TokensMetrics;
};

const options: Array<ButtonTabType<TokensOptions>> = [
  { id: 'Supply', title: 'Supply' },
  { id: 'Transactions', title: 'Transactions' },
  { id: 'Liquidity', title: 'Liquidity' },
  { id: 'Rewards', title: 'Rewards' },
];

const createStore = () => ({
  option: 'Supply' as TokensOptions,
  setOption(option: TokensOptions) {
    this.option = option;
  },
});

type RowType = {
  [K in TokensOptions]: MetricsSubType;
};

const TokensTab = observer(({ route }: { route: any }) => {
  const theme = ThemedStyles.style;
  const store = useLocalStore(createStore);
  const { wallet } = useStores();

  useEffect(() => {
    wallet.loadPrices();
    if (
      route.params &&
      route.params.subtype &&
      ['supply', 'transactions', 'liquidity', 'rewards'].includes(
        route.params.subtype,
      )
    ) {
      store.setOption(capitalize(route.params.subtype) as TokensOptions);
    }
  }, [route, store, wallet]);

  const { result, error, loading, fetch } = useApiFetch<{
    metrics: Array<TokensMetrics>;
  }>('api/v3/blockchain/metrics');

  if (!result && loading) {
    return <ActivityIndicator style={activityIndicatorStyle} size={'large'} />;
  }

  if (!result) {
    return null;
  }

  const rows = {
    Supply: {},
    Transactions: {},
    Liquidity: {},
    Rewards: {},
  } as RowType;
  let dataError;

  try {
    Object.values(result.metrics).forEach((metric: TokensMetrics) => {
      const [metricKey, metricType] = metric.id.split('\\');
      rows[metricKey][metricType] = metric;
    });
  } catch (e) {
    dataError = e;
  }

  if (error || dataError) {
    return (
      <MText style={errorStyle} onPress={fetch}>
        {i18n.t('error') + '\n'}
        <MText style={theme.colorLink}>{i18n.t('tryAgain')}</MText>
      </MText>
    );
  }

  let body;
  switch (store.option) {
    case 'Supply':
      body = <SupplyDashboard metrics={rows.Supply} />;
      break;
    case 'Transactions':
      body = <TransactionsDashboard metrics={rows.Transactions} />;
      break;
    case 'Liquidity':
      body = <LiquidityDashboard metrics={rows.Liquidity} />;
      break;
    case 'Rewards':
      body = <RewardsDashboard metrics={rows.Rewards} />;
      break;
  }

  return (
    <View style={theme.paddingTop2x}>
      <TopBarButtonTabBar
        tabs={options}
        current={store.option}
        onChange={store.setOption}
      />
      <ScrollView contentContainerStyle={styles.padding}>{body}</ScrollView>
    </View>
  );
});

const styles = ThemedStyles.create({
  padding: {
    paddingBottom: 120,
  },
});

export default TokensTab;
