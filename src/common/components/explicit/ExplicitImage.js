import React, {
  Component
} from 'react';

import { observer } from 'mobx-react/native';

import {
  StyleSheet,
  findNodeHandle,
  Platform,
  Alert,
  Image,
  TouchableOpacity
} from 'react-native';

import FastImage from 'react-native-fast-image';
import { createImageProgress } from 'react-native-image-progress';
import ProgressCircle from 'react-native-progress/Circle';
import { Icon } from 'react-native-elements';

import ExplicitOverlay from './ExplicitOverlay';
import download from '../../services/download.service';

const ProgressFastImage = createImageProgress(FastImage);
const ProgressImage = createImageProgress(Image);

@observer
export default class ExplicitImage extends Component {
  constructor(props) {
    super(props);
    this.state = { viewRef: null };
  }

  imageLoaded = () => {
    if (this.props.onLoadEnd) {
      this.props.onLoadEnd();
    }

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
      <TouchableOpacity style={{flex:1, justifyContent: 'center', alignItems: 'center'}} onLongPress={this.download} activeOpacity={0.8}>
        {image}
        { (this.props.entity.mature) ?
          <ExplicitOverlay
            entity={this.props.entity}
            viewRef={this.state.viewRef}
            style={styles.absolute}
          /> : null
        }
      </TouchableOpacity>
    );
  }

  /**
   * Prompt user to download
   */
  download = () => {
    Alert.alert(
      'Download to galley',
      `Do you want to download this image?`,
      [
        { text: 'No', style: 'cancel' },
        { text: 'Yes', onPress: () => this.runDownload() },
      ],
      { cancelable: false }
    );
  }

  /**
   * Download the media to the gallery
   */
  runDownload = async () => {
    try {
      const result = await download.downloadToGallery(this.props.source.uri);
      Alert.alert('Success', 'Image added to gallery!');
    } catch (e) {
      Alert.alert('Error downloading file');
      console.log(e);
    }
  }
}

const styles = StyleSheet.create({
  absolute: {
    position: "absolute",
    backgroundColor: 'black',
    top: 0, left: 0, bottom: 0, right: 0,
  },
});
