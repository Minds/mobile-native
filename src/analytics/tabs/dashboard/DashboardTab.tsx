import { useDimensions } from '@react-native-community/hooks';
import { observer } from 'mobx-react';
import moment from 'moment';
import React, { useCallback, useState } from 'react';
import { Dimensions, TouchableOpacity, View } from 'react-native';
import MIcon from '@expo/vector-icons/MaterialIcons';
import ActivityIndicator from '../../../common/components/ActivityIndicator';
import LineChart from '../../../common/components/charts/LineChart';
import Select from '../../../common/components/controls/Select';
import MText from '../../../common/components/MText';
import Selector from '../../../common/components/SelectorV2';
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

const valueExtractor = item => item.label;
const keyExtractor = item => item.id;

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
  const { result, loading, error, refresh } = useApiFetch<{
    dashboard: Dashboard;
  }>(url, {
    params: {
      timespan: timespan ? timespan.id : '30d',
      metric: metric ? metric.id : defaultMetric,
      filter: Object.keys(filters)
        .map(key => `${key}::${filters[key]}`)
        .join(','),
    },
  });
  const onTryAgain = useCallback(() => refresh(), [refresh]);

  if (!result && loading) {
    return <ActivityIndicator style={activityIndicatorStyle} size={'large'} />;
  }

  if (!result) {
    return null;
  }

  let data: SegmentBucketsEntity[] = [];
  let dataError;

  try {
    const visualisation = result.dashboard.metrics!.find(
      p => p.id === (metric ? metric.id : result.dashboard.metric),
    )!.visualisation;

    if (visualisation) {
      data = visualisation.segments![0].buckets!;
    }
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

  const chartData = {
    labels:
      // If the data were large, show only the even indexes
      data.length > 15
        ? data.map((d, index) =>
            index % 2 ? moment(d.date).format('MM/DD') : '',
          )
        : data.map(d => moment(d.date).format('MM/DD')),
    datasets: [
      {
        data: data.map(d => d.value),
      },
    ],
  };

  const metricsKey = metric ? metric.id : result.dashboard.metric;
  const metricsLabel = metric
    ? metric.label
    : result.dashboard.metrics!.find(p => p.id === result.dashboard.metric)!
        .label;

  const timeSpanKey = timespan ? timespan.id : result.dashboard.timespan;
  const timeSpanLabel = timespan
    ? timespan.label
    : result.dashboard.timespans!.find(p => p.id === result.dashboard.timespan)!
        .label;

  return (
    <View style={styles.mainContainer}>
      <Selector
        onItemSelect={_onMetricsChange}
        data={result.dashboard.metrics!}
        valueExtractor={valueExtractor}
        keyExtractor={keyExtractor}>
        {show => (
          <Select onPress={() => show(metricsKey)} label={metricsLabel} />
        )}
      </Selector>

      <View style={styles.secondaryContainer}>
        <Selector
          onItemSelect={_onTimespanChange}
          data={result.dashboard.timespans!}
          valueExtractor={valueExtractor}
          keyExtractor={keyExtractor}>
          {show => (
            <View>
              <TouchableOpacity
                style={styles.dateTouch}
                onPress={() => show(timeSpanKey)}>
                <MIcon
                  name={'date-range'}
                  color={ThemedStyles.getColor('Icon')}
                  size={18}
                />
                <MText style={styles.timeSpanLabel}>{timeSpanLabel}</MText>
              </TouchableOpacity>
            </View>
          )}
        </Selector>

        {result.dashboard.filters &&
          result.dashboard.filters.map(filter => (
            <Selector
              key={filter.id}
              data={filter.options!}
              valueExtractor={valueExtractor}
              keyExtractor={keyExtractor}
              onItemSelect={_onFilterChange(filter.id)}>
              {show => (
                <View>
                  <TouchableOpacity
                    style={styles.filterTouch}
                    onPress={() => show(_getFilterKey(filter))}>
                    <MText style={styles.filterText}>
                      {_getFilterLabel(filter)}
                    </MText>
                    <MIcon
                      name={'filter-alt'}
                      color={ThemedStyles.getColor('Icon')}
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
        <ActivityIndicator style={activityIndicatorStyle} size={'large'} />
      )}
    </View>
  );
});
const width = Dimensions.get('window').width;
export const activityIndicatorStyle = ThemedStyles.combine('positionAbsolute', {
  top: 200,
});
export const errorStyle = ThemedStyles.combine(
  'colorSecondaryText',
  'textCenter',
  'fontL',
  'marginVertical4x',
);
const styles = ThemedStyles.create({
  mainContainer: [
    { width: width - ThemedStyles.style.padding3x.padding * 2 },
    'justifyCenter',
    'paddingTop3x',
  ],
  secondaryContainer: [
    'rowJustifySpaceBetween',
    'alignCenter',
    'marginTop',
    'padding',
  ],
  dateTouch: ['rowJustifyCenter', 'alignCenter'],
  timeSpanLabel: ['colorSecondaryText', 'marginLeft'],
  filterTouch: ['rowJustifyCenter', 'alignCenter'],
  filterText: ['colorSecondaryText', 'marginRight'],
});

export default DashboardTab;
