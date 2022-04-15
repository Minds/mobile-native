import React, { useRef, useEffect, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  ViewStyle,
  View,
  ActivityIndicator,
  Animated,
  PressableProps,
} from 'react-native';
import { withSpacer } from '~ui/layout/Spacer';
import ThemedStyles from '~/styles/ThemedStyles';
import {
  timingAnimation,
  bounceAnimation,
  getColor,
  configureLayoutAnimation,
  getFontRenderer,
} from './helpers';
import { frameThrower } from '~ui/helpers';
import { COMMON_BUTTON_STYLES, FLAT_BUTTON_STYLES } from './tokens';
import { TRANSPARENCY, UNIT } from '~/styles/Tokens';
import { Row, Spacer } from '../layout';

export type ButtonPropsType = {
  mode?: 'flat' | 'outline' | 'solid';
  type?: 'base' | 'action' | 'warning';
  size?: 'large' | 'medium' | 'small' | 'tiny';
  font?: 'regular' | 'medium';
  align?: 'start' | 'end' | 'stretch' | 'center';
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
  icon?: React.ReactNode;
  pressableProps?: PressableProps;
};
const shouldBreak = (num, disabled, state) => {
  return (
    disabled ||
    state.loading === true ||
    state.pressing === true ||
    state.loading > num
  );
};

/**
 * Base button component
 */
export const ButtonComponent = ({
  mode = 'solid',
  type = 'base',
  size = 'medium',
  font = 'medium',
  stretch = false,
  disabled = false,
  darkContent = false,
  spinner = false,
  align = 'stretch',
  loading = false,
  onPress,
  children,
  shouldAnimateChanges = true,
  testID,
  accessibilityLabel,
  icon,
  pressableProps,
}: ButtonPropsType) => {
  const iconOnly = icon && !children;

  const containerStyle = [
    styles.container,
    styles[mode],
    styles[size],
    styles[`${mode}_${type}`],
    styles[`${mode}_${size}`],
    iconOnly && styles.paddingLess,
    disabled && styles[`${mode}_disabled`],
  ];

  const overlayStyle: ViewStyle = StyleSheet.flatten([
    styles.overlay,
    styles[`${mode}_${type}__overlay`],
    disabled && styles[`${mode}_disabled__overlay`],
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

  const handlePressIn = () => {
    if (shouldBreak(0, disabled, stateRef.current)) {
      return;
    }
    stateRef.current.state = 1;
    showActive();
  };

  const handlePressOut = () => {
    if (shouldBreak(1, disabled, stateRef.current)) {
      return;
    }
    stateRef.current.state = 2;
    hideActive();
  };

  const handlePress = () => {
    if (shouldBreak(2, disabled, stateRef.current)) {
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
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      {...pressableProps}>
      {/** Main Wrapper */}
      <View style={containerStyle}>
        {/** Border Overlay */}
        <View style={overlayStyle}>
          {/** Activity Indicator */}
          {spinner && (
            <Animated.View style={{ transform: [{ scale: scaleAnimation }] }}>
              <ActivityIndicator
                size="small"
                color={spinnerColor}
                style={styles[`spinner_${size}`]}
              />
            </Animated.View>
          )}
        </View>
        {/** Background Active */}
        <Animated.View
          style={[{ opacity: activeAnimation }, styles[`active_${mode}`]]}
        />
        {darkContent && <View style={styles.darken} />}
        {/** Button Text */}
        <Animated.View
          style={{
            transform: [{ scale: textAnimation }],
          }}>
          {iconOnly ? (
            icon
          ) : (
            <Row>
              {icon ? <Spacer right="XS">{icon}</Spacer> : null}
              <Font font={font} color={textColor} numberOfLines={1}>
                {text}
              </Font>
            </Row>
          )}
        </Animated.View>
      </View>
    </Pressable>
  );
};

const styles = ThemedStyles.create({
  start: {
    alignSelf: 'flex-start',
  },
  end: {
    alignSelf: 'flex-end',
  },
  center: {
    alignSelf: 'center',
  },
  stretch: {
    alignSelf: 'stretch',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  active_flat: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: TRANSPARENCY.DARKEN05,
  },
  active_outline: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: TRANSPARENCY.DARKEN05,
  },
  active_solid: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: TRANSPARENCY.DARKEN10,
  },
  container: {
    backgroundColor: 'transparent',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    overflow: 'hidden',
  },
  darken: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: TRANSPARENCY.DARKEN20,
  },
  large: {
    ...COMMON_BUTTON_STYLES.LARGE,
  },
  medium: {
    ...COMMON_BUTTON_STYLES.MEDIUM,
  },
  small: {
    ...COMMON_BUTTON_STYLES.SMALL,
  },
  tiny: {
    ...COMMON_BUTTON_STYLES.TINY,
  },
  flat: {
    borderColor: 'transparent',
    borderRadius: UNIT.XS,
  },
  flat_tiny: {
    ...FLAT_BUTTON_STYLES.TINY,
    borderRadius: 0,
  },
  flat_small: {
    ...FLAT_BUTTON_STYLES.SMALL,
    borderRadius: 0,
  },
  flat_medium: {
    ...FLAT_BUTTON_STYLES.MEDIUM,
    borderRadius: 0,
  },
  flat_large: {
    ...FLAT_BUTTON_STYLES.LARGE,
    borderRadius: 0,
  },
  outline: {
    backgroundColor: 'transparent',
  },
  outline_base__overlay: ['bcolorBaseBackground'],
  outline_action__overlay: ['bcolorLink'],
  outline_warning__overlay: ['bcolorDangerBackground'],
  outline_disabled__overlay: [
    'bcolorPrimaryBorder',
    { backgroundColor: TRANSPARENCY.DARKEN10 },
  ],
  solid_base__overlay: ['bgBaseBackground'],
  solid_action__overlay: ['bgLink'],
  solid_warning__overlay: ['bgDangerBackground'],
  solid_disabled__overlay: {
    backgroundColor: TRANSPARENCY.DARKEN10,
  },
  flat_disabled__overlay: {
    backgroundColor: 'transparent',
  },
  spinner_small: {
    transform: [{ scale: 0.9 }],
  },
  spinner_tiny: {
    transform: [{ scale: 0.8 }],
  },
  paddingLess: {
    paddingHorizontal: 0,
  },
});

export const Button = withSpacer(ButtonComponent);
