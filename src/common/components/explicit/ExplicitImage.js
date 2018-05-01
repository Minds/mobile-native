import React, {
  Component
} from 'react';

import { observer } from 'mobx-react/native';

import {
  StyleSheet,
  findNodeHandle,
  View,
  Platform,
  Image
} from 'react-native';

import FastImage from 'react-native-fast-image';
import { createImageProgress } from 'react-native-image-progress';
import ProgressCircle from 'react-native-progress/Circle';

import { Icon } from 'react-native-elements';
import ExplicitOverlay from './ExplicitOverlay';

const ProgressFastImage = createImageProgress(FastImage);
const ProgressImage = createImageProgress(Image);

@observer
export default class ExplicitImage extends Component {
  constructor(props) {
    super(props);
    this.state = { viewRef: null };
  }

  imageLoaded = () => {
    if (!this.props.entity.mature) return;
    this.setState({ viewRef: findNodeHandle(this.backgroundImage) });
  }

  imageError = (err) => {
    if (this.props.onError) {
      this.props.onError();
    }
  }

  render() {
    let image, ImageCmp, ImageProgressCmp, blur = 0, imageLoaded=this.imageLoaded;
    const disableProgress = this.props.disableProgress;

    if (Platform.OS === 'android' && this.props.entity.mature) {
      ImageCmp = Image;
      ImageProgressCmp = ProgressImage;
      imageLoaded = null;
      if (!this.props.entity.mature_visibility) blur=30;
    } else {
      ImageCmp = FastImage;
      ImageProgressCmp = ProgressFastImage;
    }

    if(disableProgress) {
      image = (
        <ImageCmp
          source={this.props.source}
          onLoadEnd={imageLoaded}
          onError={this.imageError}
          blurRadius={blur}
          ref={(img) => { this.backgroundImage = img; }} style={[styles.absolute, this.props.imageStyle]}
          />
        )
      } else {
        image = (
          <ImageProgressCmp
          indicator={ProgressCircle}
          threshold={150}
          source={this.props.source}
          onLoadEnd={imageLoaded}
          blurRadius={blur}
          onError={this.imageError}
          ref={(img) => { this.backgroundImage = img; }} style={[styles.absolute, this.props.imageStyle]}
        />
      )
    }

    return (
      <View style={{flex:1, justifyContent: 'center', alignItems: 'center'}}>
        {image}
        { (this.props.entity.mature) ?
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
