import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  PixelRatio,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import IonIcon from 'react-native-vector-icons/Ionicons';
import FastImage from 'react-native-fast-image';
import { observer } from 'mobx-react';
import SmartImage from '../../src/common/components/SmartImage';

import ThemedStyles from '../styles/ThemedStyles';
import mediaProxyUrl from '../common/helpers/media-proxy-url';
import domain from '../common/helpers/domain';

const imgSize = Dimensions.get('window').width / 4;
const thumbSize = PixelRatio.getPixelSizeForLayoutSize(imgSize);

/**
 * Meta Preview
 * @param {Object} props
 */
export default observer(function (props) {
  const theme = ThemedStyles.style;

  return (
    <View style={[styles.container, theme.paddingHorizontal4x]}>
      {!props.isEdit && (
        <TouchableOpacity
          onPress={props.onRemove}
          style={[styles.removeRichEmbed, theme.backgroundSecondary]}>
          <IonIcon name="ios-close" size={22} style={theme.colorPrimaryText} />
        </TouchableOpacity>
      )}
      <View
        style={[
          styles.row,
          theme.borderHair,
          theme.borderPrimary,
          theme.borderRadius2x,
        ]}>
        <SmartImage
          style={styles.thumbnail}
          threshold={150}
          source={{ uri: props.meta.thumbnail }}
          thumbSize={thumbSize}
          resizeMode={FastImage.resizeMode.cover}
        />
        <View style={[styles.metaContainer, theme.padding]}>
          <Text numberOfLines={1} style={[theme.fontXL, theme.padding]}>
            {props.meta.title}
          </Text>
          <Text
            numberOfLines={2}
            style={[theme.fontM, theme.padding, theme.colorSecondaryText]}>
            {props.meta.description || domain(props.meta.url)}
          </Text>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  thumbnail: {
    width: imgSize,
    height: imgSize,
    borderRadius: 2,
  },
  container: {
    width: '100%',
    backgroundColor: 'transparent',
    height: imgSize,
    position: 'relative',
    borderRadius: 1,
  },
  metaContainer: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    width: '100%',
  },
  removeRichEmbed: {
    zIndex: 10000,
    position: 'absolute',
    bottom: 8,
    left: 28,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    elevation: 2,
  },
});
