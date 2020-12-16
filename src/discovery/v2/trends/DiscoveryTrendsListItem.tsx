import { useNavigation } from '@react-navigation/core';
import { StackNavigationProp } from '@react-navigation/stack';
import { observer } from 'mobx-react';
import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import { Icon } from 'react-native-elements';
import FastImage from 'react-native-fast-image';
import SmartImage from '../../../common/components/SmartImage';
import formatDate from '../../../common/helpers/date';
import excerpt from '../../../common/helpers/excerpt';
import ThemedStyles from '../../../styles/ThemedStyles';

const DISCOVERY_TRENDING_MAX_LENGTH = 140;

interface Props {
  isHero: boolean;
  data: any;
}

/**
 * Discovery List Item
 */
export const DiscoveryTrendsListItem = observer((props: Props) => {
  const { data, isHero } = props;
  const navigation = useNavigation<StackNavigationProp<any>>();

  let partial: JSX.Element;

  const onPress = (): void => {
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
      return goToSearch();
    }
  };

  const goToSearch = (): void => {
    navigation.push('DiscoverySearch', {
      query: data.title || '#' + data.hashtag,
    });
  };

  const HeroPartial = (): JSX.Element => {
    const entity = data.entity;
    return (
      <View style={[styles.heroContainer]}>
        {RichPartialThumbnail()}
        <View
          style={[
            styles.container,
            ThemedStyles.style.padding4x,
            ThemedStyles.style.borderPrimary,
          ]}>
          <View style={[styles.body]}>
            <Text style={styles.title}>
              {excerpt(data.title, DISCOVERY_TRENDING_MAX_LENGTH)}
            </Text>
            <Text
              style={[
                ThemedStyles.style.colorSecondaryText,
                styles.secondaryInformationBottom,
              ]}>
              {data.volume} channels discussing -{' '}
              {formatDate(entity.time_created, 'friendly')}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const RichPartial = () => {
    const entity = data.entity;
    return (
      <View
        style={[
          styles.container,
          ThemedStyles.style.padding4x,
          ThemedStyles.style.borderPrimary,
        ]}>
        <View style={[styles.body]}>
          <Text style={styles.title}>
            {excerpt(data.title, DISCOVERY_TRENDING_MAX_LENGTH)}
          </Text>
          <Text
            style={[
              ThemedStyles.style.colorSecondaryText,
              styles.secondaryInformationBottom,
            ]}>
            {data.volume} channels discussing -{' '}
            {formatDate(entity.time_created, 'friendly')}
          </Text>
        </View>
        {RichPartialThumbnail()}
      </View>
    );
  };

  const RichPartialThumbnail = () => {
    const entity = data.entity;
    const uri = entity.thumbnail_src.startsWith('//')
      ? `https:${entity.thumbnail_src}`
      : entity.thumbnail_src;
    const image = { uri };

    console.log(entity.guid, image);

    return (
      <SmartImage
        source={image}
        style={[styles.thumbnail, isHero ? styles.heroThumbnail : null]}
        resizeMode={FastImage.resizeMode.cover}
      />
    );
  };

  const TrendingHashtagPartial = () => {
    return (
      <View
        style={[
          styles.container,
          ThemedStyles.style.padding4x,
          ThemedStyles.style.borderPrimary,
        ]}>
        <View style={[styles.body]}>
          <Text
            style={[
              ThemedStyles.style.colorSecondaryText,
              styles.secondaryInformationTop,
            ]}>
            Trending {data.period}h - {data.volume} posts
          </Text>
          <Text style={styles.title}>#{data.hashtag}</Text>
        </View>
        <Icon
          type="material-community"
          color={ThemedStyles.getColor('tertiary_text')}
          name="chevron-right"
          size={32}
          style={styles.centered}
        />
      </View>
    );
  };

  if (isHero && data.entity) {
    partial = HeroPartial();
  } else {
    partial = data.title ? RichPartial() : TrendingHashtagPartial();
  }

  return (
    <TouchableHighlight underlayColor="transparent" onPress={() => onPress()}>
      {partial}
    </TouchableHighlight>
  );
});

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
  },
  body: { flex: 1, paddingRight: 10 },
  centered: {
    alignSelf: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  secondaryInformationTop: {
    paddingBottom: 8,
  },
  secondaryInformationBottom: {
    paddingTop: 8,
  },
  thumbnail: {
    width: 100,
    height: 100,
  },

  // Hero specific
  heroContainer: {
    flexDirection: 'column',
    paddingHorizontal: 0,
    paddingTop: 0,
  },
  heroThumbnail: {
    width: '100%',
    height: Dimensions.get('window').height / 3,
  },
});
