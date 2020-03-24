import React, {
  Component
} from 'react';

import { observer } from 'mobx-react';

import {
  findNodeHandle,
  Platform,
  Image,
  View
} from 'react-native';

import FastImage from 'react-native-fast-image';
import { createImageProgress } from 'react-native-image-progress';
import ProgressCircle from 'react-native-progress/Circle';
import { Icon } from 'react-native-elements';
import { CommonStyle } from '../../../styles/Common';

const ProgressFastImage = createImageProgress(FastImage);
const ProgressImage = createImageProgress(Image);

@observer
export default class ExplicitImage extends Component {

  state = {
    ready: false
  }

  imageError = (event) => {
    // bubble event up
    this.props.onError && this.props.onError(event.nativeEvent.error);
  }

  setActive = () => {
    this.setState({ready: true});
    // bubble event up
    this.props.onLoadEnd && this.props.onLoadEnd();
  }

  render() {
    const loadingIndicator = this.props.loadingIndicator;

    // do not show image if it is mature
    if (this.props.entity.shouldBeBlured() && !this.props.entity.mature_visibility) {
      return (
        <View
          style={[CommonStyle.positionAbsolute, this.props.imageStyle, CommonStyle.blackOverlay]}
        />
      );
    }

    switch(loadingIndicator) {
      case undefined:
        return (
          <FastImage
            source={this.props.source}
            onError={this.imageError}
            onLoadEnd={this.setActive}
            style={[CommonStyle.positionAbsolute, this.props.imageStyle]}
          />
        );
      case 'progress':
        return (
          <ProgressFastImage
            indicator={ProgressCircle}
            threshold={150}
            source={this.props.source}
            onLoadEnd={this.setActive}
            onError={this.imageError}
            style={[CommonStyle.positionAbsolute, this.props.imageStyle]}
          />
        );
    }
  }
}
