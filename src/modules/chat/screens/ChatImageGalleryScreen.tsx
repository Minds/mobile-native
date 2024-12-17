import { StackNavigationProp } from '@react-navigation/stack';
import { Image } from 'expo-image';
import React, { useCallback } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import Gallery, { RenderItemInfo } from 'react-native-awesome-gallery';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';
import sp from '~/services/serviceProvider';
import { RootStackParamList } from '~/navigation/NavigationTypes';
import { ModalFullScreen } from '~/common/ui';

/** Props for image gallery screen. */
type ImageGalleryScreenProps = {
  route: any;
  navigation: StackNavigationProp<RootStackParamList>;
};

/** Top header height. */
const TOP_HEADER_HEIGHT: number = 100;

/**
 * Image gallery screen.
 * @param { ImageGalleryScreenProps } props - Props for image gallery screen.
 * @returns Image gallery screen.
 */
function ChatImageGalleryScreen({
  route: {
    params: { images },
  },
  navigation,
}: ImageGalleryScreenProps) {
  const { width, height } = useWindowDimensions();
  const { top } = useSafeAreaInsets();
  const theme = sp.styles.style;

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
          style={[StyleSheet.absoluteFillObject]}
          contentFit="contain"
          source={{
            uri: item.url,
            headers: sp.api.buildHeaders(),
          }}
          key={item.id}
          testID="chatImageGalleryImage"
        />
      );
    },
    [],
  );

  return (
    <ModalFullScreen back borderless>
      <Gallery
        data={images}
        initialIndex={0}
        style={theme.bgPrimaryBackground}
        containerDimensions={{
          height: height - TOP_HEADER_HEIGHT - top,
          width,
        }}
        onSwipeToClose={handleSwipeToClose}
        renderItem={renderItem}
      />
    </ModalFullScreen>
  );
}

export default withErrorBoundaryScreen(
  ChatImageGalleryScreen,
  'ChatImageGalleryScreen',
);
