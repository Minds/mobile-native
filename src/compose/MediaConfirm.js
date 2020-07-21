import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import ThemedStyles from '../styles/ThemedStyles';
import i18n from '../common/services/i18n.service';
import ImagePreview from './ImagePreview';
import { useSafeArea } from 'react-native-safe-area-context';
import MindsVideo from '../media/MindsVideo';
import MindsVideoV2 from '../media/v2/mindsVideo/MindsVideo';
import featuresService from '../common/services/features.service';

/**
 * Media confirm screen
 * @param {Object} props
 */
export default function (props) {
  const theme = ThemedStyles.style;

  const insets = useSafeArea();
  const menuStyle = { paddingTop: insets.top || 0 };

  const isImage = props.store.mediaToConfirm.type.startsWith('image');

  const previewComponent = isImage ? (
    <ImagePreview image={props.store.mediaToConfirm} />
  ) : featuresService.has('mindsVideo-2020') ? (
    <MindsVideoV2
      video={{ uri: props.store.mediaToConfirm.uri }}
      pause={false}
      repeat={true}
      containerStyle={{ marginBottom: insets.bottom }}
    />
  ) : (
    <MindsVideo
      video={{ uri: props.store.mediaToConfirm.uri }}
      pause={false}
      repeat={true}
      containerStyle={{ marginBottom: insets.bottom }}
    />
  );

  return (
    <View style={theme.flexContainer}>
      <View style={[styles.topBar, menuStyle]}>
        <MIcon
          size={45}
          name="chevron-left"
          style={[styles.backIcon, theme.colorSecondaryText]}
          onPress={props.store.rejectImage}
        />
        <Text
          onPress={props.store.rejectImage}
          style={[
            theme.fontXL,
            theme.colorSecondaryText,
            theme.fontSemibold,
            theme.flexContainer,
            styles.text,
          ]}>
          {i18n.t('capture.retake')}
        </Text>
        <Text
          onPress={props.store.acceptMedia}
          style={[
            theme.fontXL,
            theme.colorSecondaryText,
            theme.fontSemibold,
            styles.text,
          ]}>
          {i18n.t('confirm')}
        </Text>
      </View>
      {previewComponent}
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    paddingRight: 10,
    textAlignVertical: 'center',
    // lineHeight: Platform.select({ ios: 17, android: 27 }),
  },
  topBar: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  backIcon: {
    shadowOpacity: 2,
    textShadowRadius: 4,
    textShadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
});
