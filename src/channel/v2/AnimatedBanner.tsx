import React, { FC, useCallback, useState } from 'react';
import SmartImage, {
  SmartImageProps,
} from '../../common/components/SmartImage';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from 'react-native-reanimated';

import { View, ViewStyle } from 'react-native';
import SmallCircleButton from '../../common/components/SmallCircleButton';
import { IS_IPAD } from '~/config/Config';
import sp from '~/services/serviceProvider';

interface AnimatedBannerProps {
  parentScrollOffset: Animated.SharedValue<number>;
  bannerSource: SmartImageProps['source'];
}

/**
 * A SmartImage that reacts to the offset of
 * the parent scrollView and changes in scale
 **/
const AnimatedBanner: FC<AnimatedBannerProps> = ({
  parentScrollOffset,
  bannerSource,
}) => {
  const SettingsService = sp.resolve('settings');
  const [showBanner, setShowBanner] = useState(
    !SettingsService.dataSaverEnabled,
  );

  const _onBannerDownload = useCallback(() => setShowBanner(true), []);
  const Background: any = showBanner ? SmartImage : View;

  const animatedStyles = useAnimatedStyle<ViewStyle>(() => ({
    transform: [
      {
        scale: interpolate(
          /**
           * Only scale if the scroll was negative (only applies to iOS)
           **/
          parentScrollOffset.value > 0 ? 0 : parentScrollOffset.value * -1,
          [0, 40],
          [1, 1.2],
          Extrapolate.EXTEND,
        ),
      },
    ],
    // fade background image for iPad
    opacity: IS_IPAD
      ? interpolate(
          parentScrollOffset.value,
          [0, 90, 100],
          [1, 1, 0],
          Extrapolate.CLAMP,
        )
      : 1,
  }));

  return (
    <Animated.View style={[styles.animatedView, animatedStyles]}>
      <Background
        source={bannerSource}
        contentFit="cover"
        style={styles.image}
      />
      {!showBanner && SettingsService.dataSaverEnabled && (
        <SmallCircleButton
          raised
          name="file-download"
          type="material"
          color={sp.styles.getColor('SecondaryBackground')}
          onPress={_onBannerDownload}
        />
      )}
    </Animated.View>
  );
};

export default AnimatedBanner;

const styles = sp.styles.create({
  animatedView: [
    'centered',
    {
      aspectRatio: 2.2,
      width: '100%',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      overflow: 'hidden',
      maxHeight: 280,
    },
  ],
  image: ['positionAbsolute'],
});
