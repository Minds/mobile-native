import { useNavigation } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import React from 'react';
import { Dimensions, StyleSheet, TouchableHighlight } from 'react-native';

import { withErrorBoundary } from '../../../common/components/ErrorBoundary';

import HeroPartial from './item-partials/HeroPartial';
import RichPartial from './item-partials/RichPartial';
import TrendingHashtagPartial from './item-partials/TrendingHashtagPartial';
import sp from '~/services/serviceProvider';

export const DISCOVERY_TRENDING_MAX_LENGTH = 140;

interface Props {
  isHero: boolean;
  data: any;
}

/**
 * Discovery List Item
 */
export const DiscoveryTrendsListItem = withErrorBoundary((props: Props) => {
  const { data, isHero } = props;
  const navigation = useNavigation<StackNavigationProp<any>>();

  let partial: React.ReactNode;
  //185 60 15

  const onPress = React.useCallback((): void => {
    if (data.entity) {
      if (data.entity.subtype === 'blog') {
        navigation.push('BlogView', {
          blog: data.entity,
        });
      } else {
        navigation.push('Activity', {
          entity: data.entity,
        });
      }
    } else {
      navigation.push('DiscoverySearch', {
        query: data.title || '#' + data.hashtag,
      });
    }
  }, [data.entity, data.hashtag, data.title, navigation]);

  if (isHero && data.entity) {
    partial = <HeroPartial data={data} />;
  } else {
    partial = data.title ? (
      <RichPartial data={data} />
    ) : (
      <TrendingHashtagPartial data={data} />
    );
  }

  return (
    <TouchableHighlight underlayColor="transparent" onPress={onPress}>
      {partial}
    </TouchableHighlight>
  );
});

export const styles = sp.styles.create({
  container: [
    {
      borderBottomWidth: StyleSheet.hairlineWidth * 2,
      flexDirection: 'row',
      display: 'flex',
      alignItems: 'center',
    },
    'padding4x',
    'bcolorPrimaryBorder',
  ],
  body: [{ flex: 1, paddingRight: 10 }],
  centered: [
    {
      alignSelf: 'center',
    },
  ],
  title: [
    {
      fontWeight: 'bold',
      fontSize: 16,
    },
  ],
  secondaryInformationTop: [
    {
      paddingBottom: 8,
    },
    'colorSecondaryText',
  ],
  secondaryInformationBottom: [
    {
      paddingTop: 8,
    },
    'colorSecondaryText',
  ],
  thumbnail: [
    {
      width: 100,
      height: 100,
    },
  ],

  // Hero specific
  heroContainer: [
    {
      flexDirection: 'column',
      paddingHorizontal: 0,
      paddingTop: 0,
    },
  ],
  heroThumbnail: [
    {
      width: '100%',
      height: Dimensions.get('window').height / 3,
    },
  ],
});
