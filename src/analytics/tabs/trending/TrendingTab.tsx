import { useDimensions } from '@react-native-community/hooks';
import { observer } from 'mobx-react';
import React, { useCallback, useMemo } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ActivityIndicator from '../../../common/components/ActivityIndicator';
import useApiFetch from '../../../common/hooks/useApiFetch';
import i18n from '../../../common/services/i18n.service';
import ThemedStyles from '../../../styles/ThemedStyles';
import { Dashboard, Entity } from '../../AnalyticsTypes';
import { activityIndicatorStyle, errorStyle } from '../dashboard/DashboardTab';

interface TrendingTabProps {
  navigation: any;
}

const TrendingTab = observer(({ navigation }: TrendingTabProps) => {
  const theme = ThemedStyles.style;

  const getEntityRoute = useCallback(
    (type, entity) => {
      switch (type) {
        case 'activity':
          return () =>
            navigation.push('Activity', {
              entity,
            });
        case 'channel':
        case 'blog':
        case 'remind':
        case 'image':
        case 'video':
        default:
          return () => null;
      }
    },
    [navigation],
  );

  const reformatEntity = useCallback(
    (entity: Entity) => {
      let type, username, name, titleType;
      type = entity.type;

      if (type === 'user') {
        type = 'channel';
        username = entity.username;
        name = entity.name;
      } else {
        username = entity.ownerObj!.username;
        name = entity.ownerObj!.name;
      }

      titleType = type.charAt(0).toUpperCase() + type.slice(1);
      if (type === 'activity') {
        titleType = 'Post';
      }

      return {
        type: type,
        time_created: entity.time_created,
        title: entity.title || entity.message || `${username}'s ${titleType}`,
        onPress: getEntityRoute(type, entity),
        username: username,
        name: name,
      };
    },
    [getEntityRoute],
  );
  const { result, error, loading, fetch } = useApiFetch<{
    dashboard: Dashboard;
  }>('api/v2/analytics/dashboards/trending', {
    params: {
      timespan: '30d',
      metric: 'views',
      filter: 'platform::all,view_type::total,channel::all',
    },
    persist: true,
  });

  if (!result && loading) {
    return <ActivityIndicator style={activityIndicatorStyle} size={'large'} />;
  }

  if (!result) {
    return null;
  }

  let rows: any[] = [];
  let dataError;

  try {
    rows = result.dashboard
      .metrics![0].visualisation.buckets!.filter(
        bucket => !!bucket.values.entity,
      )
      .map(bucket => ({
        ...bucket,
        values: {
          ...bucket.values,
          entity: reformatEntity(bucket.values.entity!),
        },
      }));
  } catch (e) {
    dataError = e;
  }

  if (error || dataError) {
    return (
      <Text style={errorStyle} onPress={fetch}>
        {i18n.t('error') + '\n'}
        <Text style={theme.colorLink}>{i18n.t('tryAgain')}</Text>
      </Text>
    );
  }

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={theme.padding4x}>
      <View style={theme.rowJustifySpaceBetween}>
        <View style={styles.firstColumn}>
          <Text style={theme.bold}>{i18n.t('analytics.trending.content')}</Text>
        </View>
        <View style={styles.columnView}>
          <Text style={styles.text}>
            {i18n.t('analytics.trending.totalViews')}
          </Text>
        </View>
        <View style={styles.columnView}>
          <Text style={styles.text}>
            {i18n.t('analytics.trending.organic')}
          </Text>
        </View>
        <View style={styles.columnView}>
          <Text style={styles.text}>
            {i18n.t('analytics.trending.pageViews')}
          </Text>
        </View>
      </View>

      {rows.map(row => (
        <TouchableOpacity
          key={row.key}
          activeOpacity={0.7}
          onPress={row.values.entity.onPress}
          style={theme.rowJustifySpaceBetween}>
          <View style={styles.firstColumn}>
            <Text>{row.values.entity.title}</Text>
            <Text style={styles.tertiaryText}>
              {`@${row.values.entity.username}`}
            </Text>
          </View>
          <View style={styles.columnViewP}>
            <Text>{row.values['views::total']}</Text>
          </View>
          <View style={styles.columnViewP}>
            <Text>{row.values['views::organic']}</Text>
          </View>
          <View style={styles.columnViewP}>
            <Text>{row.values['views::single']}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
});

export default TrendingTab;

const { width } = Dimensions.get('window');
const styles = ThemedStyles.create({
  scrollView: ['flexContainer', { width }],
  columnView: ['flexColumnCentered', 'paddingRight'],
  columnViewP: ['flexColumnCentered', 'padding'],
  text: ['bold', 'textCenter'],
  tertiaryText: ['colorTertiaryText', 'marginTop'],
  firstColumn: [
    'paddingVertical4x',
    {
      flex: 3,
    },
  ],
});
