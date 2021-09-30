import React from 'react';
import { observer } from 'mobx-react';
import FastImage from 'react-native-fast-image';
import { Platform, Dimensions } from 'react-native';
import SmartImage from '../../src/common/components/SmartImage';
import ThemedStyles from '../styles/ThemedStyles';
import ImageZoom from 'react-native-image-pan-zoom';
import { useDimensions } from '@react-native-community/hooks';

/**
 * Image preview with max and min aspect ratio support
 * @param {Object} props
 */
export default observer(function (props) {
  const { width } = useDimensions().window;
  // calculate the aspect ratio
  let aspectRatio =
    props.image.pictureOrientation > 2 || !props.image.pictureOrientation
      ? props.image.height / props.image.width
      : props.image.width / props.image.height;

  if (props.maxRatio && props.maxRatio < aspectRatio) {
    aspectRatio = props.maxRatio;
  }

  if (props.minRatio && props.minRatio > aspectRatio) {
    aspectRatio = props.minRatio;
  }

  let imageHeight = Math.round(width / aspectRatio);

  const imageStyle = {
    height: imageHeight,
    width: '100%',
  };

  // workaround: we use sourceURL for the preview on iOS because the image is not displayed with the uri
  const uri = props.image.sourceURL || props.image.uri || props.image.path;

  const source = React.useMemo(() => ({ uri }), [uri]);

  if (!props.zoom) {
    return (
      <SmartImage
        key={props.image.key || 'imagePreview'}
        source={{ uri: uri + `?${props.image.key}` }} // we need to change the uri in order to force the reload of the image
        style={[
          imageStyle,
          props.style,
          ThemedStyles.style.bgTertiaryBackground,
        ]}
        resizeMode={FastImage.resizeMode.contain}
      />
    );
  } else {
    return (
      <ImageZoom
        cropWidth={Dimensions.get('window').width}
        cropHeight={Dimensions.get('window').height}
        imageWidth={Dimensions.get('window').width}
        imageHeight={imageHeight}
      >
        <SmartImage
          key={props.image.key || 'imagePreview'}
          source={{ uri: uri + `?${props.image.key}` }} // we need to change the uri in order to force the reload of the image
          style={[
            imageStyle,
            props.style,
            ThemedStyles.style.bgTertiaryBackground,
          ]}
          resizeMode={FastImage.resizeMode.contain}
        />
      </ImageZoom>
    );
  }
});
