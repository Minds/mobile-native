import React, { useMemo, useState } from 'react';
import { Platform, Pressable, PressableProps } from 'react-native';
import ThemedStyles from '../../styles/ThemedStyles';

interface MPressableProps extends PressableProps {
  noFeedback?: boolean;
  opacity?: boolean;
}

/**
 * A Pressable-extended component to have more control over
 * touchable elements across the app and in different platforms.
 */
const MPressable = ({ noFeedback, opacity, ...props }: MPressableProps) => {
  const [pressed, setPressed] = useState(false);

  const platformSpecificProps = useMemo(
    () =>
      noFeedback
        ? null
        : Platform.select({
            android: {
              android_ripple: props.android_ripple || {
                color: ThemedStyles.getColor('TertiaryBackground'),
              },
            },
            default: {
              onPressIn: () => setPressed(true),
              onPressOut: () => setPressed(false),
              style: [
                {
                  backgroundColor: pressed
                    ? ThemedStyles.getColor('HighlightBackground')
                    : undefined,
                },
                props.style,
              ],
            },
          }),
    [pressed],
  );

  // @ts-ignore
  return <Pressable {...props} {...platformSpecificProps} />;
};

export default MPressable;
