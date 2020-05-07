//@ts-nocheck
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { createImageProgress } from 'react-native-image-progress';

import ProgressCircle from 'react-native-progress/Circle';
import { CommonStyle } from '../../../styles/Common';
import ConnectivityAwareSmartImage from '../ConnectivityAwareSmartImage';

const ProgressFastImage = createImageProgress(FastImage);

@observer
export default class ExplicitImage extends Component {
  imageError = (event) => {
    // bubble event up
    this.props.onError && this.props.onError(event.nativeEvent.error);
  };

  onLoadEnd = () => {
    // bubble event up
    this.props.onLoadEnd && this.props.onLoadEnd();
  };

  render() {
    const loadingIndicator = this.props.loadingIndicator;

    // do not show image if it is mature
    if (
      this.props.entity.shouldBeBlured() &&
      !this.props.entity.mature_visibility
    ) {
      return (
        <View
          style={[
            CommonStyle.positionAbsolute,
            this.props.imageStyle,
            CommonStyle.blackOverlay,
          ]}
        />
      );
    }

    if (
      !this.props.source ||
      !this.props.source.uri ||
      this.props.source.uri.indexOf('//') < 0
    ) {
      return <View />;
    }

    switch (loadingIndicator) {
      case undefined:
        return (
          <ConnectivityAwareSmartImage
            source={this.props.source}
            onLoadEnd={this.onLoadEnd}
            style={[CommonStyle.positionAbsolute, this.props.imageStyle]}
          />
        );
      case 'progress':
        return (
          <ProgressFastImage
            indicator={ProgressCircle}
            threshold={150}
            source={this.props.source}
            onLoadEnd={this.onLoadEnd}
            onError={this.imageError}
            style={[CommonStyle.positionAbsolute, this.props.imageStyle]}
          />
        );
    }
  }
}
