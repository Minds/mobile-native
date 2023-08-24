import React, { useMemo, useState } from 'react';
import { Platform, Pressable, StyleSheet } from 'react-native';
import ThemedStyles from '../../styles/ThemedStyles';

/**
 * A Pressable-extended component to have more control over
 * touchable elements across the app and in different platforms.
 */
const MPressable = ({ ...props }) => {
  const [pressed, setPressed] = useState(false);

  const platformSpecificProps = useMemo(
    () =>
      Platform.select({
        android: {
          android_ripple: {
            color:
              props.underlayColor ??
              ThemedStyles.getColor('TertiaryBackground'),
          },
        },
        default: {
          onPressIn: () => setPressed(true),
          onPressOut: () => setPressed(false),
          style: [
            props.style,
            {
              backgroundColor: pressed
                ? props.underlayColor ??
                  ThemedStyles.getColor('SecondaryBackground')
                : props.style
                ? StyleSheet.flatten(props.style).backgroundColor
                : undefined,
            },
          ],
        },
      }),
    [pressed, props.style, props.underlayColor],
  );

  return (
    <Pressable
      disabled={!props.onPress}
      {...props}
      {...platformSpecificProps}
    />
  );
};

export default MPressable;
