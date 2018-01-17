import React, {
    PureComponent
  } from 'react';
  
  import {
    TouchableOpacity
  } from 'react-native';
  
  import FastImage from 'react-native-fast-image';
  
  import {
    MINDS_CDN_URI
  } from '../config/Config';
  
  import {
    observer
  } from 'mobx-react/native'
  
  import { createImageProgress } from 'react-native-image-progress';
  import ProgressCircle from 'react-native-progress/Circle';
  
  const ProgressFastImage = createImageProgress(FastImage);
  
  export default class TileElement extends PureComponent {
    
    state = {
        source: { uri: MINDS_CDN_URI + 'api/v1/archive/thumbnails/' + this.props.entity.guid + '/medium' }
    }
    /**
     * Navigate to view
     */
    _navToView = () => {
      if (this.props.navigation) {
        this.props.navigation.navigate('ViewImage', { source: this.state.source });
      }
    }
  
    render() {
  
      const style = { width: this.props.size, height: this.props.size};
  
      return (
        <TouchableOpacity onPress={this._navToView} style={style}>
          <ProgressFastImage
            indicator={ProgressCircle}
            source={ this.state.source }
            style={style}
            threshold={150}
          />
        </TouchableOpacity>
      );
    }
  }
  