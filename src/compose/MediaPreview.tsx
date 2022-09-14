import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Progress from 'react-native-progress';

import { observer } from 'mobx-react';
import ThemedStyles from '../styles/ThemedStyles';
import MindsVideo from '../media/v2/mindsVideo/MindsVideo';
import { ResizeMode } from 'expo-av';
import FastImage from 'react-native-fast-image';

type PropsType = {
  store: any;
};

/**
 * Media Preview component with support for up to 4 images/videos
 */
export default observer(function MediaPreview({ store }: PropsType) {
  if (!store.attachments.hasAttachment) {
    return null;
  }

  const theme = ThemedStyles.style;

  switch (store.attachments.length) {
    case 1:
      return (
        <View style={[styles.singlePreview, theme.marginTop2x]}>
          <MediaPresentation store={store} index={0} />
        </View>
      );
    case 2:
      return (
        <View style={[theme.rowJustifyStart, theme.marginTop2x]}>
          <View style={[styles.twoPreviews, theme.paddingRightXS]}>
            <MediaPresentation store={store} index={0} />
          </View>
          <View style={[styles.twoPreviews, theme.paddingLeftXS]}>
            <MediaPresentation store={store} index={1} />
          </View>
        </View>
      );
    case 3:
      return (
        <View style={[theme.rowJustifySpaceEvenly, theme.marginTop2x]}>
          <View style={[styles.twoPreviews, theme.marginRightXS]}>
            <MediaPresentation store={store} index={0} />
          </View>
          <View style={[theme.flexContainer, theme.marginLeftXS]}>
            <View style={[styles.singlePreview, theme.marginBottomXS]}>
              <MediaPresentation store={store} index={1} />
            </View>
            <View style={[styles.singlePreview, theme.marginTopXS]}>
              <MediaPresentation store={store} index={2} />
            </View>
          </View>
        </View>
      );
    case 4:
      return (
        <View style={[theme.rowJustifyStart, theme.marginTop2x]}>
          <View style={theme.flexContainer}>
            <View style={[styles.singlePreview, theme.marginBottomXS]}>
              <MediaPresentation store={store} index={0} />
            </View>
            <View style={[styles.singlePreview, theme.marginTopXS]}>
              <MediaPresentation store={store} index={1} />
            </View>
          </View>
          <View style={theme.flexContainer}>
            <View style={[styles.singlePreview, theme.marginBottomXS]}>
              <MediaPresentation store={store} index={2} />
            </View>
            <View style={[styles.singlePreview, theme.marginTopXS]}>
              <MediaPresentation store={store} index={3} />
            </View>
          </View>
        </View>
      );
  }

  return null;
});

/**
 * Media Presentation Component
 */
const MediaPresentation = observer(({ store, index }) => {
  const attachment = store.attachments.attachments[index];

  if (!attachment) {
    return null;
  }

  const isImage = attachment.type.startsWith('image');

  const imageSource = React.useMemo(() => {
    return { uri: attachment.uri };
  }, [attachment.uri]);

  return isImage ? (
    <View style={styles.image}>
      {!store.isEdit && !store.portraitMode && (
        <TouchableOpacity
          testID="AttachmentDeleteButton"
          onPress={() => store.attachments.removeMedia(attachment)}
          style={styles.removeMedia}>
          <Icon name="close-outline" size={26} style={styles.icon} />
        </TouchableOpacity>
      )}
      <FastImage
        source={imageSource}
        style={styles.image}
        resizeMode={FastImage.resizeMode.cover}
      />
      {attachment.uploading && (
        <Progress.Bar
          indeterminate={true}
          progress={attachment.progress}
          color={ThemedStyles.getColor('Green')}
          width={null}
          borderWidth={0}
          borderRadius={0}
          useNativeDriver={true}
          style={styles.progress}
        />
      )}
    </View>
  ) : (
    <>
      {!store.isEdit && (
        <TouchableOpacity
          onPress={() => store.attachments.removeMedia(attachment)}
          style={styles.removeMedia}>
          <Icon name="close-outline" size={26} style={styles.icon} />
        </TouchableOpacity>
      )}
      <MindsVideo
        entity={store.entity}
        video={attachment}
        resizeMode={ResizeMode.CONTAIN}
        autoplay
      />
      {attachment.uploading && (
        <Progress.Bar
          indeterminate={true}
          progress={attachment.progress}
          color={ThemedStyles.getColor('Green')}
          width={null}
          borderWidth={0}
          borderRadius={0}
          useNativeDriver={true}
          style={styles.progress}
        />
      )}
    </>
  );
});

const styles = ThemedStyles.create({
  icon: ['colorIcon'],
  progress: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 5,
  },
  singlePreview: {
    flex: 1,
    aspectRatio: 3 / 2,
    borderRadius: 2,
    overflow: 'hidden',
  },
  image: ['bgTertiaryBackground', 'flexContainer'],
  twoPreviews: {
    flex: 1,
    aspectRatio: 3 / 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  removeMedia: [
    'bgSecondaryBackground',
    {
      zIndex: 10000,
      position: 'absolute',
      top: 12,
      right: 12,
      width: 35,
      height: 35,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 19,
      elevation: 2,
      shadowOffset: { width: 1, height: 1 },
      shadowColor: 'black',
      shadowOpacity: 0.65,
    },
  ],
});
