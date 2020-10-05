//@ts-nocheck
import React, { Component } from 'react';

import { View, Text, StyleSheet } from 'react-native';

import FastImage from 'react-native-fast-image';
import { createImageProgress } from 'react-native-image-progress';
import ProgressCircle from 'react-native-progress/Circle';

import IonIcon from 'react-native-vector-icons/Ionicons';

import Touchable from '../common/components/Touchable';
import mediaProxyUrl from '../common/helpers/media-proxy-url';
import domain from '../common/helpers/domain';
import i18n from '../common/services/i18n.service';
import ThemedStyles from '../styles/ThemedStyles';
import ActivityIndicator from '../common/components/ActivityIndicator';

const ProgressFastImage = createImageProgress(FastImage);

export default class CaptureMetaPreview extends Component {
  _currentThumbnail = void 0;

  state = {
    imageLoadFailed: false,
  };

  inProgress() {
    return this.props.inProgress && !this.props.meta;
  }

  componentWillReceiveProps(props) {
    if (props.meta && props.meta.thumbnail !== this._currentThumbnail) {
      this.setState({ imageLoadFailed: false });
      this._currentThumbnail = props.meta.thumbnail;
    }
  }

  imageError = () => {
    this.setState({ imageLoadFailed: true });
  };

  getImagePartial() {
    if (!this.props.meta.thumbnail) {
      return false;
    } else if (this.state.imageLoadFailed) {
      return (
        <View style={style.imageLoadError}>
          <Text style={style.imageLoadErrorText}>
            {i18n.t('capture.couldNotLoad', {
              domain: domain(this.props.meta.url),
            })}
          </Text>
        </View>
      );
    }

    return (
      <View style={style.thumbnailContainer}>
        <ProgressFastImage
          style={style.thumbnail}
          indicator={ProgressCircle}
          threshold={150}
          source={{ uri: mediaProxyUrl(this.props.meta.thumbnail) }}
          resizeMode={FastImage.resizeMode.cover}
          onError={this.imageError}
        />
      </View>
    );
  }

  render() {
    const theme = ThemedStyles.style;

    return (
      <View style={[theme.backgroundTertiary, theme.margin2x]}>
        {this.inProgress() && (
          <View style={[style.content, style.contentLoading]}>
            <ActivityIndicator size={'small'} />
          </View>
        )}

        {!this.inProgress() && (
          <View style={style.content}>
            {this.getImagePartial()}

            <View style={style.metaContainer}>
              <Text
                ellipsizeMode="head"
                numberOfLines={1}
                style={style.titleText}>
                {this.props.meta.title}
              </Text>

              <Text
                ellipsizeMode="head"
                numberOfLines={1}
                style={style.urlText}>
                {domain(this.props.meta.url)}
              </Text>
            </View>
          </View>
        )}

        {!this.inProgress() && (
          <Touchable
            onPress={this.props.onRemove}
            style={style.removeRichEmbed}>
            <IonIcon
              name="ios-close-circle"
              size={30}
              style={style.removeRichEmbedIcon}
            />
          </Touchable>
        )}
      </View>
    );
  }
}

const style = StyleSheet.create({
  content: {
    marginBottom: 16,
  },
  contentLoading: {
    padding: 10,
    justifyContent: 'center',
  },
  thumbnailContainer: {
    height: 200,
  },
  thumbnail: {
    flex: 1,
    backgroundColor: '#fff',
  },
  metaContainer: {
    padding: 8,
    flexDirection: 'column',
  },
  titleText: {
    paddingBottom: 3,
    fontSize: 16,
    fontWeight: 'bold',
  },
  urlText: {
    fontSize: 13,
  },
  removeRichEmbed: {
    position: 'absolute',
    top: 3,
    right: 3,
    width: 30,
    height: 30,
    elevation: 2,
    shadowOffset: { width: 1, height: 1 },
    shadowColor: 'black',
    shadowOpacity: 0.65,
  },
  removeRichEmbedIcon: {
    color: 'white',
    shadowColor: '#444',
  },
  imageLoadError: {
    height: 200,
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
});
