//@ts-nocheck
import React, { PureComponent } from 'react';
import { StyleSheet, View, Image, Platform } from 'react-native';

import MindsVideo from '../media/MindsVideo';

/**
 * Capture preview
 */
export default class CapturePreview extends PureComponent {
  /**
   * Render
   */
  render() {
    let body = null;
    switch (this.props.type) {
      case 'image/gif':
      case 'image/jpeg':
      case 'image':
      default:
        body = (
          <Image
            resizeMode="contain"
            source={{uri: this.props.uri}}
            style={styles.preview}
          />
        );
        break;
      case 'video/mp4':
      case 'video/quicktime':
      case 'video/x-m4v':
      case 'video':
        body = (
          <View style={styles.preview}>
            <MindsVideo video={{uri: this.props.uri}} />
          </View>
        );
        break;
    }

    return <View style={styles.wrapper}>{body}</View>;
  }

}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
  },
});