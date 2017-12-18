import React, {
  Component
} from 'react';

import { Dimensions, Image } from 'react-native';

import PhotoView from 'react-native-photo-view';

/**
 * Full screen image viewer
 */
export default class ViewImageScreen extends Component {

  getSource() {
    return this.props.navigation.state.params.source;
  }

  render() {

    const source = this.getSource();

    return (
      <PhotoView
        source={source}
        minimumZoomScale={0.5}
        maximumZoomScale={3}
        androidScaleType="fitCenter"
        style={{ flex:1 }} />
    )
  }
}
