import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useDimensions } from '@react-native-community/hooks';
import ThemedStyles from '../../../styles/ThemedStyles';
import useApiFetch from '../../../common/hooks/useApiFetch';
import CenteredLoading from '../../../common/components/CenteredLoading';
import i18n from '../../../common/services/i18n.service';
import { observer } from 'mobx-react';
import moment from 'moment';

export type ChartTimespanType = '7d' | '30d';

type PropsType = {
  timespan: ChartTimespanType;
};

/**
 * Tokens chart component
 */
const TokensChart = observer(({ timespan }: PropsType) => {
  const theme = ThemedStyles.style;
  let dataError = false,
    data;

  const { width } = useDimensions().window;

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

  return (
    <LineChart
      data={chartData}
      width={width} // from react-native
      height={220}
      withOuterLines={false}
      withHorizontalLabels={false}
      withScrollableDot
      transparent
      yAxisLabel=""
      // verticalLabelRotation={-45}
      yAxisSuffix=""
      yAxisInterval={1} // optional, defaults to 1
      chartConfig={{
        decimalPlaces: 2,
        color: () => ThemedStyles.getColor('link'),
        labelColor: () => ThemedStyles.getColor('secondary_text'),
        style: {
          borderRadius: 16,
        },
        strokeWidth: 2,
        propsForLabels: {
          rotation: -45,
        },
        propsForDots: {
          r: '3',
        },
        propsForBackgroundLines: {
          stroke: ThemedStyles.getColor('secondary_text'),
          strokeDasharray: undefined,
          strokeWidth: 0.5,
        },
        scrollableDotFill: ThemedStyles.getColor('primary_text'),
        scrollableDotRadius: 4,
        scrollableInfoViewStyle: {
          justifyContent: 'center',
          alignContent: 'center',
          backgroundColor: ThemedStyles.getColor('tertiary_background'),
          borderRadius: 2,
        },
        scrollableInfoTextStyle: {
          color: ThemedStyles.getColor('primary_text'),
          marginHorizontal: 4,
          flex: 1,
          textAlign: 'center',
        },
        scrollableInfoSize: {
          width: 65,
          height: 30,
        },
        scrollableInfoOffset: 15,
      }}
      style={styles.chart}
    />
  );
});

export default TokensChart;

const styles = StyleSheet.create({
  chart: {
    paddingRight: 20,
    paddingTop: 30,
    paddingBottom: 20,
  },
});
