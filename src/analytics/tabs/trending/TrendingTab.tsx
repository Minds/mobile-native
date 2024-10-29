import { useNavigation } from '@react-navigation/native';
import { observer } from 'mobx-react';
import React, { useCallback } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import ActivityIndicator from '../../../common/components/ActivityIndicator';
import MText from '../../../common/components/MText';
import useApiFetch from '../../../common/hooks/useApiFetch';
import { Dashboard, Entity } from '../../AnalyticsTypes';
import { activityIndicatorStyle, errorStyle } from '../dashboard/DashboardTab';
import { getMaxFeedWidth } from '~/styles/Style';
import sp from '~/services/serviceProvider';

const TrendingTab = observer(() => {
  const theme = sp.styles.style;
  const navigation = useNavigation<any>();

  const getEntityRoute = useCallback(
    (type, entity) => {
      switch (type) {
        case 'activity':
        case 'remind':
        case 'image':
        case 'video':
        case 'blog':
          return () =>
            navigation.push('Activity', {
              entity,
            });
        case 'group':
          return () =>
            navigation.push('GroupView', {
              group: entity,
            });
        case 'channel':
          return () =>
            navigation.push('Channel', {
              entity: entity,
            });
        default:
          return () => null;
      }
    },
    [navigation],
  );

  const reformatEntity = useCallback(
    (entity: Entity) => {
      let type, subtitle, title;
      type = entity.type;

      switch (type) {
        case 'user':
          type = 'channel';
          title =
            entity.title || entity.message || `@${entity.username}'s Channel`;
          subtitle = `@${entity.username}`;
          break;
        case 'group':
          subtitle = entity.briefdescription;
          title = entity.name;
          break;
        case 'activity':
        default:
          let titleType = type.charAt(0).toUpperCase() + type.slice(1);
          if (type === 'activity') {
            titleType = 'Post';
          }

          title =
            entity.title ||
            entity.message ||
            `@${entity.ownerObj?.username}'s ${titleType}`;
          subtitle = `@${entity.ownerObj?.username}`;
          break;
      }

      return {
        type,
        time_created: entity.time_created,
        onPress: getEntityRoute(type, entity),
        subtitle,
        title,
      };
    },
    [getEntityRoute],
  );
  const { result, error, loading, refresh } = useApiFetch<{
    dashboard: Dashboard;
  }>('api/v2/analytics/dashboards/trending', {
    params: {
      timespan: '30d',
      metric: 'views',
      filter: 'platform::all,view_type::total,channel::all',
    },
    persist: true,
  });
  const onTryAgain = useCallback(() => refresh(), [refresh]);

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
      <MText style={errorStyle} onPress={onTryAgain}>
        {sp.i18n.t('error') + '\n'}
        <MText style={theme.colorLink}>{sp.i18n.t('tryAgain')}</MText>
      </MText>
    );
  }

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={theme.padding4x}>
      <View style={theme.rowJustifySpaceBetween}>
        <View style={styles.firstColumn}>
          <MText style={theme.bold}>
            {sp.i18n.t('analytics.trending.content')}
          </MText>
        </View>
        <View style={styles.columnView}>
          <MText style={styles.text}>
            {sp.i18n.t('analytics.trending.totalViews')}
          </MText>
        </View>
        <View style={styles.columnView}>
          <MText style={styles.text}>
            {sp.i18n.t('analytics.trending.organic')}
          </MText>
        </View>
        <View style={styles.columnView}>
          <MText style={styles.text}>
            {sp.i18n.t('analytics.trending.pageViews')}
          </MText>
        </View>
      </View>

      {rows.map(row => (
        <TouchableOpacity
          key={row.key}
          activeOpacity={0.7}
          onPress={row.values.entity.onPress}
          style={theme.rowJustifySpaceBetween}>
          <View style={styles.firstColumn}>
            <MText ellipsizeMode="tail" numberOfLines={2}>
              {row.values.entity.title}
            </MText>
            <MText
              ellipsizeMode="tail"
              numberOfLines={3}
              style={styles.tertiaryText}>
              {row.values.entity.subtitle}
            </MText>
          </View>
          <View style={styles.columnViewP}>
            <MText>{row.values['views::total']}</MText>
          </View>
          <View style={styles.columnViewP}>
            <MText>{row.values['views::organic']}</MText>
          </View>
          <View style={styles.columnViewP}>
            <MText>{row.values['views::single']}</MText>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
});

export default TrendingTab;

const width = getMaxFeedWidth();
const styles = sp.styles.create({
  scrollView: ['flexContainer', { width }, 'marginBottom24x'],
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
