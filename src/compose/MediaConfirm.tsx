import React, { useMemo, useRef } from 'react';
import { View } from 'react-native';
import { observer } from 'mobx-react';
import MIcon from '@expo/vector-icons/MaterialCommunityIcons';

import ThemedStyles, { useMemoStyle } from '../styles/ThemedStyles';
import i18n from '../common/services/i18n.service';
import ImagePreview from './ImagePreview';
import { useSafeArea } from 'react-native-safe-area-context';
import MindsVideoV2 from '../media/v2/mindsVideo/MindsVideo';
import { ResizeMode } from 'expo-av';
import MText from '../common/components/MText';

/**
 * Media confirm screen
 * @param {Object} props
 */
export default observer(function (props) {
  const theme = ThemedStyles.style;

  const insets = useSafeArea();
  const cleanTop = useMemo(
    () => ({ paddingTop: insets.top || 0 }),
    [insets.top],
  );
  const cleanBottom = useMemo(
    () => ({ height: insets.bottom + 50 }),
    [insets.bottom],
  );
  const [videoPortrait, setVideoPortrait] = React.useState(true);
  const onVideoLoaded = React.useCallback(e => {
    setVideoPortrait(e.naturalSize.height > e.naturalSize.width);
  }, []);

  const video = useRef({ uri: props.store.mediaToConfirm.uri }).current;

  const isImage = props.store.mediaToConfirm.type.startsWith('image');

  const previewComponent = isImage ? (
    <ImagePreview image={props.store.mediaToConfirm} zoom={true} />
  ) : (
    <View style={theme.flexContainer}>
      <MindsVideoV2
        video={video}
        resizeMode={videoPortrait ? ResizeMode.COVER : ResizeMode.CONTAIN}
        autoplay
        onReadyForDisplay={onVideoLoaded}
        repeat={true}
      />
    </View>
  );

  const bottomBarStyle = useMemoStyle(
    [
      styles.bottomBar,
      cleanBottom,
      'bgSecondaryBackground',
      isImage ? styles.floating : null,
    ],
    [cleanBottom, isImage],
  );

  const backStyle = useMemoStyle(
    [styles.backIcon, 'colorWhite', cleanTop],
    [cleanTop],
  );

  return (
    <View style={styles.container}>
      <View style={styles.mediaContainer}>{previewComponent}</View>
      <View style={bottomBarStyle}>
        {isImage ? (
          <MText onPress={props.store.editImage} style={styles.leftText}>
            {i18n.t('edit')}
          </MText>
        ) : (
          <View />
        )}
        <MText onPress={props.store.acceptMedia} style={styles.rightText}>
          {i18n.t('confirm')}
        </MText>
      </View>
      <MIcon
        size={45}
        name="chevron-left"
        style={backStyle}
        onPress={props.store.rejectImage}
      />
    </View>
  );
});

const styles = ThemedStyles.create({
  container: ['flexContainer', 'bgSecondaryBackground'],
  mediaContainer: ['flexContainer', 'justifyEnd'],
  leftText: [
    'fontXL',
    'colorSecondaryText',
    'fontSemibold',
    'marginLeft3x',
    'paddingRight2x',
    { textAlignVertical: 'center' },
  ],
  rightText: [
    'fontXL',
    'colorSecondaryText',
    'bold',
    'marginRight3x',
    'paddingRight2x',
    { textAlignVertical: 'center' },
  ],
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
