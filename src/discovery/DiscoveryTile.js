import React, {
  PureComponent
} from 'react';

import {
  Platform,
  Text,
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
//import ProgressCircle from 'react-native-progress/Circle';

const ProgressFastImage = createImageProgress(FastImage);

export default class DiscoveryTile extends PureComponent {

  /**
   * Navigate to view
   */
  _navToView = () => {
    if (this.props.navigation) {
      this.props.navigation.navigate('Activity', { 
        entity: this.props.entity,
        scrollToBottom: true 
      });
    }
  }

  errorRender = (err) => {
    return <Text>Image Error</Text>
  }

  render() {
    const url = this.props.entity.getThumbSource();

    const style = { width: this.props.size, height: this.props.size };

    return (
      <TouchableOpacity onPress={this._navToView} style={[ style, styles.tile ]}>
        { Platform.OS === 'android' ?
          <ProgressFastImage
            indicator={null}
            source={ url }
            style={{ width: this.props.size -2, height: this.props.size -2}}
            threshold={150}
            renderError={this.errorRender}
          />
          :
          <FastImage
            source={ url }
            style={{ width: this.props.size -2, height: this.props.size -2}}
          />
      }
      </TouchableOpacity>
    );
  }
}

const styles = {
  tile: {
    paddingTop: 1,
    paddingBottom: 1,
    paddingRight: 1,
    paddingLeft: 1,
  }
}
