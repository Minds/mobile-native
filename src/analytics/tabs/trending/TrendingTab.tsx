import { useDimensions } from '@react-native-community/hooks';
import { observer } from 'mobx-react';
import React, { useCallback } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import useApiFetch from '../../../common/hooks/useApiFetch';
import i18n from '../../../common/services/i18n.service';
import ThemedStyles from '../../../styles/ThemedStyles';
import { Dashboard, Entity } from '../../AnalyticsTypes';

interface TrendingTabProps {
  navigation: any;
}

const TrendingTab = observer(({ navigation }: TrendingTabProps) => {
  const theme = ThemedStyles.style;
  const { width } = useDimensions().window;

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
  }>(
    'api/v2/analytics/dashboards/trending',
    {
      timespan: '30d',
      metric: 'views',
      filter: 'platform::all,view_type::total,channel::all',
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

  let rows: any[] = [];
  let dataError;

  try {
    rows = result.dashboard
      .metrics![0].visualisation.buckets!.filter(
        (bucket) => !!bucket.values.entity,
      )
      .map((bucket) => ({
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
    <ScrollView
      style={[theme.flexContainer, { width }, { marginBottom: 180 }]}
      contentContainerStyle={theme.padding4x}>
      <View style={[theme.rowJustifySpaceBetween]}>
        <View style={[styles.firstColumn, theme.paddingVertical4x]}>
          <Text style={theme.bold}>{i18n.t('analytics.trending.content')}</Text>
        </View>
        <View style={[theme.flexColumnCentered, theme.padding]}>
          <Text style={theme.bold}>
            {i18n.t('analytics.trending.totalViews')}
          </Text>
        </View>
        <View style={[theme.flexColumnCentered, theme.padding]}>
          <Text style={theme.bold}>{i18n.t('analytics.trending.organic')}</Text>
        </View>
        <View style={[theme.flexColumnCentered, theme.padding]}>
          <Text style={theme.bold}>
            {i18n.t('analytics.trending.pageViews')}
          </Text>
        </View>
      </View>

      {rows.map((row) => (
        <TouchableOpacity
          key={row.key}
          activeOpacity={0.7}
          onPress={row.values.entity.onPress}
          style={theme.rowJustifySpaceBetween}>
          <View style={[styles.firstColumn, theme.paddingVertical4x]}>
            <Text>{row.values.entity.title}</Text>
            <Text style={[theme.colorTertiaryText, theme.marginTop]}>
              {`@${row.values.entity.username}`}
            </Text>
          </View>
          <View style={[theme.flexColumnCentered, theme.padding]}>
            <Text>{row.values['views::total']}</Text>
          </View>
          <View style={[theme.flexColumnCentered, theme.padding]}>
            <Text>{row.values['views::organic']}</Text>
          </View>
          <View style={[theme.flexColumnCentered, theme.padding]}>
            <Text>{row.values['views::single']}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
});

export default TrendingTab;

const styles = StyleSheet.create({
  firstColumn: {
    flex: 3,
  },
});
