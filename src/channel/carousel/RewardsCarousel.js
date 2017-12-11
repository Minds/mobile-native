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

  state = {
    width: Dimensions.get('window').width
  }

  /**
   * Handle dimensions changes
   */
  dimensionChange = () => {
    this.setState({
      width: Dimensions.get('window').width
    });
  }

  componentWillMount() {
    Dimensions.addEventListener("change", this.dimensionChange);
  }

  componentWillUnmount() {
    // allways remove listeners on unmount
    Dimensions.removeEventListener("change", this.dimensionChange);
  }

  /**
   * Render component
   */
  render() {
    const rewards = this.props.rewards;

    const rewardsArray = [];

    if (rewards.money) {
      // align text from props
      let align = null;
      if (this.props.textAlign) {
        align = {textAlign:this.props.textAlign};
      }

      rewards.money.map((rew) => {
        rewardsArray.push(
          <View key={`rewards${rew.amount}`} style={cstyles.carouselitems}>
            <View>
              <Text style={[cstyles.rewardamount, align]}>${rew.amount}+</Text>
              <Text style={[cstyles.rewarddesc, align]}>{rew.description}</Text>
            </View>
            <Icon style={cstyles.rewardicon} name={'ios-flash'} size={36} />
          </View>
        );
      });
    }

    const {
      backgroundColor = '#fff'
    } = this.props;

    return (
      <Carousel width={this.state.width} height={70} color={'#0071ff'} backgroundColor={backgroundColor}>
        {rewardsArray}
      </Carousel>
    )
  }
}

const cstyles = {
  carouselitems: {
    paddingLeft: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rewardicon: {
    color: '#0071ff',
    width: 30
  },
  rewardamount: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  rewarddesc: {
    color: '#999'
  },
}