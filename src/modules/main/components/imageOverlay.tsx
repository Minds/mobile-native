import React from 'react';
import {
  ImageBackground,
  ImageBackgroundProps,
  ImageSourcePropType,
  ImageStyle,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

export interface ImageOverlayProps extends ImageBackgroundProps {
  style?: ImageStyle | ViewStyle;
  children?: React.ReactNode;
  overlayColor?: string;
  source: ImageSourcePropType;
}

const DEFAULT_OVERLAY_COLOR = 'rgba(0,0,0,0.0)';

export const ImageOverlay = (
  props: ImageOverlayProps,
): React.ReactElement<ImageBackgroundProps> => {
  const {
    overlayColor,
    style,
    children,
    source,
    ...imageBackgroundProps
  } = props;
  const imageBackgroundStyle = StyleSheet.flatten(style);

  return (
    <ImageBackground
      source={source}
      {...imageBackgroundProps}
      style={imageBackgroundStyle}>
      <View
        style={[
          StyleSheet.absoluteFill,
          { backgroundColor: overlayColor || DEFAULT_OVERLAY_COLOR },
        ]}
      />
      {children}
    </ImageBackground>
  );
};
