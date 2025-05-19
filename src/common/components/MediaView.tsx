import React, { Component } from 'react';
import { observer } from 'mobx-react';

import { Alert, ImageURISource, View, ViewStyle } from 'react-native';

import { ImageProps } from 'expo-image';

import MindsVideo from '../../media/v2/mindsVideo/MindsVideo';
import type ActivityModel from '../../newsfeed/ActivityModel';
import { MindsVideoStoreType } from '../../media/v2/mindsVideo/createMindsVideoStore';
import EmbedLink from './media-view/EmbedLink';
import MediaViewImage from './media-view/MediaViewImage';

import CommentModel from '../../comments/v2/CommentModel';
import { showNotification } from '../../../AppMessages';
import MediaViewMultiImage from './media-view/MediaViewMultiImage';
import { copyToClipboard } from '../helpers/copyToClipboard';
import sp from '~/services/serviceProvider';
import InlineAudioPlayer from '~/modules/audio-player/components/InlineAudioPlayer';
import { IS_TENANT } from '~/config/Config';
import Icon from '@expo/vector-icons/Ionicons';
import MText from './MText';
import moment from 'moment';

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
   * Hide the video player if the video is expired
   */
  get isVideoExpired(): boolean {
    if (IS_TENANT) {
      return false; // Tenants will not show the expired state
    }
    if (this.props.entity.ownerObj.plus) {
      return false; // Plus videos always available
    }

    const unixTx = Date.now() / 1000;
    const expiresSec = 86400 * 30;
    if (parseInt(this.props.entity.time_created) < unixTx - expiresSec) {
      return true; // Posts older than 30 days will show in this state
    }
    return false;
  }

  /**
   * If the user is not plus and their video is not yet expired, show a warning
   * if they own the post
   */
  get shouldShowVideoExpiringWarning(): boolean {
    if (IS_TENANT) {
      return false; // Tenants will not show the expiring notice
    }
    if (this.props.entity.owner_guid !== sp.session.guid) {
      return false; // Not the owner
    }
    if (this.props.entity.ownerObj.plus) {
      return false; // Don't show if plus
    }
    if (this.isVideoExpired) {
      return false; // Don't show if already expired
    }

    return true;
  }

  /**
   * The number of days before the video expires
   */
  get expiresInDays(): number {
    const now = moment();
    const expiresAt = moment(
      parseInt(this.props.entity.time_created) * 1000,
    ).add(31, 'days');
    return expiresAt.diff(now, 'days');
  }

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
        const theme = sp.styles.style;

        const deletedNoticeStyle = [
          theme.rowJustifyCenter,
          theme.gap2x,
          theme.margin4x,
          theme.padding4x,
          theme.borderRadius6x,
          theme.bgSecondaryBackground,
        ];

        if (this.isVideoExpired) {
          return (
            <View style={deletedNoticeStyle}>
              <Icon
                name="information-circle"
                size={35}
                style={[theme.colorSecondaryText, theme.paddingRight]}
              />
              <MText style={[theme.fontM, { flex: 1, alignSelf: 'center' }]}>
                This video is no longer available.
              </MText>
            </View>
          );
        }

        const custom_data = this.props.entity.custom_data;
        let aspectRatio = 16 / 9;

        if (custom_data && custom_data.height && custom_data.height !== '0') {
          aspectRatio =
            parseInt(custom_data.width, 10) / parseInt(custom_data.height, 10);
        }

        return (
          <View style={[sp.styles.style.fullWidth]}>
            <View style={[sp.styles.style.fullWidth, { aspectRatio }]}>
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
            {this.shouldShowVideoExpiringWarning ? (
              <View
                style={deletedNoticeStyle}
                onTouchEnd={e => {
                  e.stopPropagation();
                  sp.navigation.navigate('UpgradeScreen', {
                    onComplete: (success: any) => {},
                    pro: false,
                  });
                }}>
                <Icon
                  name="information-circle"
                  size={35}
                  style={[theme.colorSecondaryText, theme.paddingRight]}
                />
                <MText style={[theme.fontM, { flex: 1 }]}>
                  This video will be automatically deleted
                  {this.expiresInDays > 1
                    ? ` in ${this.expiresInDays} days. `
                    : ' today.'}
                  &nbsp;
                  <MText style={theme.link}>Upgrade to plus</MText> to keep your
                  videos forever.
                </MText>
              </View>
            ) : undefined}
          </View>
        );
      case 'audio':
        return (
          <View style={[sp.styles.style.fullWidth]}>
            <InlineAudioPlayer entity={this.props.entity} />
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
    const i18n = sp.i18n;
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
    const i18n = sp.i18n;
    try {
      await sp
        .resolve('download')
        .downloadToGallery(source.uri, this.props.entity);
      showNotification(i18n.t('imageAdded'), 'info', 3000);
    } catch (e) {
      showNotification(i18n.t('errorDownloading'), 'danger', 3000);
      sp.log.exception('[MediaView] runDownload', e);
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
  //         style={[styles.licenseIcon,  sp.styles.style.colorIcon]}
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
      sp.resolve('openURL').open(this.props.entity.perma_url);
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
    sp.navigation.navigate('ImageGallery', {
      entity: this.props.entity,
      initialIndex: index,
    });
  };
}
