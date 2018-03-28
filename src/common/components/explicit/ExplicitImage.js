import React, {
  Component
} from 'react';

import { observer } from 'mobx-react/native';

import {
  StyleSheet,
  findNodeHandle,
  View
} from 'react-native';

import FastImage from 'react-native-fast-image';
import { createImageProgress } from 'react-native-image-progress';
import ProgressCircle from 'react-native-progress/Circle';

import { Icon } from 'react-native-elements';
import ExplicitOverlay from './ExplicitOverlay';

const ProgressFastImage = createImageProgress(FastImage);

@observer
export default class ExplicitImage extends Component {
  constructor(props) {
    super(props);
    this.state = { viewRef: null };
  }

  imageLoaded = () => {
    this.setState({ viewRef: findNodeHandle(this.backgroundImage) });
  }

  imageError = () => {
    if (this.props.onError) {
      this.props.onError();
    }
  }

  render() {
    let image;
    const disableProgress = this.props.disableProgress;

    if(disableProgress) {
      image = (
        <FastImage
          source={this.props.source}
          onLoadEnd={this.imageLoaded}
          onError={this.imageError}
          ref={(img) => { this.backgroundImage = img; }} style={[styles.absolute, this.props.imageStyle]}
        />
      )
    } else {
      image = (
        <ProgressFastImage
          indicator={ProgressCircle}
          threshold={150}
          source={this.props.source}
          onLoadEnd={this.imageLoaded}
          onError={this.imageError}
          ref={(img) => { this.backgroundImage = img; }} style={[styles.absolute, this.props.imageStyle]}
        />
      )
    }

    return (
      <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
        {image}
        { (this.props.entity.mature && this.state.viewRef) ?
          <ExplicitOverlay
            entity={this.props.entity}
            viewRef={this.state.viewRef}
            style={styles.absolute}
          /> : null
        }
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
