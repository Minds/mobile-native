import React, {
  PureComponent
} from 'react';

import {
  View,
  Dimensions,
  StyleSheet,
  Switch,
  Text
} from 'react-native';

import Modal from 'react-native-modal'

import Carousel, {
  Pagination
} from 'react-native-snap-carousel';

import BoostItem from './BoostItem';
import colors from '../../styles/Colors';
import { Icon } from 'react-native-elements'
import { CommonStyle } from '../../styles/Common';

import settingsService from './SettingsService';

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
    isModalVisible: false,
    autoRotate: true,
    mature: false,
    open: true,
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

  onPressOptions = () => {
    this.setState({ isModalVisible: true });
  }

  hideModal = () => {
    this.setState({ isModalVisible: false });
  }

  onModalHide = () => {
  }

  onOpenChanged = (value) => {
    this.setState({open: value});
    settingsService.settings( this.props.me.guid , this.state.open ? 2: 1, this.state.mature? 1:0).then( (result) => {
      this.props.store.loadBoosts( this.state.open ? 2: 1)
    });
  }

  onExplicitChanged = (value) => {
    this.setState({mature: value})
    settingsService.settings( this.props.me.guid , this.state.open ? 2: 1, this.state.mature? 1:0).then( (result) => {
      this.props.store.loadBoosts( this.state.open ? 2: 1)
    });
  }

  onAutoRotateChanged = (value) => {
    this.setState({autoRotate: value})
  }

  showCarousel(style) {
    if(this.props.store.loadingBoost) {
      return <CenteredLoading/>
    } else {
      if (this.state.height) {
        this.styles.itemHeight.height = this.state.height;
      }
      return <Carousel
              ref={(c) => { this._carousel = c; }}
              data={this.props.boosts}
              renderItem={this._renderItem}
              sliderWidth={this.state.width}
              itemWidth={this.state.width}
              containerCustomStyle={this.state.containerStyle}
              //slideStyle={[this.styles.slide, { height: this.state.height }]}
              slideStyle={this.styles.slide}
              onSnapToItem={this._onSnapToItem}
              inactiveSlideScale={1}
              loop={this.state.autoRotate}
              // Must be equal to the total number of boosts in order to autoheight workaround works
              windowSize={15}
              maxToRenderPerBatch={15}
              initialNumToRender={15}
            />
    } 
  }

  showBoostCarousel() {
    if(this.props.me.plus) {
      return  <View style={[CommonStyle.rowJustifyCenter, CommonStyle.centered, {height:50}]}>
                <Text>Hide boost</Text>
                <Switch
                  onValueChange = {this.onHideBoostChanged}
                  onTintColor = {colors.primary}
                  thumbTintColor = {colors.primary}
                  value = {this.state.hideBoost}/>
              </View>;
    } else {
      return null;
    }
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

    return (
      <View style={[this.styles.flexContainer] } onLayout={this._onLayout}>
        <View style={[CommonStyle.rowJustifyEnd]}>
          <Icon type='material-community' name='settings' size={20} onPress={this.onPressOptions} />
        </View>
        <Modal
          isVisible={this.state.isModalVisible}
          useNativeDriver={true}
          onBackdropPress={this.hideModal}
          onModalHide={this.onModalHide}
        >
          <View style={[CommonStyle.alignJustifyCenter,{backgroundColor: 'white'}]}>
            <View style={[CommonStyle.rowJustifyCenter, CommonStyle.centered, {height:50}]}>
              <Text>Open</Text>
              <Switch
                onValueChange = {this.onOpenChanged}
                onTintColor = {colors.primary}
                thumbTintColor = {colors.primary}
                value = {this.state.open}/>
            </View>
            <View style={[CommonStyle.rowJustifyCenter, CommonStyle.centered, {height:50}]}>
              <Text>Explicit</Text>
              <Switch
                onValueChange = {this.onExplicitChanged}
                onTintColor = {colors.primary}
                thumbTintColor = {colors.primary}
                value = {this.state.mature}/>
            </View>
            <View style={[CommonStyle.rowJustifyCenter, CommonStyle.centered, {height:50}]}>
              <Text>Auto-rotate</Text>
              <Switch
                onValueChange = {this.onAutoRotateChanged}
                onTintColor = {colors.primary}
                thumbTintColor = {colors.primary}
                value = {this.state.autoRotate}/>
            </View>
            {this.showBoostCarousel()}
          </View>
        </Modal>
        { this._carousel ? this.pagination : null }
        <View style={this.styles.itemHeight}>
        { this.showCarousel() }
        </View>
      </View>
    );
  }
}

