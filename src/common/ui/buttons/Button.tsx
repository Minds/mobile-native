import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  Pressable,
  StyleSheet,
  ViewStyle,
  View,
  PressableProps,
  StyleProp,
  ActivityIndicator,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
  runOnJS,
  useAnimatedProps,
  Layout,
} from 'react-native-reanimated';
import { withSpacer } from '~ui/layout/Spacer';
import ThemedStyles from '~/styles/ThemedStyles';
import { getColor, configureLayoutAnimation, getFontRenderer } from './helpers';
import { COMMON_BUTTON_STYLES, FLAT_BUTTON_STYLES } from './tokens';
import { TRANSPARENCY, UNIT } from '~/styles/Tokens';
import { Row, Spacer } from '../layout';
import { ColorsNameType } from '~/styles/Colors';

const AnimatedActivityIndicator =
  Animated.createAnimatedComponent(ActivityIndicator);

export type ButtonPropsType = {
  mode?: 'flat' | 'outline' | 'solid';
  type?: 'base' | 'action' | 'warning';
  size?: 'large' | 'medium' | 'small' | 'tiny' | 'pill';
  font?: 'regular' | 'medium';
  align?: 'start' | 'end' | 'stretch' | 'center';
  spinner?: boolean;
  stretch?: boolean;
  disabled?: boolean;
  fit?: boolean;
  darkContent?: boolean;
  lightContent?: boolean;
  shouldAnimateChanges?: boolean;
  loading?: boolean;
  children?: React.ReactNode;
  onPress?: () => void;
  testID?: string;
  accessibilityLabel?: string;
  icon?: React.ReactNode | ((color: ColorsNameType) => React.ReactNode);
  reversedIcon?: boolean;
  pressableProps?: PressableProps;
  color?: 'link' | 'primary' | 'tertiary' | 'danger';
  overlayStyle?: StyleProp<ViewStyle>;
};

const ANIMATION_CONFIG = { duration: 150 };

export const ButtonComponent = ({
  mode = 'solid',
  type = 'base',
  size = 'medium',
  font = 'medium',
  stretch = false,
  disabled = false,
  darkContent = false,
  lightContent = false,
  spinner = false,
  align = 'stretch',
  loading = false,
  onPress,
  children,
  shouldAnimateChanges = true,
  testID,
  accessibilityLabel,
  icon,
  fit,
  reversedIcon,
  pressableProps,
  color,
  ...props
}: ButtonPropsType) => {
  const iconOnly = icon && !children;

  const containerStyle = useMemo(
    () => [
      styles.container,
      styles[mode],
      styles[size],
      styles[`${mode}_${type}`],
      styles[`${mode}_${size}`],
      iconOnly && styles.paddingLess,
      disabled && styles[`${mode}_disabled`],
    ],
    [mode, size, type, iconOnly, disabled],
  );

  const overlayStyle: ViewStyle = useMemo(
    () =>
      StyleSheet.flatten([
        styles.overlay,
        styles[`${mode}_${type}__overlay`],
        disabled && styles[`${mode}_disabled__overlay`],
        props.overlayStyle,
      ]),
    [mode, type, disabled, props.overlayStyle],
  );

  const scaleAnimation = useSharedValue(0);
  const activeAnimation = useSharedValue(0);
  const textAnimation = useSharedValue(1);
  const textOpacity = useSharedValue(1);
  const [isLoading, setIsLoading] = useState(loading);
  const [text, setText] = useState(children);
  const Font = getFontRenderer(size);

  const { textColor, spinnerColor } = useMemo(
    () =>
      color
        ? { textColor: color, spinnerColor: color }
        : getColor({
            theme: ThemedStyles.theme,
            mode,
            darkContent,
            disabled,
            type,
          }),
    [color, mode, darkContent, disabled, type],
  );

  const showSpinner = useCallback(() => {
    'worklet';
    scaleAnimation.value = withSpring(1);
    textOpacity.value = withTiming(0, ANIMATION_CONFIG);
  }, [scaleAnimation, textOpacity]);

  const hideSpinner = useCallback(() => {
    'worklet';
    scaleAnimation.value = withTiming(0, ANIMATION_CONFIG);
    textOpacity.value = withSpring(1);
  }, [scaleAnimation, textOpacity]);

  useEffect(() => {
    if (loading !== isLoading) {
      setIsLoading(loading);
      if (loading) {
        showSpinner();
      } else {
        hideSpinner();
      }
    }
  }, [loading, isLoading, showSpinner, hideSpinner]);

  const updateText = useCallback(() => {
    textAnimation.value = withSpring(1);
    configureLayoutAnimation();
    setText(children);
  }, [children, textAnimation]);

  useEffect(() => {
    if (!text || !shouldAnimateChanges || !children) {
      setText(children);
      return;
    }
    if (typeof children === 'string' && children === text) {
      return;
    }

    textAnimation.value = withTiming(0.6, ANIMATION_CONFIG, () => {
      runOnJS(updateText)();
    });
  }, [children, shouldAnimateChanges, text, textAnimation, updateText]);

  const showActive = useCallback(() => {
    'worklet';
    activeAnimation.value = withTiming(1);
    textAnimation.value = withSpring(0.92);
  }, [activeAnimation, textAnimation]);

  const hideActive = useCallback(() => {
    'worklet';
    activeAnimation.value = withTiming(0, ANIMATION_CONFIG);
    if (!isLoading) {
      textAnimation.value = withSpring(1);
    }
  }, [activeAnimation, textAnimation, isLoading]);

  const handlePressIn = useCallback(() => {
    if (disabled || isLoading) return;
    showActive();
  }, [disabled, isLoading, showActive]);

  const handlePressOut = useCallback(() => {
    if (disabled || isLoading) return;
    hideActive();
  }, [disabled, isLoading, hideActive]);

  const handlePress = useCallback(async () => {
    if (disabled || isLoading || !onPress) return;
    hideActive();
    if (spinner) {
      showSpinner();
    }
    try {
      await onPress();
    } catch (error) {
      console.log(error);
    }
    if (spinner) {
      hideSpinner();
    }
  }, [
    disabled,
    isLoading,
    onPress,
    spinner,
    hideActive,
    showSpinner,
    hideSpinner,
  ]);

  const renderContent = useMemo(() => {
    const title = (
      <Font
        font={font}
        color={textColor}
        numberOfLines={1}
        adjustsFontSizeToFit={fit}>
        {text}
      </Font>
    );

    const iconComponent =
      typeof icon === 'function'
        ? icon(ThemedStyles.theme === 1 ? 'Black' : 'White')
        : icon;

    if (iconOnly) {
      return iconComponent;
    } else if (icon) {
      return (
        <Row align="centerStart">
          {!reversedIcon && icon ? (
            <Spacer right="XS">{iconComponent}</Spacer>
          ) : null}
          {title}
          {reversedIcon && icon ? (
            <Spacer right="XS">{iconComponent}</Spacer>
          ) : null}
        </Row>
      );
    } else {
      return title;
    }
  }, [Font, font, textColor, fit, text, icon, iconOnly, reversedIcon]);

  const animatedOverlayStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scaleAnimation.value }],
  }));

  const animatedActiveStyle = useAnimatedStyle(() => ({
    opacity: activeAnimation.value,
  }));

  const animatedTextStyle = useAnimatedStyle(() => ({
    transform: [{ scale: textAnimation.value }],
    opacity: textOpacity.value,
  }));

  const animatedSpinnerProps = useAnimatedProps(() => ({
    color: spinnerColor,
  }));

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      style={stretch ? styles.stretch : styles[align]}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      disabled={disabled || isLoading}
      {...pressableProps}>
      <View style={containerStyle}>
        <View style={overlayStyle}>
          {spinner && (
            <Animated.View style={animatedOverlayStyle}>
              <AnimatedActivityIndicator
                animatedProps={animatedSpinnerProps}
                size="small"
                style={styles[`spinner_${size}`]}
              />
            </Animated.View>
          )}
        </View>
        <Animated.View
          style={[animatedActiveStyle, styles[`active_${mode}`]]}
        />
        {darkContent && <View style={styles.darken} />}
        {lightContent && <View style={styles.lighten} />}
        <Animated.View style={animatedTextStyle} layout={Layout.springify()}>
          {renderContent}
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
  lighten: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: TRANSPARENCY.LIGHTEN50,
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
  pill: {
    ...COMMON_BUTTON_STYLES.PILL,
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
