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

import BoostItem from './BoostItem';
import colors from '../../styles/Colors';

/**
 * Boosted content Carousel
 */
export default class BoostsCarousel extends PureComponent {

  /**
   * Items height
   */
  itemsRef = [];

  /**
   * Component State
   */
  state = {
    activeSlide:0,
    width: Dimensions.get('window').width
  }

  /**
   * on unmount delete references
   */
  onComponentUnmount() {
    this.itemsRef = [];
  }

  /**
   * Render a item
   */
  _renderItem = ({ item, index }) => {
    return (
      <BoostItem
        entity={item}
        navigation={this.props.navigation}
        ref={(ref) => {
          this.itemsRef[index] = ref;
        }}
        />
    );
  }

  /**
   * On layout
   */
  _onLayout = (e) => {
    setTimeout(() => {
      this.setState({
        height: this.itemsRef[this.state.activeSlide].height,
        width: Dimensions.get('window').width,
      });
    }, 100);
  }

  /**
   * On item snap
   */
  _onSnapToItem = (index) => {
    this.setState({
      activeSlide: index,
      height: this.itemsRef[index].height,
    });
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
        width: this.state.width, //full size slider
      },
      containerStyle: {
        flexGrow: 1
      },
      flexContainer: {
        flex: 1
      },
      itemHeight: {}
    };

    if (this.state.height) {
      this.styles.itemHeight.height = this.state.height;
    }

    const carousel = (
      <Carousel
        ref={(c) => { this._carousel = c; }}
        data={this.props.boosts}
        renderItem={this._renderItem}
        sliderWidth={this.state.width}
        itemWidth={this.state.width}
        containerCustomStyle={this.state.containerStyle}
        //slideStyle={[this.styles.slide, { height: this.state.height }]}
        slideStyle={this.styles.slide}
        onSnapToItem={this._onSnapToItem}
        // Must be equal to the total number of boosts in order to autoheight workaround works
        windowSize={15}
        maxToRenderPerBatch={15}
        initialNumToRender={15}
      />
    )

    return (
      <View style={[this.styles.flexContainer] } onLayout={this._onLayout}>
        { this.pagination }
        <View style={this.styles.itemHeight}>
        { carousel }
        </View>
      </View>
    );
  }
}

