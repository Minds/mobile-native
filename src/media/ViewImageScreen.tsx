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

    const entity = this.props.route.params.entity;
    const custom_data = entity.custom_data;

    let width = Dimensions.get('window').width;
    const maxHeight = Dimensions.get('window').height;

    let height = 300;

    let imageWidth = Number(custom_data?.[0]?.width) || entity.width;
    let imageHeight = Number(custom_data?.[0]?.height) || entity.height;

    if (imageHeight) {
      let ratio = imageHeight / imageWidth;
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
