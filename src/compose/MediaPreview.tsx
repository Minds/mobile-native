import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Foundation';
import ThemedStyles from '../styles/ThemedStyles';
import ImagePreview from './ImagePreview';
import MindsVideo from '../media/MindsVideo';
import * as Progress from 'react-native-progress';
import { useDimensions } from '@react-native-community/hooks';

type PropsType = {
  store: any;
  width: number;
  height: number;
};

type VideoSizeType = {
  width: number;
  height: number;
} | null;

export default function MediaPreview(props: PropsType) {
  const theme = ThemedStyles.style;

  const { width } = useDimensions().window;
  const [videoSize, setVideoSize] = useState<VideoSizeType>(null);

  if (!props.store.attachment.hasAttachment) {
    return null;
  }

  const isImage =
    props.store.mediaToConfirm &&
    props.store.mediaToConfirm.type.startsWith('image');

  let aspectRatio,
    videoHeight = 300;

  if (!isImage && (props.store.mediaToConfirm.width || videoSize)) {
    const vs = videoSize || props.store.mediaToConfirm;

    aspectRatio = vs.width / vs.height;
    videoHeight = Math.round(width / aspectRatio);
  }

  const previewStyle = {
    height: videoHeight,
    width: width,
  };

  return (
    <>
      {isImage ? (
        <View>
          {!props.store.isEdit && (
            <TouchableOpacity
              onPress={() =>
                props.store.attachment.cancelOrDelete(!props.store.isEdit)
              }
              style={[styles.removeMedia, theme.backgroundSecondary]}>
              <Icon
                name="trash"
                size={26}
                style={(styles.icon, theme.colorIcon)}
              />
            </TouchableOpacity>
          )}
          <ImagePreview image={props.store.mediaToConfirm} />
        </View>
      ) : (
        <View style={previewStyle}>
          <TouchableOpacity
            onPress={props.store.attachment.cancelOrDelete}
            style={[styles.removeMedia, theme.backgroundSecondary]}>
            <Icon
              name="trash"
              size={26}
              style={(styles.icon, theme.colorIcon)}
            />
          </TouchableOpacity>
          <MindsVideo
            video={props.store.mediaToConfirm}
            containerStyle={previewStyle}
            resizeMode="contain"
            onLoad={(e) => {
              if (
                e.naturalSize.orientation === 'portrait' &&
                Platform.OS === 'ios'
              ) {
                const w = e.naturalSize.width;
                e.naturalSize.width = e.naturalSize.height;
                e.naturalSize.height = w;
              }
              setVideoSize(e.naturalSize);
            }}
          />
        </View>
      )}
      {props.store.attachment.uploading && (
        <Progress.Bar
          progress={props.store.attachment.progress}
          width={props.width}
          color={ThemedStyles.getColor('green')}
          borderWidth={0}
          borderRadius={0}
          useNativeDriver={true}
        />
      )}
    </>
  );
}

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
