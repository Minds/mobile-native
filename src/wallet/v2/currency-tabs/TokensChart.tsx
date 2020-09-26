import { useDimensions } from '@react-native-community/hooks';
import { observer } from 'mobx-react';
import moment from 'moment';
import React from 'react';
import { Text } from 'react-native';
import CenteredLoading from '../../../common/components/CenteredLoading';
import LineChart from '../../../common/components/charts/LineChart';
import useApiFetch from '../../../common/hooks/useApiFetch';
import i18n from '../../../common/services/i18n.service';
import ThemedStyles from '../../../styles/ThemedStyles';

export type ChartTimespanType = '7d' | '30d';

type PropsType = {
  timespan: ChartTimespanType;
};

/**
 * Tokens chart component
 */
const TokensChart = observer(({ timespan }: PropsType) => {
  const theme = ThemedStyles.style;
  const { width } = useDimensions().window;

  let dataError = false,
    data;

  const store = useApiFetch<any>('api/v2/analytics/dashboards/token', {
    metric: 'token_balance',
    timespan,
  });

  if (store.loading) {
    return <CenteredLoading />;
  }

  try {
    data = store.result.dashboard.metrics[0].visualisation.segments[0].buckets;
  } catch (err) {
    dataError = true;
  }

  if (store.error || dataError) {
    return (
      <Text
        style={[
          theme.colorSecondaryText,
          theme.textCenter,
          theme.fontL,
          theme.marginVertical4x,
        ]}
        onPress={store.fetch}>
        {i18n.t('error') + '\n'}
        <Text style={theme.colorLink}>{i18n.t('tryAgain')}</Text>
      </Text>
    );
  }

  const chartData = {
    labels: data.map((d) => moment(d.date).format('MM/DD')),
    datasets: [
      {
        data: data.map((d) => d.value),
      },
    ],
  };

  return <LineChart data={chartData} width={width} />;
});

export default TokensChart;
