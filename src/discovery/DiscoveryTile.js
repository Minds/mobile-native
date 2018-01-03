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


export default class DiscoveryTile extends PureComponent {

  /**
   * Navigate to view
   */
  _navToView = () => {
    if (this.props.navigation) {
      this.props.navigation.navigate('Activity', { entity: this.props.entity.item });
    }
  }

  render() {
    const url = { uri: MINDS_CDN_URI + 'api/v1/archive/thumbnails/' + this.props.entity.item.guid + '/medium' };

    const style = { width: this.props.size, height: this.props.size};

    return (
      <TouchableOpacity onPress={this._navToView} style={style}>
        <FastImage
          source={ url }
          style={style}
        />
      </TouchableOpacity>
    );
  }
}
