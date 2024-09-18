import { observer } from 'mobx-react';
import moment from 'moment';
import React from 'react';
import { useWindowDimensions, View } from 'react-native';
import CenteredLoading from '~/common/components/CenteredLoading';
import LineChart from '~/common/components/charts/LineChart';
import MText from '~/common/components/MText';
import useApiFetch from '~/common/hooks/useApiFetch';

import sp from '~/services/serviceProvider';
export type ChartTimespanType = '7d' | '30d';

type PropsType = {
  timespan: ChartTimespanType;
};

/**
 * Tokens chart component
 */
const TokensChart = observer(({ timespan }: PropsType) => {
  const theme = sp.styles.style;
  const { width } = useWindowDimensions();
  const i18n = sp.i18n;

  let dataError = false,
    data;

  const store = useApiFetch<any>('api/v2/analytics/dashboards/token', {
    params: {
      metric: 'token_balance',
      timespan,
    },
  });

  if (store.loading) {
    return (
      <View style={{ height: width * 0.6 + 70, width }}>
        <CenteredLoading />
      </View>
    );
  }

  try {
    data = store.result.dashboard.metrics[0].visualisation.segments[0].buckets;
  } catch (err) {
    dataError = true;
  }

  if (store.error || dataError) {
    return (
      <MText
        style={[
          theme.colorSecondaryText,
          theme.textCenter,
          theme.fontL,
          theme.marginVertical4x,
        ]}
        onPress={store.fetch}>
        {i18n.t('error') + '\n'}
        <MText style={theme.colorLink}>{i18n.t('tryAgain')}</MText>
      </MText>
    );
  }

  const chartData = {
    labels: data.map(d => moment(d.date).format('MM/DD')),
    datasets: [
      {
        data: data.map(d => d.value),
      },
    ],
  };

  return <LineChart data={chartData} width={width} />;
});

export default TokensChart;
