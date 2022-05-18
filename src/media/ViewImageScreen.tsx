//@ts-nocheck
import React, { Component } from 'react';

import { View, Dimensions } from 'react-native';
import ImageViewer from '../common/components/ImageViewer';
import ThemedStyles from '../styles/ThemedStyles';

/**
 * Full screen image viewer
 */
export default class ViewImageScreen extends Component {
  constructor(props) {
    super(props);

    const custom_data = this.props.route.params.entity.custom_data;

    let width = Dimensions.get('window').width;
    const maxHeight = Dimensions.get('window').height;

    let height = 300;

    if (custom_data && custom_data[0].height && custom_data[0].height !== '0') {
      let ratio = custom_data[0].height / custom_data[0].width;
      height = Math.round(width * ratio);

      if (height > maxHeight) {
        width = Math.round(width * (maxHeight / height));
        height = maxHeight;
      }
    }

    this.state = {
      width,
      height,
    };
  }

  getSource() {
    return this.props.route.params.source;
  }

  onSwipeDown = () => {
    this.props.navigation.goBack();
  };

  render() {
    const source = this.getSource();
    const theme = ThemedStyles.theme;

    return (
      <View style={theme.flexContainer}>
        <ImageViewer
          onSwipeDown={this.onSwipeDown}
          source={source}
          urn={this.props.route.params.entity.urn}
          width={this.state.width}
          height={this.state.height}
        />
      </View>
    );
  }
}
