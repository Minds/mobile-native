import React from 'react';
import {
  View,
  StyleSheet,
  PixelRatio,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import IonIcon from '@expo/vector-icons/Ionicons';
import { observer } from 'mobx-react';
import SmartImage from '../common/components/SmartImage';

import mediaProxyUrl from '../common/helpers/media-proxy-url';
import domain from '../common/helpers/domain';
import MText from '../common/components/MText';
import sp from '~/services/serviceProvider';

const imgSize = Dimensions.get('window').width / 4;
const thumbSize = PixelRatio.getPixelSizeForLayoutSize(imgSize);

/**
 * Meta Preview
 * @param {Object} props
 */
export default observer(function (props) {
  const theme = sp.styles.style;
  const source = { uri: mediaProxyUrl(props.meta.thumbnail, thumbSize) };
  const thumbnail = { uri: mediaProxyUrl(props.meta.thumbnail, 30) };

  return (
    <View
      style={[
        styles.container,
        theme.paddingHorizontal4x,
        props.containerStyle,
      ]}>
      {!props.isEdit && (
        <TouchableOpacity
          onPress={props.onRemove}
          style={[styles.removeRichEmbed, theme.bgSecondaryBackground]}>
          <IonIcon name="close" size={22} style={theme.colorPrimaryText} />
        </TouchableOpacity>
      )}
      <View
        style={[
          styles.row,
          theme.borderHair,
          theme.bcolorPrimaryBorder,
          theme.borderRadius2x,
          theme.bgPrimaryBackground,
        ]}>
        <SmartImage
          style={[styles.thumbnail, theme.bgTertiaryBackground]}
          source={source}
          placeholder={thumbnail}
          contentFit="cover"
        />
        <View style={[styles.metaContainer, theme.padding]}>
          <MText numberOfLines={1} style={[theme.fontXL, theme.padding]}>
            {props.meta.title}
          </MText>
          <MText
            numberOfLines={2}
            style={[theme.fontM, theme.padding, theme.colorSecondaryText]}>
            {props.meta.description || domain(props.meta.url)}
          </MText>
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
    paddingTop: 10,
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
    bottom: 0,
    left: 28,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    elevation: 2,
  },
});
