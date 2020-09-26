import React from 'react';
import { StyleSheet } from 'react-native';
import { ChartData, LineChart as RNLineChart } from 'react-native-chart-kit';
import ThemedStyles from '../../../styles/ThemedStyles';

interface LineChartProps {
  data: ChartData;
  width: number;
}

const LineChart = ({ data, width }: LineChartProps) => {
  return (
    <RNLineChart
      data={data}
      width={width}
      height={width * 0.8}
      withOuterLines={false}
      withHorizontalLabels={false}
      withScrollableDot
      transparent
      yAxisLabel=""
      yAxisSuffix=""
      yAxisInterval={data.labels.length % 20 ? 5 : 1}
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
          strokeWidth: StyleSheet.hairlineWidth,
        },
        scrollableDotFill: ThemedStyles.getColor('primary_text'),
        scrollableDotRadius: 4,
        scrollableInfoViewStyle: {
          justifyContent: 'center',
          height: 80,
          padding: 0,
          backgroundColor: ThemedStyles.getColor('tertiary_background'),
          borderRadius: 2,
        },
        scrollableInfoTextStyle: {
          color: ThemedStyles.getColor('primary_text'),
          padding: 0,
          fontSize: 14,
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
};

export default LineChart;

const styles = StyleSheet.create({
  chart: {
    paddingRight: 20,
    paddingTop: 30,
    paddingBottom: 20,
  },
});
