import { observer, useLocalStore } from 'mobx-react';
import React, { useEffect } from 'react';
import { ScrollView, Text, View } from 'react-native';
import ActivityIndicator from '../../../common/components/ActivityIndicator';
import TopBarButtonTabBar, {
  ButtonTabType,
} from '../../../common/components/topbar-tabbar/TopBarButtonTabBar';
import { useStores } from '../../../common/hooks/use-stores';
import useApiFetch from '../../../common/hooks/useApiFetch';
import i18n from '../../../common/services/i18n.service';
import ThemedStyles from '../../../styles/ThemedStyles';
import { TokensMetrics } from '../../AnalyticsTypes';
import LiquidityDashboard from './LiquidityDashboard';
import RewardsDashboard from './RewardsDashboard';
import SupplyDashboard from './SupplyDashboard';
import TransactionsDashboard from './TransactionsDashboard';

export type DashBoardPropsType = {
  metrics: MetricsSubType;
};

type TokensOptions = 'Supply' | 'Transactions' | 'Liquidity' | 'Rewards';

export type MetricsSubType = {
  [key: string]: TokensMetrics;
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

const TokensTab = observer(() => {
  const theme = ThemedStyles.style;
  const store = useLocalStore(createStore);
  const { wallet } = useStores();

  useEffect(() => {
    wallet.loadPrices();
  });

  const { result, error, loading, fetch } = useApiFetch<{
    metrics: Array<TokensMetrics>;
  }>('api/v3/blockchain/metrics');

  if (!result && loading) {
    return (
      <ActivityIndicator
        style={[theme.positionAbsolute, { top: 200 }]}
        size={'large'}
      />
    );
  }

  if (!result) {
    return null;
  }

  const rows: {
    [K in TokensOptions]: MetricsSubType;
  } = {
    Supply: {},
    Transactions: {},
    Liquidity: {},
    Rewards: {},
  };
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
      <Text
        style={[
          theme.colorSecondaryText,
          theme.textCenter,
          theme.fontL,
          theme.marginVertical4x,
        ]}
        onPress={fetch}>
        {i18n.t('error') + '\n'}
        <Text style={theme.colorLink}>{i18n.t('tryAgain')}</Text>
      </Text>
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
    <View style={[theme.paddingTop2x]}>
      <TopBarButtonTabBar
        tabs={options}
        current={store.option}
        onChange={store.setOption}
      />
      <ScrollView
        contentContainerStyle={[
          {
            paddingBottom: 120,
          },
        ]}>
        {body}
      </ScrollView>
    </View>
  );
});

export default TokensTab;
