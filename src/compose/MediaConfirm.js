import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import ThemedStyles from '../styles/ThemedStyles';
import i18n from '../common/services/i18n.service';
import ImagePreview from './ImagePreview';
import { useSafeArea } from 'react-native-safe-area-context';
import MindsVideo from '../media/MindsVideo';

/**
 * Media confirm screen
 * @param {Object} props
 */
export default function (props) {
  const theme = ThemedStyles.style;

  const insets = useSafeArea();
  const cleanTop = { paddingTop: insets.top || 0 };
  const cleanBottom = { height: insets.bottom + 50 };

  const isImage = props.store.mediaToConfirm.type.startsWith('image');

  return (
    <View style={theme.flexContainer}>
      {isImage ? (
        <ImagePreview image={props.store.mediaToConfirm} />
      ) : (
        <MindsVideo
          video={{ uri: props.store.mediaToConfirm.uri }}
          pause={false}
          repeat={true}
          containerStyle={{ marginBottom: insets.bottom }}
        />
      )}
      <View style={[styles.bottomBar, cleanBottom, theme.backgroundSecondary]}>
        <Text
          onPress={props.store.acceptMedia}
          style={[
            theme.fontXL,
            theme.colorSecondaryText,
            theme.fontSemibold,
            theme.marginRight2x,
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
}

const styles = StyleSheet.create({
  text: {
    paddingRight: 10,
    textAlignVertical: 'center',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  backIcon: {
    position: 'absolute',
    textShadowColor: 'rgba(0, 0, 0, 0.35)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 2.22,
    elevation: 4,
  },
});
