//@ts-nocheck
import React, { Component } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import ImageZoom from 'react-native-image-pan-zoom';
import { withSafeAreaInsets } from 'react-native-safe-area-context';
import SmartImage from './SmartImage';

/**
 * Image Viewer
 */
@withSafeAreaInsets
export default class ImageViewer extends Component {
  render() {
    const verticalOffset = this.props.insets.top + this.props.insets.bottom;
    return (
      <View style={styles.wrapper}>
        <ImageZoom
          enableSwipeDown={true}
          swipeDownThreshold={100}
          onSwipeDown={this.props.onSwipeDown}
          cropWidth={Dimensions.get('window').width}
          cropHeight={Dimensions.get('window').height - verticalOffset}
          imageWidth={this.props.width}
          imageHeight={this.props.height}>
          <SmartImage
            style={[
              styles.image,
              { height: this.props.height, width: this.props.width },
            ]}
            contentFit="stretch"
            source={this.props.source}
          />
        </ImageZoom>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    // overflow: 'hidden',
  },
  image: {
    backgroundColor: 'black',
  },
});
