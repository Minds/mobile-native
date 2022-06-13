//@ts-nocheck
import React, { Component } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import ImageZoom from 'react-native-image-pan-zoom';
import SmartImage from './SmartImage';

/**
 * Image Viewer
 */
export default class ImageViewer extends Component {
  render() {
    return (
      <View style={styles.wrapper}>
        <ImageZoom
          enableSwipeDown={true}
          swipeDownThreshold={100}
          onSwipeDown={this.props.onSwipeDown}
          cropWidth={Dimensions.get('window').width}
          cropHeight={Dimensions.get('window').height}
          imageWidth={this.props.width}
          imageHeight={this.props.height}>
          <SmartImage
            style={[
              styles.image,
              { height: this.props.height, width: this.props.width },
            ]}
            resizeMode="stretch"
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
