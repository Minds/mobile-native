//@ts-nocheck
import { observer } from 'mobx-react';
import React, { Component } from 'react';

import {
  Alert,
  Clipboard,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { showMessage } from 'react-native-flash-message';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { SharedElement } from 'react-navigation-shared-element';
import type ActivityModel from 'src/newsfeed/ActivityModel';
import MindsVideo from '../../media/MindsVideo';
import { MindsVideoStoreType } from '../../media/v2/mindsVideo/createMindsVideoStore';
import MindsVideoV2 from '../../media/v2/mindsVideo/MindsVideo';
import Colors from '../../styles/Colors';
import ThemedStyles from '../../styles/ThemedStyles';
import domain from '../helpers/domain';
import mediaProxyUrl from '../helpers/media-proxy-url';
import testID from '../helpers/testID';
import download from '../services/download.service';
import featuresService from '../services/features.service';
import i18n from '../services/i18n.service';
import logService from '../services/log.service';

import openUrlService from '../services/open-url.service';

import ExplicitImage from './explicit/ExplicitImage';

type PropsType = {
  entity: ActivityModel;
  navigation?: any;
  style?: ViewStyle | Array<ViewStyle>;
  containerStyle?: ViewStyle | Array<ViewStyle>;
  autoHeight?: boolean;
  onPress?: () => void;
  hideOverlay?: boolean;
  ignoreDataSaver?: boolean;
};
/**
 * Activity
 */
@observer
export default class MediaView extends Component<PropsType> {
  _currentThumbnail = 0;
  videoPlayer: MindsVideo | MindsVideoStoreType | null = null;

  static defaultProps = {
    width: Dimensions.get('window').width,
  };

  state = {
    imageLoadFailed: false,
    height: 0,
    width: 0,
  };

  /**
   * Show activity media
   */
  showMedia() {
    let source;
    let title =
      this.props.entity.title && this.props.entity.title.length > 200
        ? this.props.entity.title.substring(0, 200) + '...'
        : this.props.entity.title;
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
        source = this.props.entity.getThumbSource('xlarge');
        return this.getImage(
          source,
          // do not show a thumbnail for GIFs
          !this.props.entity.isGif() &&
          mediaProxyUrl(source, 30),
        );
      case 'video':
        return this.getVideo();
    }

    if (this.props.entity.perma_url) {
      source = {
        uri:
          this.props.entity.type === 'comment'
            ? this.props.entity.thumbnail_src
            : mediaProxyUrl(this.props.entity.thumbnail_src),
      };

      const thumbnail = {
        uri: mediaProxyUrl(this.props.entity.thumbnail_src, 30),
      };

      return (
        <View style={styles.richMediaContainer}>
          {source.uri ? this.getImage(source, thumbnail) : null}
          <TouchableOpacity style={styles.richMedia} onPress={this.openLink}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.domain}>
              {domain(this.props.entity.perma_url)}
            </Text>
          </TouchableOpacity>
        </View>
      );
    }
    return null;
  }

  getVideo() {
    const custom_data = this.props.entity.custom_data;
    let aspectRatio = 1;

    if (custom_data && custom_data.height && custom_data.height !== '0') {
      aspectRatio =
        parseInt(custom_data.width, 10) / parseInt(custom_data.height, 10);
    } else if (this.state.height > 0) {
      aspectRatio = this.state.width / this.state.height;
    }

    const MindsVideoComponent = featuresService.has('mindsVideo-2020') ? (
      <MindsVideoV2
        entity={this.props.entity}
        ignoreDataSaver={this.props.ignoreDataSaver}
        onStoreCreated={(store: MindsVideoStoreType) =>
          (this.videoPlayer = store)
        }
        hideOverlay={this.props.hideOverlay}
      />
    ) : (
      <MindsVideo
        entity={this.props.entity}
        ignoreDataSaver={this.props.ignoreDataSaver}
        ref={(o) => {
          this.videoPlayer = o;
        }}
      />
    );

    return (
      <View style={[styles.videoContainer, { aspectRatio }]}>
        {MindsVideoComponent}
      </View>
    );
  }

  /**
   * Prompt user to download
   */
  download = () => {
    Alert.alert(
      i18n.t('downloadGallery'),
      i18n.t('wantToDownloadImage'),
      [
        { text: i18n.t('no'), style: 'cancel' },
        { text: i18n.t('yes'), onPress: () => this.runDownload() },
      ],
      { cancelable: false },
    );
  };

  /**
   * Download the media to the gallery
   */
  runDownload = async () => {
    try {
      const result = await download.downloadToGallery(
        this.source.uri,
        this.props.entity,
      );
      Alert.alert(i18n.t('success'), i18n.t('imageAdded'));
    } catch (e) {
      Alert.alert(i18n.t('errorDownloading'));
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

  imageError = (err) => {
    logService.log('[MediaView] Image error: ' + this.source.uri, err);
    this.setState({ imageLoadFailed: true });
  };

  imageLongPress = () => {
    if (this.props.entity.perma_url) {
      setTimeout(async () => {
        await Clipboard.setString(this.props.entity.perma_url);
        showMessage({
          floating: true,
          position: 'top',
          message: i18n.t('linkCopied'),
          duration: 1300,
          backgroundColor: '#FFDD63DD',
          color: Colors.dark,
          type: 'info',
        });
      }, 100);
    } else {
      this.download();
    }
  };

  /**
   * On image load handler
   */
  onLoadImage = (e) => {
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
  getImage(source, thumbnail?) {
    this.source = source;
    const autoHeight = this.props.autoHeight;
    const custom_data = this.props.entity.custom_data;

    if (this.state.imageLoadFailed) {
      let height = 200;

      if (
        !autoHeight &&
        custom_data &&
        custom_data[0] &&
        custom_data[0].height &&
        custom_data[0].height !== '0'
      ) {
        let ratio = custom_data[0].height / custom_data[0].width;
        height = this.props.width * ratio;
      }

      let text = (
        <Text style={styles.imageLoadErrorText}>{i18n.t('errorMedia')}</Text>
      );

      if (this.props.entity.perma_url) {
        text = (
          <Text style={styles.imageLoadErrorText}>
            The media from{' '}
            <Text style={styles.imageLoadErrorTextDomain}>
              {domain(this.props.entity.perma_url)}
            </Text>{' '}
            could not be loaded.
          </Text>
        );
      }

      return <View style={[styles.imageLoadError, { height }]}>{text}</View>;
    }

    let aspectRatio = 1.5;

    if (
      custom_data &&
      custom_data[0] &&
      custom_data[0].height &&
      custom_data[0].height !== '0'
    ) {
      aspectRatio = custom_data[0].width / custom_data[0].height;
    } else if (this.state.height > 0) {
      aspectRatio = this.state.width / this.state.height;
    }

    return (
      <SharedElement id={`${this.props.entity.urn}.image`}>
        <TouchableOpacity
          onPress={this.onImagePress}
          onLongPress={this.imageLongPress}
          style={[styles.imageContainer, { aspectRatio }]}
          activeOpacity={1}
          {...testID('Posted Image')}>
          <ExplicitImage
            source={source}
            thumbnail={thumbnail}
            entity={this.props.entity}
            onLoad={this.onLoadImage}
            onError={this.imageError}
            ignoreDataSaver={this.props.ignoreDataSaver}
          />
        </TouchableOpacity>
      </SharedElement>
    );
  }

  /**
   * Render
   */
  render() {
    const media = this.showMedia();

    // dereference to force re render on change (mobx)
    const paywall = this.props.entity.paywall;

    if (!media) return null;

    return (
      <View style={this.props.containerStyle}>
        {media}
        {!!this.props.entity.license && false && this.getLicense()}
      </View>
    );
  }

  /**
   * License text with icon.
   * Does not check whether or not the license exists, that is left up to the implementation to decide.
   * @returns a license with icon for the given media
   */
  getLicense() {
    const license = this.props.entity.license.replace(/-/g, ' ').toUpperCase();
    return (
      <View style={styles.licenseContainer}>
        <Icon
          style={[styles.licenseIcon, ThemedStyles.style.colorIcon]}
          name="public"
          raised={false}
          reverse={false}
          reverseColor="white"
          size={18}
          underlayColor="white"
        />
        <Text style={styles.licenseText}>{license}</Text>
      </View>
    );
  }

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
   * Open a link
   */
  openLink = () => {
    openUrlService.open(this.props.entity.perma_url);
  };
}

const styles = StyleSheet.create({
  imageContainer: {
    width: '100%',
  },
  image: {
    //height: 200,
    flex: 1,
  },
  innerImage: {
    backgroundColor: 'black',
  },
  videoContainer: {
    width: '100%',
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  richMediaContainer: {
    minHeight: 20,
    //borderWidth: 1,
    //borderColor: '#ececec',
  },
  richMedia: {
    padding: 20,
  },
  domain: {
    fontSize: 13,
    color: '#888',
  },
  imageLoadError: {
    padding: 20,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageLoadErrorText: {
    fontFamily: 'Roboto',
    color: '#666',
    fontSize: 12,
    lineHeight: 16,
  },
  imageLoadErrorTextDomain: {
    fontWeight: '600',
  },
  licenseContainer: {
    marginTop: 8,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  licenseText: {
    color: '#888',
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    fontSize: 10,
  },
  licenseIcon: {
    paddingRight: 2,
  },
});
