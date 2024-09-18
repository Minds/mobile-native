import React from 'react';
import { StyleSheet } from 'react-native';
import { ChartData, LineChart as RNLineChart } from 'react-native-chart-kit';
import sp from '~/services/serviceProvider';

interface LineChartProps {
  data: ChartData;
  width: number;
  style?: object;
}

const LineChart = ({ data, width, style }: LineChartProps) => {
  return (
    <RNLineChart
      data={data}
      width={width}
      height={width * 0.6}
      withOuterLines={false}
      withHorizontalLabels={false}
      withScrollableDot
      transparent
      yAxisLabel=""
      yAxisSuffix=""
      yAxisInterval={data.labels.length % 20 ? 5 : 1}
      chartConfig={{
        decimalPlaces: 2,
        color: () => sp.styles.getColor('Link'),
        labelColor: () => sp.styles.getColor('SecondaryText'),
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
          stroke: sp.styles.getColor('SecondaryText'),
          strokeDasharray: undefined,
          strokeWidth: StyleSheet.hairlineWidth,
        },
        scrollableDotFill: sp.styles.getColor('PrimaryText'),
        scrollableDotRadius: 4,
        scrollableInfoViewStyle: {
          justifyContent: 'center',
          height: 80,
          padding: 0,
          backgroundColor: sp.styles.getColor('TertiaryBackground'),
          borderRadius: 2,
        },
        scrollableInfoTextStyle: {
          color: sp.styles.getColor('PrimaryText'),
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
      style={{
        ...styles.chart,
        ...style,
      }}
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
