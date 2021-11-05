import React, { useRef, useEffect, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  ViewStyle,
  View,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { withSpacer } from '~ui/layout/Spacer';
import { UNIT } from '~styles/Tokens';
import ThemedStyles from '~/styles/ThemedStyles';
import {
  timingAnimation,
  bounceAnimation,
  getColor,
  configureLayoutAnimation,
  getFontRenderer,
} from './helpers';
import { frameThrower } from '~ui/helpers';

export type ButtonPropsType = {
  mode?: 'flat' | 'outline' | 'solid';
  type?: 'base' | 'action' | 'warning';
  size?: 'large' | 'medium' | 'small' | 'tiny';
  font?: 'regular' | 'medium';
  align?: 'start' | 'end' | 'stretch';
  spinner?: boolean;
  stretch?: boolean;
  disabled?: boolean;
  darkContent?: boolean;
  shouldAnimateChanges?: boolean;
  loading?: boolean;
  children?: React.ReactNode;
  onPress?: (release: any) => void;
  testID?: string;
  accessibilityLabel?: string;
};

export const ButtonComponent = ({
  mode = 'solid',
  type = 'base',
  size = 'medium',
  font = 'medium',
  stretch = false,
  disabled = false,
  darkContent = false,
  spinner = false,
  align = 'start',
  loading = false,
  onPress,
  children,
  shouldAnimateChanges = true,
  testID,
  accessibilityLabel,
}: ButtonPropsType) => {
  const containerStyle: ViewStyle = StyleSheet.flatten([
    styles.container,
    styles[mode],
    styles[size],
    styles[`${mode}_${type}`],
    styles[`${mode}_${size}`],
    disabled && styles[`${mode}_disabled`],
  ]);
  const overlayStyle: ViewStyle = StyleSheet.flatten([
    styles.overlay,
    styles[`${mode}_${type}`],
    styles[`${mode}_${size}`],
    disabled && styles[`${mode}_disabled`],
  ]);

  const scaleAnimation = useRef(new Animated.Value(0)).current;
  const activeAnimation = useRef(new Animated.Value(0)).current;
  const textAnimation = useRef(new Animated.Value(1)).current;
  const stateRef = useRef({ state: 0, loading: false, pressing: false });
  const [text, setText]: any = useState(children);
  const Font = getFontRenderer(size);
  const { textColor, spinnerColor } = getColor(
    ThemedStyles.theme,
    mode,
    darkContent,
    disabled,
    type,
  );
  const bounceType = spinner ? 'long' : 'short';

  // Added for the LEGACY loading prop;
  useEffect(() => {
    if (loading === false && stateRef.current.loading === true) {
      hideSpinner();
      return;
    }
    if (loading === true && stateRef.current.loading === false) {
      showSpinner();
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  // Sets-up text/onChange animation
  useEffect(() => {
    if (!text || !shouldAnimateChanges || !children) {
      setText(children);
      return;
    }
    if (typeof children === 'string') {
      if (children === text) {
        return;
      }
    }
    timingAnimation(
      textAnimation,
      0.6,
      () => {
        bounceAnimation(textAnimation, 1, 'long_fast');
        configureLayoutAnimation();
        setText(children);
      },
      100,
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children]);

  const shouldBreak = num => {
    return (
      disabled ||
      stateRef.current.loading === true ||
      stateRef.current.pressing === true ||
      stateRef.current.loading > num
    );
  };

  const handlePressIn = () => {
    if (shouldBreak(0)) {
      return;
    }
    stateRef.current.state = 1;
    showActive();
  };

  const handlePressOut = () => {
    if (shouldBreak(1)) {
      return;
    }
    stateRef.current.state = 2;
    hideActive();
  };

  const handlePress = () => {
    if (shouldBreak(2)) {
      return;
    }
    stateRef.current.state = 3;
    hideActive();
    if (!onPress) {
      return;
    }
    stateRef.current.pressing = true;
    if (spinner) {
      showSpinner();
    }
    onPress(() => {
      hideSpinner();
    });
    frameThrower(4, () => {
      stateRef.current.pressing = false;
    });
  };

  const showSpinner = () => {
    if (stateRef.current.loading === true) {
      return;
    }
    stateRef.current.loading = true;
    bounceAnimation(scaleAnimation, 1, bounceType);
    hideText();
  };

  const hideSpinner = () => {
    if (stateRef.current.loading !== true) {
      return;
    }
    timingAnimation(scaleAnimation, 0, clearState);
    bounceAnimation(textAnimation, 1, bounceType);
  };

  const hideText = (callback = undefined) => {
    timingAnimation(textAnimation, 0, callback);
  };

  const showActive = () => {
    if (stateRef.current.state !== 1) {
      return;
    }

    timingAnimation(activeAnimation, 1);
    bounceAnimation(textAnimation, 0.92, bounceType);
  };

  const hideActive = () => {
    // Avoid conditional on hide
    timingAnimation(activeAnimation, 0, () => {
      if (spinner) {
        return;
      }
      clearState();
    });
    // Avoid early bouce out when the spinner is up
    if (spinner && stateRef.current.loading === true) {
      return;
    }
    bounceAnimation(textAnimation, 1, bounceType);
  };

  const clearState = () => {
    stateRef.current.loading = false;
    stateRef.current.state = 0;
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      style={stretch ? styles.stretch : styles[align]}
      testID={testID}
      accessibilityLabel={accessibilityLabel}>
      {/** Main Wrapper */}
      <View style={containerStyle}>
        {/** Border Overlay */}
        <View style={overlayStyle}>
          {/** Activity Indicator */}
          {spinner ? (
            <Animated.View style={{ transform: [{ scale: scaleAnimation }] }}>
              <ActivityIndicator
                size="small"
                color={spinnerColor}
                style={styles[`spinner_${size}`]}
              />
            </Animated.View>
          ) : null}
        </View>
        {/** Background Active */}
        <Animated.View style={[{ opacity: activeAnimation }, styles.active]} />
        {/** Button Text */}
        <Animated.View style={{ transform: [{ scale: textAnimation }] }}>
          <Font font={font} color={textColor} numberOfLines={1}>
            {text}
          </Font>
        </Animated.View>
      </View>
    </Pressable>
  );
};

const styles = ThemedStyles.create({
  pressable: {
    alignSelf: 'flex-start',
  },
  stretch: {
    alignSelf: 'stretch',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  active: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.10)',
  },
  container: {
    borderColor: 'transparent',
    backgroundColor: 'transparent',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    overflow: 'hidden',
  },
  // PUT SIZING IN THE TOKEN FILE
  large: {
    paddingHorizontal: UNIT.L2,
    paddingVertical: UNIT.S,
    height: UNIT.XL2 + UNIT.S,
  },
  medium: {
    paddingHorizontal: UNIT.XXL,
    paddingVertical: UNIT.XS,
    height: UNIT.XL2 + UNIT.XS,
  },
  small: {
    paddingHorizontal: UNIT.L,
    paddingVertical: UNIT.XXS,
    height: UNIT.L2 + UNIT.XS,
  },
  tiny: {
    paddingHorizontal: UNIT.L,
    paddingVertical: UNIT.XXS,
    height: UNIT.L2 + UNIT.XS,
  },
  flat: {
    borderColor: 'transparent',
  },
  flat_tiny: {
    height: UNIT.XXXL,
    borderRadius: 0,
    paddingHorizontal: UNIT.S,
    paddingVertical: UNIT.XXS,
  },
  flat_small: {
    height: UNIT.XXXL,
    borderRadius: 0,
    paddingHorizontal: UNIT.S,
    paddingVertical: UNIT.XXS,
  },
  flat_medium: {
    height: UNIT.L2,
    paddingHorizontal: UNIT.S,
    paddingVertical: UNIT.XS,
    borderRadius: 0,
  },
  flat_large: {
    height: UNIT.L2 + UNIT.XS,
    paddingHorizontal: UNIT.S,
    paddingVertical: UNIT.XXS,
    borderRadius: 0,
  },
  outline: {
    backgroundColor: 'transparent',
  },
  outline_base: ['bcolorBaseBackground'],
  outline_action: ['bcolorLink'],
  outline_warning: ['bcolorDangerBackground'],
  outline_disabled: [
    'bcolorPrimaryBorder',
    { backgroundColor: 'rgba(0,0,0,0.1)' },
  ],
  solid_base: ['bgBaseBackground'],
  solid_action: ['bgLink'],
  solid_warning: ['bgDangerBackground'],
  solid_disabled: {
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  flat_disabled: {
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  spinner_small: {
    transform: [{ scale: 0.9 }],
  },
});

export const Button = withSpacer(ButtonComponent);
