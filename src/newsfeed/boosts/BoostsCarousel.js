import React, {
  PureComponent
} from 'react';

import {
  View,
  Dimensions,
  StyleSheet
} from 'react-native';

import Carousel, {
  Pagination
} from 'react-native-snap-carousel';

import Activity from '../activity/Activity';
import colors from '../../styles/Colors';

/**
 * Boosted content Carousel
 */
export default class BoostsCarousel extends PureComponent {

  state = {
    activeSlide:0
  }

  /**
   * Render a item
   */
  _renderItem = ({ item, index }) => {
    return (
      <View style={styles.slide}>
        <Activity
          entity={item}
          navigation={this.props.navigation}
        />
      </View>
    );
  }

  /**
   * Pagination
   */
  get pagination() {
    const { activeSlide } = this.state;
    return (
      <Pagination
        dotsLength={this.props.boosts.length}
        activeDotIndex={activeSlide}
        containerStyle={{ backgroundColor: '#FFF'}}
        tappableDots={true}
        carouselRef={this._carousel}
        dotContainerStyle={{
          marginHorizontal: 5,
        }}
        dotStyle={{
          width: 10,
          height: 10,
          borderRadius: 5,
          backgroundColor: colors.primary,
        }}
        inactiveDotStyle={{
          // Define styles for inactive dots here
        }}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.8}
      />
    );
  }

  /**
   * Render carousel
   */
  render() {
    if (this.props.boosts.length == 0 ) {
      return null;
    }

    return (
      <View>
        { this.pagination }
        <Carousel
          ref={(c) => { this._carousel = c; }}
          data={this.props.boosts}
          renderItem={this._renderItem}
          sliderWidth={sliderWidth}
          itemWidth={sliderWidth}
          onSnapToItem={(index) => this.setState({ activeSlide: index })}
        />
      </View>
    );
  }
}

const sliderWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  slide: {
    width: sliderWidth, //full size slider
  },
  slideInnerContainer: {
    flex: 1
  }
});