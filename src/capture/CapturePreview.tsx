import React, { PureComponent } from 'react';
import { StyleSheet, View, Image } from 'react-native';

import MindsVideo from '../media/MindsVideo';
import MindsVideoV2 from '../media/v2/mindsVideo/MindsVideo';

import featuresService from '../common/services/features.service';

type PropsType = {
  uri: string;
  type: string;
};

/**
 * Capture preview
 */
export default class CapturePreview extends PureComponent<PropsType> {
  /**
   * Render
   */
  render() {
    let body: React.ReactNode | null = null;
    switch (this.props.type) {
      case 'image/gif':
      case 'image/jpeg':
      case 'image':
      default:
        body = (
          <Image
            resizeMode="contain"
            source={{ uri: this.props.uri }}
            style={styles.preview}
          />
        );
        break;
      case 'video/mp4':
      case 'video/quicktime':
      case 'video/x-m4v':
      case 'video':
        const MindsVideoComponent = featuresService.has('mindsVideo-2020') ? (
          <MindsVideoV2 video={{ uri: this.props.uri }} />
        ) : (
          <MindsVideo video={{ uri: this.props.uri }} />
        );

        body = <View style={styles.preview}>{MindsVideoComponent}</View>;
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
