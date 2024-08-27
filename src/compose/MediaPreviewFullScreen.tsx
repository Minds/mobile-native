import { ResizeMode } from 'expo-av';
import { observer } from 'mobx-react';
import React, { useState } from 'react';
import { Platform, useWindowDimensions } from 'react-native';
import MindsVideo from '../media/v2/mindsVideo/MindsVideo';
import ImagePreview from './ImagePreview';

type PropsType = {
  mediaToConfirm: any;
  entity?: any;
};

type VideoSizeType = {
  width: number;
  height: number;
} | null;

/**
 * Previewing media in full screen. Used in camera screen
 */
export default observer(function MediaPreviewFullScreen({
  mediaToConfirm,
  entity,
}: PropsType) {
  const { width } = useWindowDimensions();
  const [videoSize, setVideoSize] = useState<VideoSizeType>(null);

  const onVideoLoaded = React.useCallback(e => {
    if (e.naturalSize.orientation === 'portrait' && Platform.OS === 'ios') {
      const w = e.naturalSize.width;
      e.naturalSize.width = e.naturalSize.height;
      e.naturalSize.height = w;
    }
    setVideoSize(e.naturalSize);
  }, []);

  const isImage = mediaToConfirm && mediaToConfirm.type.startsWith('image');

  let aspectRatio,
    videoHeight = 300;

  if (!isImage && (mediaToConfirm?.width || videoSize)) {
    const vs = videoSize || mediaToConfirm;

    aspectRatio = vs.width / vs.height;
    videoHeight = Math.round(width / aspectRatio);
  }

  const videoStyle = {
    height: videoHeight,
    width: width,
  };

  return (
    <>
      {isImage ? (
        <ImagePreview fullscreen image={mediaToConfirm} />
      ) : (
        <MindsVideo
          entity={entity}
          video={mediaToConfirm}
          containerStyle={videoStyle}
          resizeMode={ResizeMode.CONTAIN}
          autoplay
          onReadyForDisplay={onVideoLoaded}
        />
      )}
    </>
  );
});
