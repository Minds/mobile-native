import React, { Component } from 'react';
import { observer } from 'mobx-react';

import { Alert, StyleProp, View, ViewStyle } from 'react-native';

import Clipboard from '@react-native-clipboard/clipboard';

import MindsVideo from '../../media/v2/mindsVideo/MindsVideo';
import download from '../services/download.service';
import logService from '../services/log.service';
import i18n from '../services/i18n.service';
import { showMessage } from 'react-native-flash-message';
import { DARK_THEME } from '../../styles/Colors';
import type ActivityModel from '../../newsfeed/ActivityModel';
import { MindsVideoStoreType } from '../../media/v2/mindsVideo/createMindsVideoStore';
import NavigationService from '../../navigation/NavigationService';
import EmbedLink from './media-view/EmbedLink';
import { ImageStyle } from 'react-native-fast-image';
import MediaViewImage from './media-view/MediaViewImage';
import openUrlService from '../services/open-url.service';
import ThemedStyles from '../../styles/ThemedStyles';
import CommentModel from '../../comments/v2/CommentModel';
import { showNotification } from '../../../AppMessages';

type PropsType = {
  entity: ActivityModel | CommentModel;
  navigation?: any;
  imageStyle?: StyleProp<ImageStyle>;
  containerStyle?: ViewStyle | Array<ViewStyle>;
  autoHeight?: boolean;
  onPress?: () => void;
  hideOverlay?: boolean;
  ignoreDataSaver?: boolean;
  smallEmbed?: boolean;
};

/**
 * Activity
 */
@observer
export default class MediaView extends Component<PropsType> {
  _currentThumbnail = 0;
  videoPlayer: MindsVideoStoreType | null = null;

  /**
   * Show activity media
   */
  showMedia() {
    let type = this.props.entity.custom_type || this.props.entity.subtype;
    if (
      !type &&
      this.props.entity.hasThumbnails() &&
      this.props.entity.type !== 'comment'
    ) {
      type = 'image';
    }
    switch (type) {
      case 'image':
      case 'batch':
        return (
          <MediaViewImage
            ignoreDataSaver={this.props.ignoreDataSaver}
            entity={this.props.entity}
            autoHeight={this.props.autoHeight}
            style={this.props.imageStyle}
            onImageDoublePress={this.navToZoomView}
            onImageLongPress={this.download}
            onImagePress={this.onImagePress}
          />
        );
      case 'video':
        const custom_data = this.props.entity.custom_data;
        let aspectRatio = 16 / 9;

        if (custom_data && custom_data.height && custom_data.height !== '0') {
          aspectRatio =
            parseInt(custom_data.width, 10) / parseInt(custom_data.height, 10);
        }

        return (
          <View style={[ThemedStyles.style.fullWidth, { aspectRatio }]}>
            <MindsVideo
              entity={this.props.entity}
              ignoreDataSaver={this.props.ignoreDataSaver}
              onStoreCreated={this.onStoreCreated}
              hideOverlay={this.props.hideOverlay}
            />
          </View>
        );
    }

    if (this.props.entity.perma_url) {
      return (
        <EmbedLink
          openLink={this.openLink}
          entity={this.props.entity}
          small={this.props.smallEmbed}
          onImageDoublePress={this.navToZoomView}
          onImageLongPress={this.download}
          onImagePress={this.onImagePress}
        />
      );
    }
    return null;
  }

  /**
   * Set video player's store reference
   */
  onStoreCreated = (store: MindsVideoStoreType) => (this.videoPlayer = store);

  /**
   * Prompt user to download
   */
  download = () => {
    const source = this.props.entity.getThumbSource('xlarge');
    if (!source || !source.uri) {
      return;
    }
    Alert.alert(
      i18n.t('downloadGallery'),
      i18n.t('wantToDownloadImage'),
      [
        { text: i18n.t('no'), style: 'cancel' },
        { text: i18n.t('yes'), onPress: () => this.runDownload(source) },
      ],
      { cancelable: false },
    );
  };

  /**
   * Download the media to the gallery
   */
  runDownload = async source => {
    try {
      await download.downloadToGallery(source.uri, this.props.entity);
      showNotification(i18n.t('imageAdded'), 'info', 3000, 'top');
    } catch (e) {
      showNotification(i18n.t('errorDownloading'), 'danger', 3000, 'top');
      logService.exception('[MediaView] runDownload', e);
    }
  };

  /**
   * Navigate to zoom view
   */
  navToZoomView = () => {
    NavigationService.navigate('ViewImage', {
      entity: this.props.entity,
      source: this.props.entity.getThumbSource('xlarge'),
    });
  };

  /**
   * Pause video if exist
   */
  pauseVideo() {
    if (this.videoPlayer) {
      this.videoPlayer.pause();
    }
  }

  /**
   * Play video if exist
   */
  playVideo(sound?: boolean) {
    if (this.videoPlayer) {
      this.videoPlayer.play(sound);
    }
  }

  /**
   * Toggle video sound on/off
   */
  toggleSound() {
    this.videoPlayer?.toggleVolume();
  }

  /**
   * Hide the video controls no matter if it is paused
   * @param forceHideOverlay
   */
  setForceHideOverlay(forceHideOverlay: boolean) {
    this.videoPlayer?.setForceHideOverlay(forceHideOverlay);
  }

  /**
   * Show or hide video controls
   * @param showOverlay
   */
  setShowOverlay(showOverlay: boolean) {
    this.videoPlayer?.setShowOverlay(showOverlay);
  }

  imageLongPress = () => {
    if (this.props.entity.perma_url) {
      setTimeout(async () => {
        if (this.props.entity.perma_url) {
          await Clipboard.setString(this.props.entity.perma_url);
          showMessage({
            floating: true,
            position: 'top',
            message: i18n.t('linkCopied'),
            duration: 1300,
            backgroundColor: '#FFDD63DD',
            color: DARK_THEME.PrimaryText,
            type: 'info',
          });
        }
      }, 100);
    } else {
      this.download();
    }
  };

  /**
   * On image load handler
   */
  onLoadImage = e => {
    if (this.props.autoHeight) {
      this.setState({
        height: e.nativeEvent.height,
        width: e.nativeEvent.width,
      });
    }
  };

  /**
   * Get image with autoheight or Touchable fixed height
   * @param {object} source
   * @param {object} thumbnail
   */

  /**
   * Render
   */
  render() {
    const media = this.showMedia();

    // dereference to force re render on change (mobx)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const paywall = this.props.entity.paywall;

    if (this.props.entity instanceof CommentModel) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const attachment = this.props.entity.attachment_guid;
    }

    if (!media) return null;

    return (
      <View style={this.props.containerStyle}>
        {media}
        {/* {!!this.props.entity.license && this.getLicense()} */}
      </View>
    );
  }

  // /**
  //  * License text with icon.
  //  * Does not check whether or not the license exists, that is left up to the implementation to decide.
  //  * @returns a license with icon for the given media
  //  */
  // getLicense() {
  //   const license = this.props.entity.license.replace(/-/g, ' ').toUpperCase();
  //   return (
  //     <View style={styles.licenseContainer}>
  //       <Icon
  //         style={[styles.licenseIcon, ThemedStyles.style.colorIcon]}
  //         name="public"
  //         raised={false}
  //         reverse={false}
  //         reverseColor="white"
  //         size={18}
  //         underlayColor="white"
  //       />
  //       <MText style={styles.licenseText}>{license}</MText>
  //     </View>
  //   );
  // }

  /**
   * Open a link
   */
  openLink = () => {
    openUrlService.open(this.props.entity.perma_url);
  };

  /**
   * On image press
   */
  onImagePress = () => {
    // if is a rich embed should load link
    if (this.props.entity.perma_url) {
      this.openLink();
    } else {
      if (this.props.onPress) {
        this.props.onPress();
      }
    }
  };
}

// const styles = StyleSheet.create({
//   licenseContainer: {
//     marginTop: 8,
//     display: 'flex',
//     flexDirection: 'row',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   licenseText: {
//     color: '#888',
//     fontWeight: 'bold',
//     fontFamily: 'Roboto',
//     fontSize: 10,
//   },
//   licenseIcon: {
//     paddingRight: 2,
//   },
// });
