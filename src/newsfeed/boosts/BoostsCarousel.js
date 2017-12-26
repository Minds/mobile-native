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
    activeSlide:0,
    width: Dimensions.get('window').width
  }

  /**
   * Render a item
   */
  _renderItem = ({ item, index }) => {
    return (
      <View style={this.styles.slide}>
        <Activity
          entity={item}
          navigation={this.props.navigation}
          />
      </View>
    );
  }

  /**
   * On layout
   */
  _onLayout = (e) => {
    this.setState({
      width: Dimensions.get('window').width,
    });
  }

  _onSnapToItem = (index) => {
    this.setState({ activeSlide: index });
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

    this.styles = {
      slide: {
        flex: 1,
        width: this.state.width, //full size slider
      },
      flexContainer: {
        flex: 1
      }
    };

    const carousel = (
      <Carousel
        ref={(c) => { this._carousel = c; }}
        data={this.props.boosts}
        renderItem={this._renderItem}
        sliderWidth={this.state.width}
        itemWidth={this.state.width}
        containerCustomStyle={this.styles.flexContainer}
        slideStyle={this.styles.flexContainer}
        onSnapToItem={this._onSnapToItem}
        removeClippedSubviews={true}
      />
    )

    return (
      <View style={ this.styles.flexContainer } onLayout={this._onLayout}>
        { this.pagination }
        { carousel }
      </View>
    );
  }
}

