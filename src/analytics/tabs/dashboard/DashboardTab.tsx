import { useDimensions } from '@react-native-community/hooks';
import { observer } from 'mobx-react';
import moment from 'moment';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
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
  const _getFilterKey = useCallback(
    (filter: FiltersEntity) =>
      filters[filter.id] ? filters[filter.id].id : filter.options![0].id,
    [filters],
  );
  const _getFilterLabel = useCallback(
    (filter: FiltersEntity) =>
      filters[filter.id] ? filters[filter.id].label : filter.options![0].label,
    [filters],
  );

  /**
   * Events
   * */
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

  /**
   * API Call
   * */
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

  const chartData = {
    labels:
      // If the data were large, show only the even indexes
      data.length > 15
        ? data.map((d, index) =>
            index % 2 ? moment(d.date).format('MM/DD') : '',
          )
        : data.map((d) => moment(d.date).format('MM/DD')),
    datasets: [
      {
        data: data.map((d) => d.value),
      },
    ],
  };

  const metricsKey = metric ? metric.id : result.dashboard.metric;
  const metricsLabel = metric
    ? metric.label
    : result.dashboard.metrics!.find((p) => p.id === result.dashboard.metric)!
        .label;

  const timeSpanKey = timespan ? timespan.id : result.dashboard.timespan;
  const timeSpanLabel = timespan
    ? timespan.label
    : result.dashboard.timespans!.find(
        (p) => p.id === result.dashboard.timespan,
      )!.label;

  return (
    <View
      style={[
        { width: width - theme.padding3x.padding * 2 },
        theme.justifyCenter,
        theme.paddingTop3x,
      ]}>
      <Selector
        onItemSelect={_onMetricsChange}
        data={result.dashboard.metrics!}
        valueExtractor={valueExtractor}
        keyExtractor={keyExtractor}>
        {(show) => (
          <Select onPress={() => show(metricsKey)} label={metricsLabel} />
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
                onPress={() => show(timeSpanKey)}>
                <MIcon
                  name={'date-range'}
                  color={ThemedStyles.getColor('icon')}
                  size={18}
                />
                <Text style={[theme.colorSecondaryText, theme.marginLeft]}>
                  {timeSpanLabel}
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
                    onPress={() => show(_getFilterKey(filter))}>
                    <Text style={[theme.colorSecondaryText, theme.marginRight]}>
                      {_getFilterLabel(filter)}
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
          width={width - theme.padding3x.padding * 2}
          style={theme.alignCenter}
        />
      )}

      {loading && (
        <ActivityIndicator
          style={[theme.positionAbsolute, styles.activityIndicator]}
          size={'large'}
        />
      )}
    </View>
  );
});

export default DashboardTab;

const styles = StyleSheet.create({
  activityIndicator: { top: 200 },
});
