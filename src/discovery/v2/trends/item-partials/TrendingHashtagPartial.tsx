import React from 'react';
import { View, Text } from 'react-native';
import ThemedStyles from '../../../../styles/ThemedStyles';
import { styles } from '../DiscoveryTrendsListItem';
import { Icon } from 'react-native-elements';

type PropsType = {
  data: any;
};

const TrendingHashtagPartial = ({ data }: PropsType) => {
  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <Text style={styles.secondaryInformationTop}>
          Trending {data.period}h - {data.volume} posts
        </Text>
        <Text style={styles.title}>#{data.hashtag}</Text>
      </View>
      <Icon
        type="material-community"
        color={ThemedStyles.getColor('TertiaryText')}
        name="chevron-right"
        size={32}
        style={styles.centered}
      />
    </View>
  );
};

export default TrendingHashtagPartial;
