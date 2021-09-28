import React from 'react';
import { View } from 'react-native';
import ThemedStyles from '../../../../styles/ThemedStyles';
import { styles } from '../DiscoveryTrendsListItem';
import { Icon } from 'react-native-elements';
import MText from '../../../../common/components/MText';

type PropsType = {
  data: any;
};

const TrendingHashtagPartial = ({ data }: PropsType) => {
  return (
    <View style={styles.container}>
      <View style={styles.body}>
        <MText style={styles.secondaryInformationTop}>
          Trending {data.period}h - {data.volume} posts
        </MText>
        <MText style={styles.title}>#{data.hashtag}</MText>
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
