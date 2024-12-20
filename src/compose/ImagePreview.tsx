import React from 'react';
import { observer } from 'mobx-react';
import { Dimensions, useWindowDimensions } from 'react-native';
import ImageZoom from 'react-native-image-pan-zoom';
import { Image } from 'expo-image';

import SmartImage from '../common/components/SmartImage';
import sp from '~/services/serviceProvider';

/**
 * Image preview with max and min aspect ratio support
 * @param {Object} props
 */
export default observer(function (props) {
  let { width } = useWindowDimensions();

  // calculate the aspect ratio
  let aspectRatio = props.image.width / props.image.height;

  if (props.maxRatio && props.maxRatio < aspectRatio) {
    aspectRatio = props.maxRatio;
  }

  if (props.minRatio && props.minRatio > aspectRatio) {
    aspectRatio = props.minRatio;
  }

  let imageHeight = Math.round(width / aspectRatio);

  const imageStyle = props.fullscreen
    ? {
        height: '100%',
        width: '100%',
      }
    : null;

  // workaround: we use sourceURL for the preview on iOS because the image is not displayed with the uri
  const uri = props.image.uri || props.image.path;

  if (!props.zoom) {
    return (
      <Image
        key={props.image.key || 'imagePreview'}
        source={{
          uri: uri + (props.image.key ? `?${props.image.key}` : ''),
        }} // we need to change the uri in order to force the reload of the image
        style={[
          imageStyle,
          props.style,
          props.fullscreen
            ? sp.styles.style.bgBlack
            : sp.styles.style.bgTertiaryBackground,
        ]}
        contentFit={props.fullscreen ? 'cover' : 'contain'}
      />
    );
  } else {
    return (
      //@ts-ignore missing children definition in old package
      <ImageZoom
        cropWidth={Dimensions.get('window').width}
        cropHeight={Dimensions.get('window').height}
        imageWidth={Dimensions.get('window').width}
        imageHeight={imageHeight}>
        <SmartImage
          key={props.image.key || 'imagePreview'}
          source={{ uri: uri + `?${props.image.key}` }} // we need to change the uri in order to force the reload of the image
          style={[
            imageStyle,
            props.style,
            sp.styles.style.bgTertiaryBackground,
          ]}
          contentFit="contain"
        />
      </ImageZoom>
    );
  }
});
