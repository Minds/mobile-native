import { useDimensions } from '@react-native-community/hooks';
import { observer } from 'mobx-react';
import moment from 'moment';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import LineChart from '../../../common/components/charts/LineChart';
import Select from '../../../common/components/controls/Select';
import Selector from '../../../common/components/Selector';
import useApiFetch from '../../../common/hooks/useApiFetch';
import i18n from '../../../common/services/i18n.service';
import ThemedStyles from '../../../styles/ThemedStyles';
import {
  Dashboard,
  FiltersEntity,
  MetricsEntity,
  SegmentBucketsEntity,
  TimespansEntity,
} from '../../AnalyticsTypes';

interface DashboardTabProps {
  url: string;
  defaultMetric: string;
}

const valueExtractor = (item) => item.label;
const keyExtractor = (item) => item.id;

const DashboardTab = observer(({ url, defaultMetric }: DashboardTabProps) => {
  const { width } = useDimensions().window;
  const theme = ThemedStyles.style;

  const [filters, setFilters] = useState<{ [k: string]: FiltersEntity }>({});
  const [timespan, setTimespan] = useState<TimespansEntity | undefined>();
  const [metric, setMetric] = useState<MetricsEntity | undefined>();
  const _onFilterChange = useCallback(
    (id: string) => (value: any) => {
      setFilters({
        ...filters,
        [id]: value,
      });
    },
    [filters],
  );
  const _onTimespanChange = useCallback(
    (ts: TimespansEntity) => setTimespan(ts),
    [],
  );
  const _onMetricsChange = useCallback(
    (ts: MetricsEntity) => setMetric(ts),
    [],
  );
  const { result, loading, error, fetch } = useApiFetch<{
    dashboard: Dashboard;
  }>(
    url,
    {
      timespan: timespan ? timespan.id : '30d',
      metric: metric ? metric.id : defaultMetric,
      filter: Object.keys(filters)
        .map((key) => `${key}::${filters[key]}`)
        .join(','),
    },
    true,
  );

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

  let data: SegmentBucketsEntity[] = [];
  let dataError;

  try {
    const visualisation = result.dashboard.metrics!.find(
      (p) => p.id === (metric ? metric.id : result.dashboard.metric),
    )!.visualisation;

    if (visualisation) {
      data = visualisation.segments![0].buckets!;
    }
  } catch (e) {
    dataError = e;
  }

  const chartData = {
    labels: data.map((d) => moment(d.date).format('MM/DD')),
    datasets: [
      {
        data: data.map((d) => d.value),
      },
    ],
  };

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

  return (
    <View
      style={[
        { minWidth: width - theme.padding3x.padding * 2 },
        theme.justifyCenter,
        theme.paddingTop3x,
      ]}>
      <Selector
        onItemSelect={_onMetricsChange}
        data={result.dashboard.metrics!}
        valueExtractor={valueExtractor}
        keyExtractor={keyExtractor}>
        {(show) => (
          <Select
            onPress={() => show(metric ? metric.id : result.dashboard.metric)}
            label={
              metric
                ? metric.label
                : result.dashboard.metrics!.find(
                    (p) => p.id === result.dashboard.metric,
                  )!.label
            }
          />
        )}
      </Selector>

      <View
        style={[
          theme.rowJustifySpaceBetween,
          theme.alignCenter,
          theme.marginTop,
          theme.padding,
        ]}>
        <Selector
          onItemSelect={_onTimespanChange}
          data={result.dashboard.timespans!}
          valueExtractor={valueExtractor}
          keyExtractor={keyExtractor}>
          {(show) => (
            <View style={theme.alignedCenterRow}>
              <TouchableOpacity
                style={[theme.rowJustifyCenter, theme.alignCenter]}
                onPress={() =>
                  show(timespan ? timespan.id : result.dashboard.timespan)
                }>
                <MIcon
                  name={'date-range'}
                  color={ThemedStyles.getColor('icon')}
                  size={18}
                />
                <Text style={[theme.colorSecondaryText, theme.marginLeft]}>
                  {timespan
                    ? timespan.label
                    : result.dashboard.timespans!.find(
                        (p) => p.id === result.dashboard.timespan,
                      )!.label}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </Selector>

        {result.dashboard.filters &&
          result.dashboard.filters.map((filter) => (
            <Selector
              key={filter.id}
              data={filter.options!}
              valueExtractor={valueExtractor}
              keyExtractor={keyExtractor}
              onItemSelect={_onFilterChange(filter.id)}>
              {(show) => (
                <View style={theme.alignedCenterRow}>
                  <TouchableOpacity
                    style={[theme.rowJustifyCenter, theme.alignCenter]}
                    onPress={() =>
                      show(
                        filters[filter.id]
                          ? filters[filter.id].id
                          : filter.options![0].id,
                      )
                    }>
                    <Text style={[theme.colorSecondaryText, theme.marginRight]}>
                      {filters[filter.id]
                        ? filters[filter.id].label
                        : filter.options![0].label}
                    </Text>
                    <MIcon
                      name={'filter-alt'}
                      color={ThemedStyles.getColor('icon')}
                      size={18}
                    />
                  </TouchableOpacity>
                </View>
              )}
            </Selector>
          ))}
      </View>

      {data.length > 1 && (
        <LineChart
          data={chartData}
          width={width - theme.padding5x.padding * 2}
        />
      )}

      {loading && (
        <ActivityIndicator
          style={[theme.positionAbsolute, { top: 200 }]}
          size={'large'}
        />
      )}
    </View>
  );
});

export default DashboardTab;
