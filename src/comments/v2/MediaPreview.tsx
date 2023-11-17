import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import React from 'react';
import {
  Dimensions,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import Icon from '@expo/vector-icons/Ionicons';
import { Flow } from 'react-native-animated-spinkit';

import type AttachmentStore from '../../common/stores/AttachmentStore';
import MindsVideo from '../../media/v2/mindsVideo/MindsVideo';
import ThemedStyles from '../../styles/ThemedStyles';

const width = Dimensions.get('window').width * 0.8;
const hitSlop = { top: 10, bottom: 10, left: 10, right: 10 };

/**
 * Media preview
 */
export default observer(function MediaPreview({
  attachment,
}: {
  attachment: AttachmentStore;
}) {
  if (!attachment.hasAttachment) return null;
  const theme = ThemedStyles.style;

  const src = {
    uri: toJS(attachment.uri),
  };

  const aspect = {
    aspectRatio:
      attachment.height && attachment.width
        ? attachment.width / attachment.height
        : 1,
  };

  let body: React.ReactNode | null = null;
  switch (attachment.type) {
    case 'image/gif':
    case 'image/jpeg':
    case 'image':
    default:
      body = (
        <Image
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

  return (
    <View style={[styles.wrapper, aspect]} pointerEvents="box-none">
      {body}
      {attachment.uploading && (
        <View style={[theme.centered, theme.positionAbsolute, styles.overlay]}>
          <Flow color="white" />
        </View>
      )}
      <TouchableOpacity
        style={styles.close}
        hitSlop={hitSlop}
        onPress={() => attachment.delete(true)}>
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
