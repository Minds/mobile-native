import { observer, useLocalStore } from 'mobx-react';
import React, { useCallback, useEffect } from 'react';
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
import capitalize from '../../../common/helpers/capitalize';
import { activityIndicatorStyle, errorStyle } from '../dashboard/DashboardTab';
import MText from '../../../common/components/MText';
import { useRoute } from '@react-navigation/native';
import lowerCase from 'lodash/lowerCase';
import Card from './Card';

export type DashBoardPropsType = {
  metrics: MetricsSubType;
};

export type MetricsSubType = {
  [K in CardType]: TokensMetrics;
};

const tabs = ['Supply', 'Transactions', 'Liquidity', 'Rewards'] as const;
type TokensOptions = typeof tabs[number];

type RowType = Record<TokensOptions, MetricsSubType | {}>;

const rows: RowType = {
  Supply: {},
  Transactions: {},
  Liquidity: {},
  Rewards: {},
};

const tabLabels = tabs.map<ButtonTabType<TokensOptions>>(id => ({
  id,
  title: id,
}));

const createStore = () => ({
  option: tabs[0] as TokensOptions,
  setOption(option: TokensOptions) {
    this.option = option;
  },
});

const TokensTab = observer(() => {
  const route = useRoute<any>();
  const theme = ThemedStyles.style;
  const store = useLocalStore(createStore);
  const { wallet } = useStores();

  useEffect(() => {
    wallet.loadPrices();
    if (tabs.map(lowerCase).includes(route.params?.subtype)) {
      store.setOption(capitalize(route.params.subtype) as TokensOptions);
    }
  }, [route, store, wallet]);

  const { result, error, loading, refresh } = useApiFetch<{
    metrics: Array<TokensMetrics>;
  }>('api/v3/blockchain/metrics');
  const onTryAgain = useCallback(() => refresh(), [refresh]);

  if (!result && loading) {
    return <ActivityIndicator style={activityIndicatorStyle} size={'large'} />;
  }

  if (!result) {
    return null;
  }

  let dataError;

  try {
    Object.values(result.metrics).forEach((metric: TokensMetrics) => {
      const [metricKey, metricType] = metric.id.split('\\');
      rows[metricKey][metricType] = metric;
    });
    rows.Rewards = {
      ...rows.Rewards,
      EmissionBreakDown,
    };
  } catch (e) {
    dataError = e;
  }

  if (error || dataError) {
    return (
      <MText style={errorStyle} onPress={onTryAgain}>
        {i18n.t('error') + '\n'}
        <MText style={theme.colorLink}>{i18n.t('tryAgain')}</MText>
      </MText>
    );
  }

  return (
    <View style={theme.paddingTop2x}>
      <TopBarButtonTabBar
        tabs={tabLabels}
        current={store.option}
        onChange={store.setOption}
      />
      <ScrollView contentContainerStyle={styles.padding}>
        {Object.entries(rows[store.option]).map(([key, metrics]) => (
          <Card key={key} metrics={metrics} type={key as CardType} />
        ))}
      </ScrollView>
    </View>
  );
});

const styles = ThemedStyles.create({
  padding: {
    paddingBottom: 120,
  },
});

const EmissionBreakDown = {
  content: [
    {
      title: i18n.t('EmissionBreakDown.Total'),
      value: '10,000 tokens/day',
    },
    {
      title: i18n.t('EmissionBreakDown.Engagement'),
      value: '4,000 tokens',
    },
    {
      title: i18n.t('EmissionBreakDown.Holding'),
      value: '1,000 tokens',
    },
    {
      title: i18n.t('EmissionBreakDown.Liquidity'),
      value: '5,000 tokens',
    },
  ],
} as TokensMetrics;

export default TokensTab;
