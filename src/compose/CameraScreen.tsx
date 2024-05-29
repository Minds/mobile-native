import React, { useCallback, useEffect, useState } from 'react';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import { showNotification } from 'AppMessages';
import { runInAction } from 'mobx';
import { observer } from 'mobx-react';
import { Image, InteractionManager, StatusBar, View } from 'react-native';
import changeNavigationBarColor from 'react-native-navigation-bar-color';
import RNPhotoEditor from 'react-native-photo-editor';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import ActivityIndicator from '~/common/components/ActivityIndicator';
import Button from '~/common/components/Button';
import MText from '~/common/components/MText';
import useIsPortrait from '~/common/hooks/useIsPortrait';
import attachmentService from '~/common/services/attachment.service';
import downloadService from '~/common/services/download.service';
import i18nService from '~/common/services/i18n.service';
import logService from '~/common/services/log.service';
import { IconButtonNext } from '~/common/ui/icons';
import NavigationService from '~/navigation/NavigationService';
import FloatingBackButton from '../common/components/FloatingBackButton';
import i18n from '../common/services/i18n.service';
import ThemedStyles, { useMemoStyle, useStyle } from '../styles/ThemedStyles';
import Camera from './Camera/Camera';
import PermissionsCheck from './PermissionsCheck';
import ImageFilterSlider from './ImageFilterSlider/ImageFilterSlider';
import MediaPreviewFullScreen from './MediaPreviewFullScreen';
import { useBackHandler } from '@react-native-community/hooks';
import { Orientation } from '~/services';
import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';
import PermissionsService from '~/common/services/permissions.service';
import { IS_IOS } from '~/config/Config';

// TODO: move this and all its instances accross the app to somewhere common
/**
 * Display an error message to the user.
 * @param {string} message
 */
const showError = message => {
  showNotification(message, 'danger', 3000);
};

/**
 * Camera Screen
 * @param {Object} props
 */
export default withErrorBoundaryScreen(
  observer(function (props) {
    // #region states & variables
    const {
      portrait: portraitMode,
      mode: allowedMode,
      onMediaConfirmed,
    } = props.route?.params ?? {};
    const [mode, setMode] = useState<'photo' | 'video'>(
      allowedMode === 'video' ? 'video' : 'photo',
    );
    const [mediaToConfirm, setMediaToConfirm] = useState<any>(null);

    /**
     * the current selected filter
     */
    const [filter, setFilter] = useState<any>(null);
    const [extractEnabled, setExtractEnabled] = useState<boolean>(false);
    /**
     * whether the image is being downloaded to camera roll
     */
    const [downloading, setDownloading] = useState(false);
    const portrait = useIsPortrait();
    const theme = ThemedStyles.style;
    // #endregion

    // #region methods
    /**
     * reset the state
     */
    const reset = useCallback(() => {
      setFilter(null);
      setDownloading(false);
      setMediaToConfirm(null);
      setExtractEnabled(false);
    }, []);
    /**
     * sets mode to photo
     */
    const setModePhoto = useCallback(() => setMode('photo'), []);

    /**
     * sets mode to video
     */
    const setModeVideo = useCallback(() => {
      if (!PermissionsService.canUploadVideo()) {
        showNotification(i18n.t('composer.create.mediaVideoError'));
        return;
      }
      setMode('video');
    }, []);

    useEffect(() => {
      !IS_IOS && Orientation.unlock();
      return () => {
        Orientation.lockPortrait();
      };
    }, []);

    useEffect(() => {
      if (mediaToConfirm) {
        Orientation.lockPortrait();
      } else {
        !IS_IOS && Orientation.unlock();
      }
    }, [mediaToConfirm]);

    /**
     * handles the confirm action
     */
    const handleConfirm = useCallback(
      (extractedImage?: any) => {
        if (!mediaToConfirm) {
          return;
        }

        if (filter && !extractedImage) {
          // TODO loading please (extracting) and explain
          return setExtractEnabled(true);
        }

        if (mediaToConfirm.type && mediaToConfirm.type.startsWith('video')) {
          CameraRoll.save(mediaToConfirm.uri, {
            album: 'Minds',
            type: 'video',
          }).catch(error =>
            console.log('[Composer] Error saving video to gallery', error),
          );
        }

        if (onMediaConfirmed) {
          // if the media confirmed was handled, use the handler)
          onMediaConfirmed(extractedImage || mediaToConfirm);
        }

        NavigationService.navigate('Compose', {
          media: extractedImage || mediaToConfirm,
          portrait: portraitMode,
        });

        InteractionManager.runAfterInteractions(reset);
      },
      [filter, mediaToConfirm, onMediaConfirmed, reset, portraitMode],
    );

    /**
     * called after gallery selection is completed. Handles gallery selection
     */
    const handleGallerySelection = useCallback(async () => {
      const media = await attachmentService.gallery(
        mode === 'photo' ? 'Images' : 'Videos',
        false,
      );

      if (!media) {
        return;
      }

      // we don't support multiple media yet
      if (Array.isArray(media)) {
        return;
      }

      if (portraitMode && media.height < media.width) {
        showError(i18n.t('capture.mediaPortraitError'));
        return;
      }

      setMediaToConfirm(media);
    }, [mode, portraitMode]);

    /**
     * called when edit icon is pressed. opens the rnPhotoEditor and handles callback
     */
    const onEdit = useCallback(() => {
      try {
        setMediaToConfirm(null);
        RNPhotoEditor.Edit({
          path: mediaToConfirm.uri.replace('file://', ''),
          stickers: ['sticker6', 'sticker9'],
          hiddenControls: ['save', 'share'],
          onDone: () => {
            // reset the filter as a workaround because we will have to rerender the filter slider.
            // but ideally we should keep the filter and scroll to that filter slide
            setFilter(null);

            Image.getSize(
              mediaToConfirm.uri,
              (w, h) => {
                runInAction(() => {
                  mediaToConfirm.key++;
                  mediaToConfirm.width = w;
                  mediaToConfirm.height = h;

                  setMediaToConfirm(mediaToConfirm);
                });
              },
              err => console.log(err),
            );
          },
        });
      } catch (err) {
        logService.exception(err);
      }
    }, [mediaToConfirm]);

    /**
     * Download the media to the gallery
     */
    const runDownload = useCallback(async () => {
      try {
        setDownloading(true);
        await downloadService.downloadToGallery(
          mediaToConfirm.uri,
          undefined,
          `minds/${Date.now()}`, // is this good?
        );
        showNotification(i18n.t('imageAdded'), 'info', 3000);
      } catch (e: any) {
        showNotification(i18n.t('errorDownloading'), 'danger', 3000);
        logService.exception('[MediaView] runDownload', e);
      }
      setDownloading(false);
    }, [mediaToConfirm]);

    /**
     * called when retake button is pressed. Resets current image to null
     */
    const retake = useCallback(() => {
      setMediaToConfirm(null);
    }, []);

    /**
     * Android back button handler
     */
    useBackHandler(() => {
      mediaToConfirm ? retake() : props.navigation.goBack();
      return true;
    });

    /**
     * called when the camera captures something
     */
    const handleCameraCapture = useCallback(media => {
      media.key = 1;
      if (media.metadata && media.metadata.Orientation === 6) {
        const h = media.height;
        media.height = media.width;
        media.width = h;
      }
      // we try to reduce the size of the image
      attachmentService
        .processMedia(media)
        .then(processedMedia => {
          setMediaToConfirm(processedMedia);
        })
        .catch(err => {
          console.log(err);
          setMediaToConfirm(media);
        });
    }, []);
    // #endregion

    // #region effects
    /**
     * handles changing the navbar color. sets it dark on mount and to default on unmount
     */
    useEffect(() => {
      changeNavigationBarColor('#000000', false, false);

      return () => {
        return changeNavigationBarColor(
          ThemedStyles.style.bgSecondaryBackground.backgroundColor,
          !ThemedStyles.theme,
          true,
        );
      };
    }, []);
    // #endregion

    // #region renders
    let bottomBar;

    if (mediaToConfirm) {
      bottomBar = (
        <BottomBarMediaConfirm
          mode={mode}
          onRetake={retake}
          onConfirm={() => handleConfirm()}
          extracting={extractEnabled}
        />
      );
    } else if (portrait && !allowedMode) {
      bottomBar = (
        <CameraScreenBottomBar
          onSetPhotoPress={setModePhoto}
          onSetVideoPress={setModeVideo}
          mode={mode}
        />
      );
    }
    // #endregion

    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#000" barStyle="light-content" />

        <PermissionsCheck>
          <View style={styles.cameraContainer}>
            <Camera
              onMedia={handleCameraCapture}
              mode={mode}
              onForceVideo={setModeVideo}
              onPressGallery={handleGallerySelection}
              portraitMode={portraitMode}
              disabled={Boolean(mediaToConfirm)}
            />

            {Boolean(mediaToConfirm) && (
              <View style={styles.filterContainer}>
                {mode === 'photo' ? (
                  <View style={theme.flexContainer}>
                    <ImageFilterSlider
                      image={mediaToConfirm}
                      extractEnabled={extractEnabled}
                      onExtractImage={handleConfirm}
                      onFilterChange={setFilter}
                    />

                    <SafeAreaView style={styles.topToolbarContainer}>
                      <DownloadIconButton
                        downloading={downloading}
                        onDownload={runDownload}
                      />
                      <EditIconButton onPress={onEdit} />
                    </SafeAreaView>
                  </View>
                ) : (
                  <MediaPreviewFullScreen mediaToConfirm={mediaToConfirm} />
                )}
              </View>
            )}
          </View>

          {bottomBar}
          <FloatingBackButton
            size="huge"
            icon="close"
            onPress={mediaToConfirm ? retake : props.navigation.goBack}
            light
            shadow
            style={theme.padding3x}
          />
        </PermissionsCheck>
      </View>
    );
  }),
  'CameraScreen',
);

const TabButton = ({ onPress, active, children }) => {
  const theme = ThemedStyles.style;
  const textStyle = useMemoStyle(
    [
      'fontXL',
      'flexContainer',
      'textCenter',
      styles.tabText,
      active ? theme.colorLink : null,
    ],
    [active, theme.colorLink],
  );

  return (
    <MText style={textStyle} onPress={onPress}>
      {children}
    </MText>
  );
};

const useBottomBarStyle = () => {
  const insets = useSafeAreaInsets();
  return useStyle(styles.tabContainer, 'paddingVertical2x', {
    paddingBottom: insets.bottom || 16,
    backgroundColor: '#000',
  });
};

const CameraScreenBottomBar = ({ mode, onSetPhotoPress, onSetVideoPress }) => {
  const containerStyle = useBottomBarStyle();

  return (
    <View style={containerStyle}>
      <View style={styles.tabs}>
        <TabButton onPress={onSetPhotoPress} active={mode === 'photo'}>
          {i18nService.t('capture.photo').toUpperCase()}
        </TabButton>

        <TabButton onPress={onSetVideoPress} active={mode === 'video'}>
          {i18nService.t('capture.video').toUpperCase()}
        </TabButton>
      </View>
    </View>
  );
};

const BottomBarMediaConfirm = ({ mode, onRetake, onConfirm, extracting }) => {
  const theme = ThemedStyles.style;
  const containerStyle = useBottomBarStyle();

  return (
    <View style={containerStyle}>
      <View style={styles.tabs}>
        <Button onPress={onRetake} text={'Retake'} transparent small />
        <Button
          onPress={onConfirm}
          text={
            mode === 'photo'
              ? i18nService.t('capture.usePhoto')
              : i18nService.t('capture.useVideo')
          }
          small
          action
          containerStyle={theme.bgLink}
          textColor={ThemedStyles.getColor('White')}
          loading={extracting}
        />
      </View>
    </View>
  );
};

const DownloadIconButton = ({ downloading, onDownload }) => {
  return (
    <>
      {downloading ? (
        <View style={ThemedStyles.style.paddingRight7x}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      ) : (
        <IconButtonNext
          name="download"
          size="large"
          onPress={onDownload}
          right="XXXL"
          light
          shadow
        />
      )}
    </>
  );
};

const EditIconButton = ({ onPress }) => (
  <IconButtonNext name="edit" size="large" onPress={onPress} light shadow />
);

const styles = ThemedStyles.create({
  container: [
    'flexContainer',
    { backgroundColor: '#000', height: '100%', width: '100%' },
  ],
  filterContainer: ['bgBlack', 'positionAbsolute'],
  tabContainer: {
    width: '100%',
    paddingHorizontal: 50,
  },
  tabText: {
    fontWeight: '400',
    color: '#fff',
    paddingVertical: 8,
    flex: 1,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cameraContainer: ['flexContainer', { borderRadius: 20, overflow: 'hidden' }],
  topToolbarContainer: [
    'positionAbsoluteTopRight',
    'rowJustifyEnd',
    'padding5x',
  ],
});
