import React, {
  PureComponent
} from 'react';

import {
  StyleSheet,
  TouchableOpacity
} from 'react-native';

import FastImage from 'react-native-fast-image';

import {
  MINDS_URI
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
      this.props.navigation.navigate('DiscoveryView', { entity: this.props.entity.item });
    }
  }

  render() {
    const url = { uri: MINDS_URI + 'api/v1/archive/thumbnails/' + this.props.entity.item.guid + '/medium' };
    return (
      <TouchableOpacity onPress={this._navToView} style={styles.tileImage}>
        <FastImage
          source={ url }
          style={styles.tileImage}
        />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  tileImage: {
    minHeight: 120,
    flex: 1,
  },
});