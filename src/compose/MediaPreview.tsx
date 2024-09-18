import React from 'react';
import { View, TouchableOpacity, useWindowDimensions } from 'react-native';
import Icon from '@expo/vector-icons/Ionicons';
import * as Progress from 'react-native-progress';
import { Image } from 'expo-image';

import { observer } from 'mobx-react';

import MindsVideo from '../media/v2/mindsVideo/MindsVideo';
import { ResizeMode } from 'expo-av';
import sp from '~/services/serviceProvider';

type PropsType = {
  store: any;
};

/**
 * Media Preview component with support for up to 4 images/videos
 */
export default observer(function MediaPreview({ store }: PropsType) {
  const { width, height } = useWindowDimensions();

  if (!store.attachments.hasAttachment) {
    return null;
  }

  const theme = sp.styles.style;

  switch (store.attachments.length) {
    case 1:
      const attachment = store.attachments.get(0);
      let aspectRatio = attachment.width / attachment.height;
      /**
       * Image's min aspect ratio (max height)
       * Same value as the post image's MIN_ASPECT_RATIO_FIXED
       */
      const minAspectRatio = width / height;

      if (!aspectRatio || aspectRatio < minAspectRatio) {
        aspectRatio = minAspectRatio;
      }

      return (
        <View
          style={[
            styles.preview,
            theme.marginTop2x,
            theme.bgAction,
            theme.fullWidth,
            {
              aspectRatio,
            },
          ]}>
          <MediaPresentation
            attachment={store.attachments.get(0)}
            onDelete={store.attachments.removeMedia}
            isEdit={store.isEdit}
            portraitMode={store.portraitMode}
            entity={store.entity}
          />
        </View>
      );
    case 2:
      return (
        <View style={[theme.rowJustifyStart, theme.marginTop2x]}>
          <View style={[styles.twoPreviews, theme.paddingRightXS]}>
            <MediaPresentation
              attachment={store.attachments.get(0)}
              onDelete={store.attachments.removeMedia}
              isEdit={store.isEdit}
              portraitMode={store.portraitMode}
              entity={store.entity}
            />
          </View>
          <View style={[styles.twoPreviews, theme.paddingLeftXS]}>
            <MediaPresentation
              attachment={store.attachments.get(1)}
              onDelete={store.attachments.removeMedia}
              isEdit={store.isEdit}
              portraitMode={store.portraitMode}
              entity={store.entity}
            />
          </View>
        </View>
      );
    case 3:
      return (
        <View style={[theme.rowJustifySpaceEvenly, theme.marginTop2x]}>
          <View style={[styles.twoPreviews, theme.marginRightXS]}>
            <MediaPresentation
              attachment={store.attachments.get(0)}
              onDelete={store.attachments.removeMedia}
              isEdit={store.isEdit}
              portraitMode={store.portraitMode}
              entity={store.entity}
            />
          </View>
          <View style={[theme.flexContainer, theme.marginLeftXS]}>
            <View style={[styles.singlePreview, theme.marginBottomXS]}>
              <MediaPresentation
                attachment={store.attachments.get(1)}
                onDelete={store.attachments.removeMedia}
                isEdit={store.isEdit}
                portraitMode={store.portraitMode}
                entity={store.entity}
              />
            </View>
            <View style={[styles.singlePreview, theme.marginTopXS]}>
              <MediaPresentation
                attachment={store.attachments.get(2)}
                onDelete={store.attachments.removeMedia}
                isEdit={store.isEdit}
                portraitMode={store.portraitMode}
                entity={store.entity}
              />
            </View>
          </View>
        </View>
      );
    case 4:
      return (
        <View style={[theme.rowJustifyStart, theme.marginTop2x]}>
          <View style={theme.flexContainer}>
            <View style={[styles.singlePreview, theme.marginBottomXS]}>
              <MediaPresentation
                attachment={store.attachments.get(0)}
                onDelete={store.attachments.removeMedia}
                isEdit={store.isEdit}
                portraitMode={store.portraitMode}
                entity={store.entity}
              />
            </View>
            <View style={[styles.singlePreview, theme.marginTopXS]}>
              <MediaPresentation
                attachment={store.attachments.get(1)}
                onDelete={store.attachments.removeMedia}
                isEdit={store.isEdit}
                portraitMode={store.portraitMode}
                entity={store.entity}
              />
            </View>
          </View>
          <View style={theme.flexContainer}>
            <View style={[styles.singlePreview, theme.marginBottomXS]}>
              <MediaPresentation
                attachment={store.attachments.get(2)}
                onDelete={store.attachments.removeMedia}
                isEdit={store.isEdit}
                portraitMode={store.portraitMode}
                entity={store.entity}
              />
            </View>
            <View style={[styles.singlePreview, theme.marginTopXS]}>
              <MediaPresentation
                attachment={store.attachments.get(3)}
                onDelete={store.attachments.removeMedia}
                isEdit={store.isEdit}
                portraitMode={store.portraitMode}
                entity={store.entity}
              />
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
const MediaPresentation = observer(
  ({ attachment, onDelete, isEdit, portraitMode, entity }) => {
    const isImage = attachment.type.startsWith('image');

    const mediaSource = React.useMemo(() => {
      return {
        uri: attachment.uri,
      };
    }, [attachment.uri]);

    if (!mediaSource.uri) {
      return null;
    }

    return isImage ? (
      <View style={styles.image}>
        {!isEdit && !portraitMode && (
          <TouchableOpacity
            testID="AttachmentDeleteButton"
            onPress={() => onDelete(attachment)}
            style={styles.removeMedia}>
            <Icon name="close-outline" size={26} style={styles.icon} />
          </TouchableOpacity>
        )}
        <Image source={mediaSource} style={styles.image} contentFit="cover" />
        {attachment.uploading && (
          <Progress.Bar
            indeterminate={true}
            progress={attachment.progress}
            color={sp.styles.getColor('Green')}
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
        {!isEdit && (
          <TouchableOpacity
            onPress={() => onDelete(attachment)}
            style={styles.removeMedia}>
            <Icon name="close-outline" size={26} style={styles.icon} />
          </TouchableOpacity>
        )}
        <MindsVideo
          entity={entity}
          video={mediaSource}
          resizeMode={ResizeMode.CONTAIN}
          autoplay
          repeat
        />
        {attachment.uploading && (
          <Progress.Bar
            indeterminate={true}
            progress={attachment.progress}
            color={sp.styles.getColor('Green')}
            width={null}
            borderWidth={0}
            borderRadius={0}
            useNativeDriver={true}
            style={styles.progress}
          />
        )}
      </>
    );
  },
);

const styles = sp.styles.create({
  icon: ['colorIcon'],
  progress: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 5,
  },
  preview: {
    flex: 1,
    borderRadius: 2,
    shadowColor: 'black',
    shadowOffset: {
      width: 0,
      height: 1.5,
    },
    shadowOpacity: 0.4,
    shadowRadius: 0.41,

    elevation: 2,
  },
  image: ['bgTertiaryBackground', 'flexContainer', 'borderRadius2x'],
  get singlePreview() {
    return [
      this.preview,
      {
        aspectRatio: 3 / 2,
      },
    ];
  },
  get twoPreviews() {
    return [
      this.preview,
      {
        aspectRatio: 3 / 4,
      },
    ];
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
