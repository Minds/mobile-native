import React, {
  Component
} from 'react';

import {
  Text,
  View,
  Dimensions
} from 'react-native';

import {
  observer,
} from 'mobx-react/native'

import Icon from 'react-native-vector-icons/Ionicons';
import Carousel from '../../common/components/Carousel';

/**
 * Channel Rewards Carousel
 */
@observer
export default class RewardsCarousel extends Component {

  /**
   * Render component
   */
  render() {
    const rewards = this.props.rewards;
    const styles  = this.props.styles;

    const width = Dimensions.get('window').width;

    const rewardsArray = [];

    if (rewards.money) {
      rewards.money.map((rew) => {
        rewardsArray.push(
          <View key={`rewards${rew.amount}`} style={styles.carouselitems}>
            <View>
              <Text style={styles.rewardamount}>${rew.amount}+</Text>
              <Text style={styles.rewarddesc}>{rew.description}</Text>
            </View>
            <Icon style={styles.rewardicon} name={'ios-flash'} size={36} />
          </View>
        );
      });
    }

    return (
      <Carousel style={styles.carousel} width={width} height={70} color={'#0071ff'}>
        {rewardsArray}
      </Carousel>
    )
  }
}