import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Foundation';
import * as Progress from 'react-native-progress';

import { useDimensions } from '@react-native-community/hooks';
import { observer } from 'mobx-react';
import ThemedStyles from '../styles/ThemedStyles';
import ImagePreview from './ImagePreview';
import MindsVideo from '../media/v2/mindsVideo/MindsVideo';
import { ResizeMode } from 'expo-av';

type PropsType = {
  store: any;
};

type VideoSizeType = {
  width: number;
  height: number;
} | null;

export default observer(function MediaPreview(props: PropsType) {
  const theme = ThemedStyles.style;

  const { width } = useDimensions().window;
  const [videoSize, setVideoSize] = useState<VideoSizeType>(null);

  const onVideoLoaded = React.useCallback(e => {
    if (e.naturalSize.orientation === 'portrait' && Platform.OS === 'ios') {
      const w = e.naturalSize.width;
      e.naturalSize.width = e.naturalSize.height;
      e.naturalSize.height = w;
    }
    setVideoSize(e.naturalSize);
  }, []);

  if (!props.store.attachment.hasAttachment) {
    return null;
  }

  const isImage =
    props.store.mediaToConfirm &&
    props.store.mediaToConfirm.type.startsWith('image');

  let aspectRatio;

  if (!isImage && (props.store.mediaToConfirm?.width || videoSize)) {
    const vs = videoSize || props.store.mediaToConfirm;
    aspectRatio = vs.width / vs.height;
  } else {
    if (
      props.store.mediaToConfirm?.width &&
      props.store.mediaToConfirm?.height
    ) {
      aspectRatio =
        props.store.mediaToConfirm?.width / props.store.mediaToConfirm?.height;
    } else {
      aspectRatio = 1;
    }
  }

  const previewStyle: any = {
    aspectRatio,
    borderRadius: 10,
    overflow: 'hidden',
  };

  return (
    <View style={previewStyle}>
      {isImage ? (
        <>
          {!props.store.isEdit && !props.store.portraitMode && (
            <TouchableOpacity
              testID="AttachmentDeleteButton"
              onPress={() =>
                props.store.attachment.cancelOrDelete(!props.store.isEdit)
              }
              style={[styles.removeMedia, theme.bgSecondaryBackground]}>
              <Icon
                name="trash"
                size={26}
                style={(styles.icon, theme.colorIcon)}
              />
            </TouchableOpacity>
          )}
          <ImagePreview image={props.store.mediaToConfirm} />
        </>
      ) : (
        <>
          {!props.store.isEdit && (
            <TouchableOpacity
              onPress={props.store.attachment.cancelOrDelete}
              style={[styles.removeMedia, theme.bgSecondaryBackground]}>
              <Icon
                name="trash"
                size={26}
                style={(styles.icon, theme.colorIcon)}
              />
            </TouchableOpacity>
          )}
          <MindsVideo
            entity={props.store.entity}
            video={props.store.mediaToConfirm}
            // @ts-ignore
            containerStyle={previewStyle}
            resizeMode={ResizeMode.CONTAIN}
            autoplay
            onReadyForDisplay={onVideoLoaded}
          />
        </>
      )}
      {props.store.attachment.uploading && (
        <Progress.Bar
          indeterminate={true}
          progress={props.store.attachment.progress}
          width={width}
          color={ThemedStyles.getColor('Green')}
          borderWidth={0}
          borderRadius={0}
          useNativeDriver={true}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
          }}
        />
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  icon: {
    color: '#FFFFFF',
  },
  removeMedia: {
    zIndex: 10000,
    position: 'absolute',
    top: 15,
    right: 15,
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 19,
    elevation: 2,
    shadowOffset: { width: 1, height: 1 },
    shadowColor: 'black',
    shadowOpacity: 0.65,
  },
});
