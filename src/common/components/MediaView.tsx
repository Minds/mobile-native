import React, { Component } from 'react';
import { observer } from 'mobx-react';

import { Alert, ImageURISource, View, ViewStyle } from 'react-native';

import { ImageProps } from 'expo-image';

import MindsVideo from '../../media/v2/mindsVideo/MindsVideo';
import download from '../services/download.service';
import logService from '../services/log.service';
import i18n from '../services/i18n.service';
import type ActivityModel from '../../newsfeed/ActivityModel';
import { MindsVideoStoreType } from '../../media/v2/mindsVideo/createMindsVideoStore';
import NavigationService from '../../navigation/NavigationService';
import EmbedLink from './media-view/EmbedLink';
import MediaViewImage from './media-view/MediaViewImage';
import openUrlService from '../services/open-url.service';
import ThemedStyles from '../../styles/ThemedStyles';
import CommentModel from '../../comments/v2/CommentModel';
import { showNotification } from '../../../AppMessages';
import MediaViewMultiImage from './media-view/MediaViewMultiImage';
import { copyToClipboard } from '../helpers/copyToClipboard';

type PropsType = {
  entity: ActivityModel | CommentModel;
  navigation?: any;
  imageStyle?: ImageProps['style'];
  containerStyle?: ViewStyle | Array<ViewStyle>;
  autoHeight?: boolean;
  onPress?: () => void;
  hideOverlay?: boolean;
  ignoreDataSaver?: boolean;
  smallEmbed?: boolean;
  onVideoProgress?: (progress: number) => void;
  /**
   * overrides the onPress of the video overlay
   */
  onVideoOverlayPress?: () => void;
};

/**
 * Activity
 */
@observer
export default class MediaView extends Component<PropsType> {
  videoPlayer: MindsVideoStoreType | null = null;

  /**
   * Show activity media
   */
  showMedia() {
    let type = this.props.entity.custom_type || this.props.entity.subtype;
    if (
      !type &&
      ((this.props.entity.hasThumbnails() && !this.props.entity.perma_url) ||
        this.props.entity.hasSiteMembershipPaywallThumbnail) &&
      this.props.entity.type !== 'comment'
    ) {
      type = 'image';
    }
    switch (type) {
      case 'batch':
        if (
          this.props.entity.custom_data?.length > 1 &&
          !this.props.entity.hasSiteMembershipPaywallThumbnail
        ) {
          return (
            <MediaViewMultiImage
              entity={this.props.entity}
              ignoreDataSaver={this.props.ignoreDataSaver}
              onImageLongPress={this.download}
              fullWidth={!this.props.autoHeight}
              onImagePress={this.navToGallery}
            />
          );
        }
      // eslint-disable-next-line no-fallthrough
      case 'image':
        return (
          <MediaViewImage
            ignoreDataSaver={this.props.ignoreDataSaver}
            entity={this.props.entity}
            autoHeight={this.props.autoHeight}
            style={this.props.imageStyle}
            onImageDoublePress={this.navToGallery}
            onImageLongPress={() => this.download()}
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
              onProgress={this.props.onVideoProgress}
              onOverlayPress={this.props.onVideoOverlayPress}
              repeat={true}
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
          onImageLongPress={() => this.download()}
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
  download = (imageSource?: ImageURISource) => {
    const source = imageSource || this.props.entity.getThumbSource('xlarge');
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
      showNotification(i18n.t('imageAdded'), 'info', 3000);
    } catch (e) {
      showNotification(i18n.t('errorDownloading'), 'danger', 3000);
      logService.exception('[MediaView] runDownload', e);
    }
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
      setTimeout(() => copyToClipboard(this.props.entity.perma_url), 100);
    } else {
      this.download();
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
    this.props.entity.paywall;

    if (this.props.entity instanceof CommentModel) {
      // dereference to force re render on change (mobx)
      this.props.entity.attachment_guid;
    }

    if (!media) {
      return null;
    }

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
    if (this.props.entity.perma_url) {
      openUrlService.open(this.props.entity.perma_url);
    }
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

  /**
   * Opens ImageGalleryScreen to view the images with the given index being active
   * @param index - the index of image which was pressed
   */
  navToGallery = (index: number = 0) => {
    NavigationService.navigate('ImageGallery', {
      entity: this.props.entity,
      initialIndex: index,
    });
  };
}
