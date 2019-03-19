import React, {
  Component
} from 'react';

import { observer } from 'mobx-react/native';
import Placeholder from 'rn-placeholder';

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

  imageError = (err) => {
    // bubble event up
    this.props.onError && this.props.onError();
  }

  setActive = () => {
    this.setState({ready: true});
    // bubble event up
    this.props.onLoadEnd && this.props.onLoadEnd();
  }

  render() {
    const loadingIndicator = this.props.loadingIndicator;

    // do not show image if it is mature
    if ((this.props.entity.mature || this.props.entity.is_parent_mature) && !this.props.entity.mature_visibility) {
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
      case 'placeholder':
        return (
          <View style={[CommonStyle.positionAbsolute, this.props.imageStyle]}>
            <FastImage
              source={this.props.source}
              onError={this.imageError}
              onLoadEnd={this.setActive}
              style={[CommonStyle.positionAbsolute, this.props.imageStyle]}
            />
            {!this.state.ready && <Placeholder.Box
              height="100%"
              width="100%"
              animate="fade"
              color="grey"
            />}
          </View>
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
