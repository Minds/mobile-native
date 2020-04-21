//@ts-nocheck
import React, { PureComponent } from 'react';
import { TouchableOpacity, Platform } from 'react-native';
import FastImage from 'react-native-fast-image';

import { createImageProgress } from 'react-native-image-progress';
import ProgressCircle from 'react-native-progress/Circle';
import type ActivityModel from './ActivityModel';

const ProgressFastImage = createImageProgress(FastImage);

type PropsType = {
  entity: ActivityModel;
  size: number;
  navigation: any;
};

export default class TileElement extends PureComponent<PropsType> {
  /**
   * Navigate to view
   */
  _navToView = () => {
    if (this.props.navigation) {
      this.props.navigation.push('Activity', { entity: this.props.entity });
    }
  };

  render() {
    const style = { width: this.props.size, height: this.props.size };

    const source = this.props.entity.getThumbSource();

    const image =
      Platform.OS === 'android' ? (
        <ProgressFastImage
          indicator={ProgressCircle}
          source={source}
          style={style}
          threshold={150}
        />
      ) : (
        <FastImage source={source} style={style} />
      );

    return (
      <TouchableOpacity onPress={this._navToView} style={style}>
        {image}
      </TouchableOpacity>
    );
  }
}
