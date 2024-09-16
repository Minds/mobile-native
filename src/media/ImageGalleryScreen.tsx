import { StackNavigationProp } from '@react-navigation/stack';
import { Image } from 'expo-image';
import { MotiView } from 'moti';
import React, { useCallback, useState } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import Gallery, { RenderItemInfo } from 'react-native-awesome-gallery';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ModalFullScreen } from '../common/ui';
import { RootStackParamList } from '../navigation/NavigationTypes';
import BottomContent from '../newsfeed/activity/BottomContent';

import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';
import sp from '~/services/serviceProvider';
import { BoostCTA } from '~/modules/boost';

interface ImageGalleryScreenProps {
  route: any;
  navigation: StackNavigationProp<RootStackParamList, 'ImageGallery'>;
}

const TOP_HEADER_HEIGHT = 200;

function ImageGalleryScreen({
  route: {
    params: { entity, initialIndex },
  },
  navigation,
}: ImageGalleryScreenProps) {
  const { width, height } = useWindowDimensions();
  const { top } = useSafeAreaInsets();
  const theme = sp.styles.style;
  const images = entity.custom_data;
  const [controlsVisible, setControlsVisible] = useState(false);

  const handleOnScaleChange = useCallback((scale: number) => {
    if (scale <= 1) {
      setControlsVisible(true);
    } else {
      setControlsVisible(false);
    }
  }, []);

  const handleSwipeToClose = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const renderItem = useCallback(
    ({ item, setImageDimensions }: RenderItemInfo<any>) => {
      setImageDimensions({
        width: item.width,
        height: item.height,
      });
      return (
        <Image
          style={StyleSheet.absoluteFillObject}
          contentFit="contain"
          source={{
            uri: item.src,
            headers: sp.api.buildHeaders(),
          }}
        />
      );
    },
    [],
  );

  return (
    <ModalFullScreen back borderless headerHidden={!controlsVisible}>
      <Gallery
        data={images}
        initialIndex={initialIndex}
        style={theme.bgPrimaryBackground}
        containerDimensions={{
          height: height - TOP_HEADER_HEIGHT - top,
          width,
        }}
        onSwipeToClose={handleSwipeToClose}
        onScaleChange={handleOnScaleChange}
        renderItem={renderItem}
      />

      <MotiView
        transition={{
          mass: 0.3,
        }}
        animate={{
          transform: [{ translateY: !controlsVisible ? 100 : 0 }],
        }}
        style={theme.bgPrimaryBackground}>
        <BoostCTA entity={entity} />
        <BottomContent hideMetrics entity={entity} />
      </MotiView>
    </ModalFullScreen>
  );
}

export default withErrorBoundaryScreen(ImageGalleryScreen, 'ImageGallery');
