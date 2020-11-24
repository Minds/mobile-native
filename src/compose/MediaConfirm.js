import React, { useRef } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { observer } from 'mobx-react';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import ThemedStyles from '../styles/ThemedStyles';
import i18n from '../common/services/i18n.service';
import ImagePreview from './ImagePreview';
import { useSafeArea } from 'react-native-safe-area-context';
import MindsVideoV2 from '../media/v2/mindsVideo/MindsVideo';
import { ResizeMode } from 'expo-av';

/**
 * Media confirm screen
 * @param {Object} props
 */
export default observer(function (props) {
  const theme = ThemedStyles.style;

  const insets = useSafeArea();
  const cleanTop = useRef({ paddingTop: insets.top || 0 }).current;
  const cleanBottom = useRef({ height: insets.bottom + 50 }).current;
  const videoStyle = useRef({ marginBottom: insets.bottom, flex: 1 }).current;
  const video = useRef({ uri: props.store.mediaToConfirm.uri }).current;

  const isImage = props.store.mediaToConfirm.type.startsWith('image');

  const previewComponent = isImage ? (
    <ImagePreview image={props.store.mediaToConfirm} />
  ) : (
    <MindsVideoV2
      video={video}
      resizeMode={ResizeMode.COVER}
      autoplay
      repeat={true}
      containerStyle={videoStyle}
    />
  );

  return (
    <View style={theme.flexContainer}>
      {previewComponent}
      <View
        style={[
          styles.bottomBar,
          cleanBottom,
          theme.backgroundSecondary,
          isImage ? styles.floating : null,
        ]}>
        {isImage ? (
          <Text
            onPress={props.store.editImage}
            style={[
              theme.fontXL,
              theme.colorSecondaryText,
              theme.fontSemibold,
              theme.marginLeft3x,
              styles.text,
            ]}>
            {i18n.t('edit')}
          </Text>
        ) : (
          <View />
        )}
        <Text
          onPress={props.store.acceptMedia}
          style={[
            theme.fontXL,
            theme.colorSecondaryText,
            theme.bold,
            theme.marginRight3x,
            styles.text,
          ]}>
          {i18n.t('confirm')}
        </Text>
      </View>
      <MIcon
        size={45}
        name="chevron-left"
        style={[styles.backIcon, theme.colorWhite, cleanTop]}
        onPress={props.store.rejectImage}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  text: {
    paddingRight: 10,
    textAlignVertical: 'center',
  },
  floating: {
    position: 'absolute',
    bottom: 0,
  },
  bottomBar: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backIcon: {
    position: 'absolute',
    textShadowColor: 'rgba(0, 0, 0, 0.35)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 2.22,
    elevation: 4,
  },
});
