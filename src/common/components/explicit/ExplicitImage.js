import React, {
  Component
} from 'react';

import { observer } from 'mobx-react/native';

import {
  StyleSheet,
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

  imageError = (err) => {
    if (this.props.onError) {
      this.props.onError();
    }
  }

  render() {
    let image;
    const disableProgress = this.props.disableProgress;

    if ((this.props.entity.mature || this.props.entity.is_parent_mature) && !this.props.entity.mature_visibility) {
      image = (
        <View
          style={[CommonStyle.positionAbsolute, this.props.imageStyle, CommonStyle.blackOverlay]}
        />
      );
    } else if (disableProgress) {
      image = (
        <FastImage
          source={this.props.source}
          onError={this.imageError}
          ref={(img) => { this.backgroundImage = img; }}
          style={[CommonStyle.positionAbsolute, this.props.imageStyle]}
        />
      );
    } else {
      image = (
        <ProgressFastImage
          indicator={ProgressCircle}
          threshold={150}
          source={this.props.source}
          onError={this.imageError}
          ref={5} style={[CommonStyle.positionAbsolute, this.props.imageStyle]}
        />
      );
    }

    return (
      <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
        {image}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  absolute: {
    position: "absolute",
    backgroundColor: 'black',
    top: 0, left: 0, bottom: 0, right: 0,
  },
});
