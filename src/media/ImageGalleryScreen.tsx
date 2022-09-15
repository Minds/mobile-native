import { useDimensions } from '@react-native-community/hooks';
import { MotiView } from 'moti';
import React, { useCallback, useState } from 'react';
import { StyleSheet } from 'react-native';
import Gallery, { RenderItemInfo } from 'react-native-awesome-gallery';
import FastImage from 'react-native-fast-image';
import SmartImage from '../common/components/SmartImage';
import api from '../common/services/api.service';
import { ModalFullScreen } from '../common/ui';
import ActivityActions from '../newsfeed/activity/Actions';
import BottomContent from '../newsfeed/activity/BottomContent';
import ThemedStyles from '../styles/ThemedStyles';

interface ImageGalleryScreenProps extends React.FunctionComponent {
  route: any;
}

const TOP_HEADER_HEIGHT = 210;

export default function ImageGalleryScreen({
  route: {
    params: { entity, initialIndex },
  },
}: ImageGalleryScreenProps) {
  const { width, height } = useDimensions().window;
  const theme = ThemedStyles.style;
  const images = entity.custom_data;
  const [controlsVisible, setControlsVisible] = useState(false);

  const handleOnScaleChange = useCallback((scale: number) => {
    if (scale <= 1) {
      setControlsVisible(true);
    } else {
      setControlsVisible(false);
    }
  }, []);

  const renderItem = useCallback(
    ({ item, setImageDimensions }: RenderItemInfo<any>) => {
      setImageDimensions({
        width: item.width,
        height: item.height,
      });
      return (
        <FastImage
          style={StyleSheet.absoluteFillObject}
          resizeMode="contain"
          source={{
            uri: item.src,
            headers: api.buildHeaders(),
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
          height: height - TOP_HEADER_HEIGHT,
          width,
        }}
        disableVerticalSwipe
        onScaleChange={handleOnScaleChange}
        onIndexChange={newIndex => {
          console.log(newIndex);
        }}
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
        <BottomContent hideMetrics entity={entity} />
      </MotiView>
    </ModalFullScreen>
  );
}
