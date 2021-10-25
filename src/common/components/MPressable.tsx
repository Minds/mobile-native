import React, { useMemo, useState } from 'react';
import { Platform, Pressable } from 'react-native';
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
            color: ThemedStyles.getColor('TertiaryBackground'),
          },
        },
        default: {
          onPressIn: () => setPressed(true),
          onPressOut: () => setPressed(false),
          style: [
            {
              backgroundColor: pressed
                ? ThemedStyles.getColor('SecondaryBackground')
                : undefined,
            },
            props.style,
          ],
        },
      }),
    [pressed],
  );

  return <Pressable {...props} {...platformSpecificProps} />;
};

export default MPressable;
