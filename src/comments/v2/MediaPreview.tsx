import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import { Dimensions, StyleSheet, View, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import Icon from 'react-native-vector-icons/Ionicons';
import { DotIndicator } from 'react-native-reanimated-indicators';

import type AttachmentStore from '../../common/stores/AttachmentStore';
import MindsVideo from '../../media/v2/mindsVideo/MindsVideo';
import ThemedStyles from '../../styles/ThemedStyles';
import type CommentModel from './CommentModel';
import MediaView from '../../common/components/MediaView';

const width = Dimensions.get('window').width * 0.8;
const hitSlop = { top: 10, bottom: 10, left: 10, right: 10 };

/**
 * Media preview
 */
export default observer(function MediaPreview({
  attachment,
  edit,
}: {
  attachment: AttachmentStore;
  edit?: CommentModel;
}) {
  if (!attachment.hasAttachment && (!edit || !edit.hasAttachment)) {
    return null;
  }
  const theme = ThemedStyles.style;

  const content = attachment.hasAttachment ? attachment : edit!.custom_data[0];

  const defaultRatio =
    edit && edit.attachments?.custom_type === 'video' ? 16 / 9 : 1;

  const aspect = {
    aspectRatio:
      content && content.height && content.width
        ? content.width / content.height
        : defaultRatio,
  };

  const onDelete = () => attachment.delete(true, edit);

  let body: React.ReactNode | null = null;
  if (edit?.hasAttachment && !attachment.hasAttachment) {
    body = (
      <MediaView
        entity={edit}
        style={theme.borderRadius}
        smallEmbed
        containerStyle={[styles.preview, aspect]}
      />
    );
  } else {
    const src = {
      uri: toJS(attachment.uri),
    };
    switch (attachment.type) {
      case 'image/gif':
      case 'image/jpeg':
      case 'image':
      default:
        body = (
          <FastImage
            resizeMode="cover"
            source={src}
            style={[styles.preview, aspect]}
          />
        );
        break;
      case 'video/mp4':
      case 'video/quicktime':
      case 'video/x-m4v':
      case 'video':
        const MindsVideoComponent = <MindsVideo video={src} />;

        body = (
          <View style={[styles.preview, aspect]}>{MindsVideoComponent}</View>
        );
        break;
    }
  }
  return (
    <View style={[styles.wrapper, aspect]} pointerEvents="box-none">
      {body}
      {attachment.uploading && (
        <DotIndicator
          containerStyle={[
            theme.centered,
            theme.positionAbsolute,
            styles.overlay,
          ]}
          color="white"
          scaleEnabled={true}
        />
      )}
      <TouchableOpacity
        style={styles.close}
        hitSlop={hitSlop}
        onPress={onDelete}>
        <Icon name="close-circle-sharp" size={32} style={theme.colorWhite} />
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: '#00000090',
    borderRadius: 15,
  },
  close: {
    position: 'absolute',
    top: -15,
    right: -15,
  },
  wrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    marginHorizontal: 20,
    marginBottom: 15,
    maxHeight: 150,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 16,
    zIndex: 1000,
  },
  preview: {
    flex: 1,
    width,
    maxHeight: 150,
    borderRadius: 15,
  },
});
