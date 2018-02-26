import React, { Component } from 'react';

import {
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
} from 'react-native';

import FastImage from 'react-native-fast-image';

import IonIcon from 'react-native-vector-icons/Ionicons';

import colors from '../styles/Colors';

import Touchable from '../common/components/Touchable';
import mediaProxyUrl from '../common/helpers/media-proxy-url';

export default class CaptureMetaPreview extends Component {
  inProgress() {
    return this.props.inProgress && !this.props.meta;
  }

  render() {
    return (
      <View>
        {this.inProgress() && <View style={[style.content, style.contentLoading]}>
          <ActivityIndicator size={'small'} />
        </View>}

        {!this.inProgress() && <View style={style.content}>
          {this.props.meta.thumbnail && <View style={style.thumbnailContainer}>
          <FastImage
            source={{ uri: mediaProxyUrl(this.props.meta.thumbnail) }}
            resizeMode={FastImage.resizeMode.cover}
            style={style.thumbnail}
          />
          </View>}

          <View style={style.metaContainer}>
            <Text
              ellipsizeMode="head"
              numberOfLines={1}
              style={style.titleText}
            >{this.props.meta.title}</Text>

            <Text
              ellipsizeMode="head"
              numberOfLines={1}
              style={style.urlText}
            >{this.props.meta.url}</Text>
          </View>

        </View>}

        {!this.inProgress() && <Touchable onPress={this.props.onRemove} style={style.removeRichEmbed}>
          <IonIcon name="ios-close-circle" size={20} style={style.removeRichEmbedIcon} />
        </Touchable>}
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
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.dark,
  },
  urlText: {
    fontSize: 12,
    color: colors.darkGreyed,
  },
  removeRichEmbed: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 20,
    height: 20,
  },
  removeRichEmbedIcon: {
    color: '#FFF',
    shadowColor: '#444',
  },
});
