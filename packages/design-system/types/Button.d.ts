import React from 'react';
import { GetProps, TamaguiElement, ThemeableProps } from '@tamagui/core';
import { TextParentStyles } from '@tamagui/text';
import { FunctionComponent } from 'react';
type ButtonIconProps = {
  color?: string;
  size?: number;
};
type IconProp = JSX.Element | FunctionComponent<ButtonIconProps> | null;
export type ButtonProps = Omit<TextParentStyles, 'TextComponent'> &
  GetProps<typeof ButtonFrame> &
  ThemeableProps & {
    /**
     * add icon before, passes color and size automatically if Component
     */
    icon?: IconProp;
    /**
     * add icon after, passes color and size automatically if Component
     */
    iconAfter?: IconProp;
    /**
     * adjust icon relative to size
     */
    /**
     * default: -1
     */
    scaleIcon?: number;
    /**
     * make the spacing elements flex
     */
    spaceFlex?: number | boolean;
    /**
     * adjust internal space relative to icon size
     */
    scaleSpace?: number;
  };
export declare const ButtonFrame: import('@tamagui/core').TamaguiComponent<
  Omit<import('react-native').ViewProps, 'display' | 'children'> &
    import('@tamagui/core').RNWViewProps &
    import('@tamagui/core').TamaguiComponentPropsBase &
    import('@tamagui/core').WithThemeValues<
      import('@tamagui/core').StackStylePropsBase
    > &
    import('@tamagui/core').WithShorthands<
      import('@tamagui/core').WithThemeValues<
        import('@tamagui/core').StackStylePropsBase
      >
    > &
    Omit<
      {
        readonly fullscreen?: boolean | undefined;
        readonly elevation?: import('@tamagui/core').SizeTokens | undefined;
      } & {
        readonly fontFamily?: unknown;
        readonly backgrounded?: boolean | undefined;
        readonly radiused?: boolean | undefined;
        readonly hoverTheme?: boolean | undefined;
        readonly pressTheme?: boolean | undefined;
        readonly focusTheme?: boolean | undefined;
        readonly circular?: boolean | undefined;
        readonly padded?: boolean | undefined;
        readonly elevate?: boolean | undefined;
        readonly bordered?: number | boolean | undefined;
        readonly transparent?: boolean | undefined;
        readonly chromeless?: boolean | 'all' | undefined;
      },
      'disabled' | 'size' | 'active'
    > & {
      readonly size?: import('@tamagui/core').SizeTokens | undefined;
      readonly active?: boolean | undefined;
      readonly disabled?: boolean | undefined;
    } & import('@tamagui/core').MediaProps<
      Partial<
        Omit<import('react-native').ViewProps, 'display' | 'children'> &
          import('@tamagui/core').RNWViewProps &
          import('@tamagui/core').TamaguiComponentPropsBase &
          import('@tamagui/core').WithThemeValues<
            import('@tamagui/core').StackStylePropsBase
          > &
          import('@tamagui/core').WithShorthands<
            import('@tamagui/core').WithThemeValues<
              import('@tamagui/core').StackStylePropsBase
            >
          > &
          Omit<
            {
              readonly fullscreen?: boolean | undefined;
              readonly elevation?:
                | import('@tamagui/core').SizeTokens
                | undefined;
            } & {
              readonly fontFamily?: unknown;
              readonly backgrounded?: boolean | undefined;
              readonly radiused?: boolean | undefined;
              readonly hoverTheme?: boolean | undefined;
              readonly pressTheme?: boolean | undefined;
              readonly focusTheme?: boolean | undefined;
              readonly circular?: boolean | undefined;
              readonly padded?: boolean | undefined;
              readonly elevate?: boolean | undefined;
              readonly bordered?: number | boolean | undefined;
              readonly transparent?: boolean | undefined;
              readonly chromeless?: boolean | 'all' | undefined;
            },
            'disabled' | 'size' | 'active'
          > & {
            readonly size?: import('@tamagui/core').SizeTokens | undefined;
            readonly active?: boolean | undefined;
            readonly disabled?: boolean | undefined;
          }
      >
    > &
    import('@tamagui/core').PseudoProps<
      Partial<
        Omit<import('react-native').ViewProps, 'display' | 'children'> &
          import('@tamagui/core').RNWViewProps &
          import('@tamagui/core').TamaguiComponentPropsBase &
          import('@tamagui/core').WithThemeValues<
            import('@tamagui/core').StackStylePropsBase
          > &
          import('@tamagui/core').WithShorthands<
            import('@tamagui/core').WithThemeValues<
              import('@tamagui/core').StackStylePropsBase
            >
          > &
          Omit<
            {
              readonly fullscreen?: boolean | undefined;
              readonly elevation?:
                | import('@tamagui/core').SizeTokens
                | undefined;
            } & {
              readonly fontFamily?: unknown;
              readonly backgrounded?: boolean | undefined;
              readonly radiused?: boolean | undefined;
              readonly hoverTheme?: boolean | undefined;
              readonly pressTheme?: boolean | undefined;
              readonly focusTheme?: boolean | undefined;
              readonly circular?: boolean | undefined;
              readonly padded?: boolean | undefined;
              readonly elevate?: boolean | undefined;
              readonly bordered?: number | boolean | undefined;
              readonly transparent?: boolean | undefined;
              readonly chromeless?: boolean | 'all' | undefined;
            },
            'disabled' | 'size' | 'active'
          > & {
            readonly size?: import('@tamagui/core').SizeTokens | undefined;
            readonly active?: boolean | undefined;
            readonly disabled?: boolean | undefined;
          }
      >
    >,
  TamaguiElement,
  import('@tamagui/core').StackPropsBase,
  {
    readonly fullscreen?: boolean | undefined;
    readonly elevation?: import('@tamagui/core').SizeTokens | undefined;
  } & {
    readonly fontFamily?: unknown;
    readonly backgrounded?: boolean | undefined;
    readonly radiused?: boolean | undefined;
    readonly hoverTheme?: boolean | undefined;
    readonly pressTheme?: boolean | undefined;
    readonly focusTheme?: boolean | undefined;
    readonly circular?: boolean | undefined;
    readonly padded?: boolean | undefined;
    readonly elevate?: boolean | undefined;
    readonly bordered?: number | boolean | undefined;
    readonly transparent?: boolean | undefined;
    readonly chromeless?: boolean | 'all' | undefined;
  } & {
    readonly size?: import('@tamagui/core').SizeTokens | undefined;
    readonly active?: boolean | undefined;
    readonly disabled?: boolean | undefined;
  }
>;
export declare const ButtonText: import('@tamagui/core').TamaguiComponent<
  | (Omit<import('react-native').TextProps, 'children'> &
      import('@tamagui/core').RNWTextProps &
      import('@tamagui/core').TamaguiComponentPropsBase &
      import('@tamagui/core').WithThemeValues<
        import('@tamagui/core').TextStylePropsBase
      > &
      import('@tamagui/core').WithShorthands<
        import('@tamagui/core').WithThemeValues<
          import('@tamagui/core').TextStylePropsBase
        >
      > &
      Omit<{}, 'size'> & {
        readonly size?: import('@tamagui/core').FontSizeTokens | undefined;
      } & import('@tamagui/core').MediaProps<
        Partial<
          Omit<import('react-native').TextProps, 'children'> &
            import('@tamagui/core').RNWTextProps &
            import('@tamagui/core').TamaguiComponentPropsBase &
            import('@tamagui/core').WithThemeValues<
              import('@tamagui/core').TextStylePropsBase
            > &
            import('@tamagui/core').WithShorthands<
              import('@tamagui/core').WithThemeValues<
                import('@tamagui/core').TextStylePropsBase
              >
            > &
            Omit<{}, 'size'> & {
              readonly size?:
                | import('@tamagui/core').FontSizeTokens
                | undefined;
            }
        >
      > &
      import('@tamagui/core').PseudoProps<
        Partial<
          Omit<import('react-native').TextProps, 'children'> &
            import('@tamagui/core').RNWTextProps &
            import('@tamagui/core').TamaguiComponentPropsBase &
            import('@tamagui/core').WithThemeValues<
              import('@tamagui/core').TextStylePropsBase
            > &
            import('@tamagui/core').WithShorthands<
              import('@tamagui/core').WithThemeValues<
                import('@tamagui/core').TextStylePropsBase
              >
            > &
            Omit<{}, 'size'> & {
              readonly size?:
                | import('@tamagui/core').FontSizeTokens
                | undefined;
            }
        >
      >)
  | (Omit<import('react-native').TextProps, 'children'> &
      import('@tamagui/core').RNWTextProps &
      import('@tamagui/core').TamaguiComponentPropsBase &
      import('@tamagui/core').WithThemeValues<
        import('@tamagui/core').TextStylePropsBase
      > &
      import('@tamagui/core').WithShorthands<
        import('@tamagui/core').WithThemeValues<
          import('@tamagui/core').TextStylePropsBase
        >
      > &
      Omit<
        {
          readonly size?: import('@tamagui/core').FontSizeTokens | undefined;
        },
        string | number
      > & {
        [x: string]: undefined;
      } & import('@tamagui/core').MediaProps<
        Partial<
          Omit<import('react-native').TextProps, 'children'> &
            import('@tamagui/core').RNWTextProps &
            import('@tamagui/core').TamaguiComponentPropsBase &
            import('@tamagui/core').WithThemeValues<
              import('@tamagui/core').TextStylePropsBase
            > &
            import('@tamagui/core').WithShorthands<
              import('@tamagui/core').WithThemeValues<
                import('@tamagui/core').TextStylePropsBase
              >
            > &
            Omit<
              {
                readonly size?:
                  | import('@tamagui/core').FontSizeTokens
                  | undefined;
              },
              string | number
            > & {
              [x: string]: undefined;
            }
        >
      > &
      import('@tamagui/core').PseudoProps<
        Partial<
          Omit<import('react-native').TextProps, 'children'> &
            import('@tamagui/core').RNWTextProps &
            import('@tamagui/core').TamaguiComponentPropsBase &
            import('@tamagui/core').WithThemeValues<
              import('@tamagui/core').TextStylePropsBase
            > &
            import('@tamagui/core').WithShorthands<
              import('@tamagui/core').WithThemeValues<
                import('@tamagui/core').TextStylePropsBase
              >
            > &
            Omit<
              {
                readonly size?:
                  | import('@tamagui/core').FontSizeTokens
                  | undefined;
              },
              string | number
            > & {
              [x: string]: undefined;
            }
        >
      >),
  TamaguiElement,
  import('@tamagui/core').TextPropsBase,
  | {
      readonly size?: import('@tamagui/core').FontSizeTokens | undefined;
    }
  | ({
      readonly size?: import('@tamagui/core').FontSizeTokens | undefined;
    } & {
      [x: string]: undefined;
    })
>;
export declare function useButton(
  props: ButtonProps,
  {
    Text,
  }?: {
    Text: any;
  },
): {
  spaceSize: number;
  isNested: boolean;
  props: {
    children: {} | null | undefined;
    hitSlop?:
      | import('react-native').Insets
      | (import('react-native').Insets & number)
      | undefined;
    onLayout?:
      | ((event: import('react-native').LayoutChangeEvent) => void)
      | undefined;
    pointerEvents?: 'none' | 'box-none' | 'box-only' | 'auto' | undefined;
    removeClippedSubviews?: boolean | undefined;
    style?: import('react-native').StyleProp<import('react-native').ViewStyle>;
    testID?: string | undefined;
    nativeID?: string | undefined;
    collapsable?: boolean | undefined;
    needsOffscreenAlphaCompositing?: boolean | undefined;
    renderToHardwareTextureAndroid?: boolean | undefined;
    focusable?: boolean | undefined;
    shouldRasterizeIOS?: boolean | undefined;
    isTVSelectable?: boolean | undefined;
    hasTVPreferredFocus?: boolean | undefined;
    tvParallaxProperties?:
      | import('react-native').TVParallaxProperties
      | undefined;
    tvParallaxShiftDistanceX?: number | undefined;
    tvParallaxShiftDistanceY?: number | undefined;
    tvParallaxTiltAngle?: number | undefined;
    tvParallaxMagnification?: number | undefined;
    onStartShouldSetResponder?:
      | ((event: import('react-native').GestureResponderEvent) => boolean)
      | undefined;
    onMoveShouldSetResponder?:
      | ((event: import('react-native').GestureResponderEvent) => boolean)
      | undefined;
    onResponderEnd?:
      | ((event: import('react-native').GestureResponderEvent) => void)
      | undefined;
    onResponderGrant?:
      | ((event: import('react-native').GestureResponderEvent) => void)
      | undefined;
    onResponderReject?:
      | ((event: import('react-native').GestureResponderEvent) => void)
      | undefined;
    onResponderMove?:
      | ((event: import('react-native').GestureResponderEvent) => void)
      | undefined;
    onResponderRelease?:
      | ((event: import('react-native').GestureResponderEvent) => void)
      | undefined;
    onResponderStart?:
      | ((event: import('react-native').GestureResponderEvent) => void)
      | undefined;
    onResponderTerminationRequest?:
      | ((event: import('react-native').GestureResponderEvent) => boolean)
      | undefined;
    onResponderTerminate?:
      | ((event: import('react-native').GestureResponderEvent) => void)
      | undefined;
    onStartShouldSetResponderCapture?:
      | ((event: import('react-native').GestureResponderEvent) => boolean)
      | undefined;
    onMoveShouldSetResponderCapture?:
      | ((event: import('react-native').GestureResponderEvent) => boolean)
      | undefined;
    onTouchStart?:
      | ((event: import('react-native').GestureResponderEvent) => void)
      | undefined;
    onTouchMove?:
      | ((event: import('react-native').GestureResponderEvent) => void)
      | undefined;
    onTouchEnd?:
      | ((event: import('react-native').GestureResponderEvent) => void)
      | undefined;
    onTouchCancel?:
      | ((event: import('react-native').GestureResponderEvent) => void)
      | undefined;
    onTouchEndCapture?:
      | ((event: import('react-native').GestureResponderEvent) => void)
      | undefined;
    accessible?: boolean | undefined;
    accessibilityActions?:
      | readonly Readonly<{
          name: string;
          label?: string | undefined;
        }>[]
      | undefined;
    accessibilityLabel?: string | undefined;
    accessibilityRole?:
      | 'none'
      | 'button'
      | 'link'
      | 'search'
      | 'image'
      | 'keyboardkey'
      | 'text'
      | 'adjustable'
      | 'imagebutton'
      | 'header'
      | 'summary'
      | 'list'
      | undefined;
    accessibilityState?: import('react-native').AccessibilityState | undefined;
    accessibilityHint?: string | undefined;
    accessibilityValue?: import('react-native').AccessibilityValue | undefined;
    onAccessibilityAction?:
      | ((event: import('react-native').AccessibilityActionEvent) => void)
      | undefined;
    accessibilityLiveRegion?: 'none' | 'polite' | 'assertive' | undefined;
    importantForAccessibility?:
      | 'auto'
      | 'yes'
      | 'no'
      | 'no-hide-descendants'
      | undefined;
    accessibilityElementsHidden?: boolean | undefined;
    accessibilityViewIsModal?: boolean | undefined;
    onAccessibilityEscape?: (() => void) | undefined;
    onAccessibilityTap?: (() => void) | undefined;
    onMagicTap?: (() => void) | undefined;
    accessibilityIgnoresInvertColors?: boolean | undefined;
    dataSet?: any;
    target?: any;
    rel?: any;
    download?: any;
    href?: string | undefined;
    hrefAttrs?:
      | {
          target?:
            | 'top'
            | '_blank'
            | '_self'
            | '_top'
            | 'blank'
            | 'self'
            | undefined;
          rel?: string | undefined;
          download?: boolean | undefined;
        }
      | undefined;
    onMouseDown?:
      | (((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void) &
          React.MouseEventHandler<HTMLDivElement>)
      | undefined;
    onMouseUp?:
      | ((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void)
      | undefined;
    onMouseEnter?:
      | (((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void) &
          React.MouseEventHandler<HTMLDivElement>)
      | undefined;
    onMouseLeave?:
      | (((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void) &
          React.MouseEventHandler<HTMLDivElement>)
      | undefined;
    onFocus?: ((event: React.FocusEvent<HTMLDivElement>) => void) | undefined;
    onScroll?:
      | ((event: React.UIEvent<HTMLDivElement, UIEvent>) => void)
      | undefined;
    onScrollShouldSetResponder?: unknown;
    onScrollShouldSetResponderCapture?: unknown;
    onSelectionChangeShouldSetResponder?: unknown;
    onSelectionChangeShouldSetResponderCapture?: unknown;
    asChild?: boolean | undefined;
    spaceDirection?: import('@tamagui/core').SpaceDirection | undefined;
    dangerouslySetInnerHTML?:
      | {
          __html: string;
        }
      | undefined;
    /**
     * default: -1
     */
    animation?: import('@tamagui/core').AnimationProp | undefined;
    animateOnly?: string[] | undefined;
    debug?: boolean | 'verbose' | undefined;
    disabled?: boolean | undefined;
    className?: string | undefined;
    themeShallow?: boolean | undefined;
    id?: string | undefined;
    tag?: string | undefined;
    componentName?: string | undefined;
    forceStyle?: 'hover' | 'press' | 'focus' | undefined;
    onHoverIn?: React.MouseEventHandler<HTMLDivElement> | undefined;
    onHoverOut?: React.MouseEventHandler<HTMLDivElement> | undefined;
    onPress?:
      | ((event: import('react-native').GestureResponderEvent) => void)
      | null
      | undefined;
    onPressIn?:
      | ((event: import('react-native').GestureResponderEvent) => void)
      | null
      | undefined;
    onPressOut?:
      | ((event: import('react-native').GestureResponderEvent) => void)
      | null
      | undefined;
    backgroundColor?:
      | import('@tamagui/core').ThemeValueFallback
      | import('@tamagui/core').ColorTokens
      | import('react-native').OpaqueColorValue
      | undefined;
    borderBottomColor?:
      | import('@tamagui/core').ThemeValueFallback
      | import('@tamagui/core').ColorTokens
      | import('react-native').OpaqueColorValue
      | undefined;
    borderBottomEndRadius?:
      | import('@tamagui/core').RadiusTokens
      | import('@tamagui/core').ThemeValueFallback
      | undefined;
    borderBottomLeftRadius?:
      | import('@tamagui/core').RadiusTokens
      | import('@tamagui/core').ThemeValueFallback
      | undefined;
    borderBottomRightRadius?:
      | import('@tamagui/core').RadiusTokens
      | import('@tamagui/core').ThemeValueFallback
      | undefined;
    borderBottomStartRadius?:
      | import('@tamagui/core').RadiusTokens
      | import('@tamagui/core').ThemeValueFallback
      | undefined;
    borderBottomWidth?:
      | import('@tamagui/core').ThemeValueFallback
      | import('@tamagui/core').SpaceTokens
      | undefined;
    borderColor?:
      | import('@tamagui/core').ThemeValueFallback
      | import('@tamagui/core').ColorTokens
      | import('react-native').OpaqueColorValue
      | undefined;
    borderEndColor?: import('react-native').ColorValue | undefined;
    borderLeftColor?:
      | import('@tamagui/core').ThemeValueFallback
      | import('@tamagui/core').ColorTokens
      | import('react-native').OpaqueColorValue
      | undefined;
    borderLeftWidth?:
      | import('@tamagui/core').ThemeValueFallback
      | import('@tamagui/core').SpaceTokens
      | undefined;
    borderRadius?:
      | import('@tamagui/core').RadiusTokens
      | import('@tamagui/core').ThemeValueFallback
      | undefined;
    borderRightColor?:
      | import('@tamagui/core').ThemeValueFallback
      | import('@tamagui/core').ColorTokens
      | import('react-native').OpaqueColorValue
      | undefined;
    borderRightWidth?:
      | import('@tamagui/core').ThemeValueFallback
      | import('@tamagui/core').SpaceTokens
      | undefined;
    borderStartColor?: import('react-native').ColorValue | undefined;
    borderStyle?: 'solid' | 'dotted' | 'dashed' | undefined;
    borderTopColor?:
      | import('@tamagui/core').ThemeValueFallback
      | import('@tamagui/core').ColorTokens
      | import('react-native').OpaqueColorValue
      | undefined;
    borderTopEndRadius?:
      | import('@tamagui/core').RadiusTokens
      | import('@tamagui/core').ThemeValueFallback
      | undefined;
    borderTopLeftRadius?:
      | import('@tamagui/core').RadiusTokens
      | import('@tamagui/core').ThemeValueFallback
      | undefined;
    borderTopRightRadius?:
      | import('@tamagui/core').RadiusTokens
      | import('@tamagui/core').ThemeValueFallback
      | undefined;
    borderTopStartRadius?:
      | import('@tamagui/core').RadiusTokens
      | import('@tamagui/core').ThemeValueFallback
      | undefined;
    borderTopWidth?:
      | import('@tamagui/core').ThemeValueFallback
      | import('@tamagui/core').SpaceTokens
      | undefined;
    borderWidth?:
      | import('@tamagui/core').ThemeValueFallback
      | import('@tamagui/core').SpaceTokens
      | undefined;
    opacity?: number | undefined;
    alignContent?:
      | 'center'
      | 'flex-start'
      | 'flex-end'
      | 'space-between'
      | 'space-around'
      | 'stretch'
      | undefined;
    alignItems?: import('react-native').FlexAlignType | undefined;
    alignSelf?: 'auto' | import('react-native').FlexAlignType | undefined;
    aspectRatio?: number | undefined;
    borderEndWidth?:
      | import('@tamagui/core').ThemeValueFallback
      | import('@tamagui/core').SpaceTokens
      | undefined;
    borderStartWidth?:
      | import('@tamagui/core').ThemeValueFallback
      | import('@tamagui/core').SpaceTokens
      | undefined;
    bottom?:
      | import('@tamagui/core').ThemeValueFallback
      | import('@tamagui/core').SpaceTokens
      | undefined;
    end?: string | number | undefined;
    flex?: number | undefined;
    flexBasis?: string | number | undefined;
    flexDirection?:
      | 'row'
      | 'column'
      | 'row-reverse'
      | 'column-reverse'
      | undefined;
    flexGrow?: number | undefined;
    flexShrink?: number | undefined;
    flexWrap?: 'nowrap' | 'wrap' | 'wrap-reverse' | undefined;
    height?:
      | import('@tamagui/core').SizeTokens
      | import('@tamagui/core').ThemeValueFallback
      | undefined;
    justifyContent?:
      | 'center'
      | 'flex-start'
      | 'flex-end'
      | 'space-between'
      | 'space-around'
      | 'space-evenly'
      | undefined;
    left?:
      | import('@tamagui/core').ThemeValueFallback
      | import('@tamagui/core').SpaceTokens
      | undefined;
    margin?:
      | import('@tamagui/core').ThemeValueFallback
      | import('@tamagui/core').SpaceTokens
      | undefined;
    marginBottom?:
      | import('@tamagui/core').ThemeValueFallback
      | import('@tamagui/core').SpaceTokens
      | undefined;
    marginEnd?:
      | import('@tamagui/core').ThemeValueFallback
      | import('@tamagui/core').SpaceTokens
      | undefined;
    marginHorizontal?:
      | import('@tamagui/core').ThemeValueFallback
      | import('@tamagui/core').SpaceTokens
      | undefined;
    marginLeft?:
      | import('@tamagui/core').ThemeValueFallback
      | import('@tamagui/core').SpaceTokens
      | undefined;
    marginRight?:
      | import('@tamagui/core').ThemeValueFallback
      | import('@tamagui/core').SpaceTokens
      | undefined;
    marginStart?:
      | import('@tamagui/core').ThemeValueFallback
      | import('@tamagui/core').SpaceTokens
      | undefined;
    marginTop?:
      | import('@tamagui/core').ThemeValueFallback
      | import('@tamagui/core').SpaceTokens
      | undefined;
    marginVertical?:
      | import('@tamagui/core').ThemeValueFallback
      | import('@tamagui/core').SpaceTokens
      | undefined;
    maxHeight?:
      | import('@tamagui/core').SizeTokens
      | import('@tamagui/core').ThemeValueFallback
      | undefined;
    maxWidth?:
      | import('@tamagui/core').SizeTokens
      | import('@tamagui/core').ThemeValueFallback
      | undefined;
    minHeight?:
      | import('@tamagui/core').SizeTokens
      | import('@tamagui/core').ThemeValueFallback
      | undefined;
    minWidth?:
      | import('@tamagui/core').SizeTokens
      | import('@tamagui/core').ThemeValueFallback
      | undefined;
    overflow?: 'visible' | 'hidden' | 'scroll' | undefined;
    padding?:
      | import('@tamagui/core').ThemeValueFallback
      | import('@tamagui/core').SpaceTokens
      | undefined;
    paddingBottom?:
      | import('@tamagui/core').ThemeValueFallback
      | import('@tamagui/core').SpaceTokens
      | undefined;
    paddingEnd?:
      | import('@tamagui/core').ThemeValueFallback
      | import('@tamagui/core').SpaceTokens
      | undefined;
    paddingHorizontal?:
      | import('@tamagui/core').ThemeValueFallback
      | import('@tamagui/core').SpaceTokens
      | undefined;
    paddingLeft?:
      | import('@tamagui/core').ThemeValueFallback
      | import('@tamagui/core').SpaceTokens
      | undefined;
    paddingRight?:
      | import('@tamagui/core').ThemeValueFallback
      | import('@tamagui/core').SpaceTokens
      | undefined;
    paddingStart?:
      | import('@tamagui/core').ThemeValueFallback
      | import('@tamagui/core').SpaceTokens
      | undefined;
    paddingTop?:
      | import('@tamagui/core').ThemeValueFallback
      | import('@tamagui/core').SpaceTokens
      | undefined;
    paddingVertical?:
      | import('@tamagui/core').ThemeValueFallback
      | import('@tamagui/core').SpaceTokens
      | undefined;
    position?: 'absolute' | 'relative' | undefined;
    right?:
      | import('@tamagui/core').ThemeValueFallback
      | import('@tamagui/core').SpaceTokens
      | undefined;
    start?: string | number | undefined;
    top?:
      | import('@tamagui/core').ThemeValueFallback
      | import('@tamagui/core').SpaceTokens
      | undefined;
    width?:
      | import('@tamagui/core').SizeTokens
      | import('@tamagui/core').ThemeValueFallback
      | undefined;
    zIndex?:
      | import('@tamagui/core').ThemeValueFallback
      | import('@tamagui/core').ZIndexTokens
      | undefined;
    direction?: 'inherit' | 'ltr' | 'rtl' | undefined;
    shadowColor?:
      | import('@tamagui/core').ThemeValueFallback
      | import('@tamagui/core').ColorTokens
      | import('react-native').OpaqueColorValue
      | undefined;
    shadowOffset?:
      | import('@tamagui/core').ThemeValueFallback
      | {
          width: import('@tamagui/core').SpaceTokens;
          height: import('@tamagui/core').SpaceTokens;
        }
      | {
          width: number;
          height: number;
        }
      | undefined;
    shadowOpacity?: number | undefined;
    shadowRadius?:
      | import('@tamagui/core').SizeTokens
      | import('@tamagui/core').ThemeValueFallback
      | undefined;
    transform?:
      | (
          | import('react-native').PerpectiveTransform
          | import('react-native').RotateTransform
          | import('react-native').RotateXTransform
          | import('react-native').RotateYTransform
          | import('react-native').RotateZTransform
          | import('react-native').ScaleTransform
          | import('react-native').ScaleXTransform
          | import('react-native').ScaleYTransform
          | import('react-native').TranslateXTransform
          | import('react-native').TranslateYTransform
          | import('react-native').SkewXTransform
          | import('react-native').SkewYTransform
          | import('react-native').MatrixTransform
        )[]
      | undefined;
    transformMatrix?: number[] | undefined;
    rotation?: number | undefined;
    scaleX?:
      | import('@tamagui/core').ThemeValueFallback
      | import('@tamagui/core').SpaceTokens
      | undefined;
    scaleY?:
      | import('@tamagui/core').ThemeValueFallback
      | import('@tamagui/core').SpaceTokens
      | undefined;
    translateX?: number | undefined;
    translateY?: number | undefined;
    x?:
      | import('@tamagui/core').ThemeValueFallback
      | import('@tamagui/core').SpaceTokens
      | undefined;
    y?:
      | import('@tamagui/core').ThemeValueFallback
      | import('@tamagui/core').SpaceTokens
      | undefined;
    perspective?: number | undefined;
    scale?:
      | import('@tamagui/core').ThemeValueFallback
      | import('@tamagui/core').SpaceTokens
      | undefined;
    skewX?: string | undefined;
    skewY?: string | undefined;
    matrix?: number[] | undefined;
    rotate?: string | undefined;
    rotateY?: string | undefined;
    rotateX?: string | undefined;
    rotateZ?: string | undefined;
    cursor?: import('csstype').Property.Cursor | undefined;
    contain?: import('csstype').Property.Contain | undefined;
    display?:
      | 'flex'
      | 'none'
      | 'inherit'
      | 'inline'
      | 'block'
      | 'contents'
      | 'inline-flex'
      | undefined;
    userSelect?: import('csstype').Property.UserSelect | undefined;
    outlineColor?: import('csstype').Property.OutlineColor | undefined;
    outlineStyle?: import('csstype').Property.OutlineStyle | undefined;
    outlineOffset?:
      | import('csstype').Property.OutlineOffset<0 | (string & {})>
      | undefined;
    outlineWidth?:
      | import('csstype').Property.OutlineWidth<0 | (string & {})>
      | undefined;
    ussel?: import('csstype').Property.UserSelect | null | undefined;
    cur?: import('csstype').Property.Cursor | null | undefined;
    pe?: 'none' | 'box-none' | 'box-only' | 'auto' | null | undefined;
    col?: undefined;
    ff?: undefined;
    fos?: undefined;
    fost?: undefined;
    fow?: undefined;
    ls?: undefined;
    lh?: undefined;
    ta?: undefined;
    tt?: undefined;
    ww?: undefined;
    ac?:
      | 'center'
      | 'flex-start'
      | 'flex-end'
      | 'space-between'
      | 'space-around'
      | 'stretch'
      | null
      | undefined;
    ai?: import('react-native').FlexAlignType | null | undefined;
    als?: 'auto' | import('react-native').FlexAlignType | null | undefined;
    b?:
      | import('@tamagui/core').ThemeValueFallback
      | import('@tamagui/core').SpaceTokens
      | null
      | undefined;
    bc?:
      | import('@tamagui/core').ThemeValueFallback
      | import('@tamagui/core').ColorTokens
      | import('react-native').OpaqueColorValue
      | null
      | undefined;
    bg?:
      | import('@tamagui/core').ThemeValueFallback
      | import('@tamagui/core').ColorTokens
      | import('react-native').OpaqueColorValue
      | null
      | undefined;
    bbc?:
      | import('@tamagui/core').ThemeValueFallback
      | import('@tamagui/core').ColorTokens
      | import('react-native').OpaqueColorValue
      | null
      | undefined;
    bblr?:
      | import('@tamagui/core').RadiusTokens
      | import('@tamagui/core').ThemeValueFallback
      | null
      | undefined;
    bbrr?:
      | import('@tamagui/core').RadiusTokens
      | import('@tamagui/core').ThemeValueFallback
      | null
      | undefined;
    bbw?:
      | import('@tamagui/core').ThemeValueFallback
      | import('@tamagui/core').SpaceTokens
      | null
      | undefined;
    blc?:
      | import('@tamagui/core').ThemeValueFallback
      | import('@tamagui/core').ColorTokens
      | import('react-native').OpaqueColorValue
      | null
      | undefined;
    blw?:
      | import('@tamagui/core').ThemeValueFallback
      | import('@tamagui/core').SpaceTokens
      | null
      | undefined;
    boc?:
      | import('@tamagui/core').ThemeValueFallback
      | import('@tamagui/core').ColorTokens
      | import('react-native').OpaqueColorValue
      | null
      | undefined;
    br?:
      | import('@tamagui/core').RadiusTokens
      | import('@tamagui/core').ThemeValueFallback
      | null
      | undefined;
    bs?: 'solid' | 'dotted' | 'dashed' | null | undefined;
    brw?:
      | import('@tamagui/core').ThemeValueFallback
      | import('@tamagui/core').SpaceTokens
      | null
      | undefined;
    brc?:
      | import('@tamagui/core').ThemeValueFallback
      | import('@tamagui/core').ColorTokens
      | import('react-native').OpaqueColorValue
      | null
      | undefined;
    btc?:
      | import('@tamagui/core').ThemeValueFallback
      | import('@tamagui/core').ColorTokens
      | import('react-native').OpaqueColorValue
      | null
      | undefined;
    btlr?:
      | import('@tamagui/core').RadiusTokens
      | import('@tamagui/core').ThemeValueFallback
      | null
      | undefined;
    btrr?:
      | import('@tamagui/core').RadiusTokens
      | import('@tamagui/core').ThemeValueFallback
      | null
      | undefined;
    btw?:
      | import('@tamagui/core').ThemeValueFallback
      | import('@tamagui/core').SpaceTokens
      | null
      | undefined;
    bw?:
      | import('@tamagui/core').ThemeValueFallback
      | import('@tamagui/core').SpaceTokens
      | null
      | undefined;
    dsp?:
      | 'flex'
      | 'none'
      | 'inherit'
      | 'inline'
      | 'block'
      | 'contents'
      | 'inline-flex'
      | null
      | undefined;
    f?: number | null | undefined;
    fb?: string | number | null | undefined;
    fd?: 'row' | 'column' | 'row-reverse' | 'column-reverse' | null | undefined;
    fg?: number | null | undefined;
    fs?: number | null | undefined;
    fw?: 'nowrap' | 'wrap' | 'wrap-reverse' | null | undefined;
    h?:
      | import('@tamagui/core').SizeTokens
      | import('@tamagui/core').ThemeValueFallback
      | null
      | undefined;
    jc?:
      | 'center'
      | 'flex-start'
      | 'flex-end'
      | 'space-between'
      | 'space-around'
      | 'space-evenly'
      | null
      | undefined;
    l?:
      | import('@tamagui/core').ThemeValueFallback
      | import('@tamagui/core').SpaceTokens
      | null
      | undefined;
    m?:
      | import('@tamagui/core').ThemeValueFallback
      | import('@tamagui/core').SpaceTokens
      | null
      | undefined;
    mah?:
      | import('@tamagui/core').SizeTokens
      | import('@tamagui/core').ThemeValueFallback
      | null
      | undefined;
    maw?:
      | import('@tamagui/core').SizeTokens
      | import('@tamagui/core').ThemeValueFallback
      | null
      | undefined;
    mb?:
      | import('@tamagui/core').ThemeValueFallback
      | import('@tamagui/core').SpaceTokens
      | null
      | undefined;
    mih?:
      | import('@tamagui/core').SizeTokens
      | import('@tamagui/core').ThemeValueFallback
      | null
      | undefined;
    miw?:
      | import('@tamagui/core').SizeTokens
      | import('@tamagui/core').ThemeValueFallback
      | null
      | undefined;
    ml?:
      | import('@tamagui/core').ThemeValueFallback
      | import('@tamagui/core').SpaceTokens
      | null
      | undefined;
    mr?:
      | import('@tamagui/core').ThemeValueFallback
      | import('@tamagui/core').SpaceTokens
      | null
      | undefined;
    mt?:
      | import('@tamagui/core').ThemeValueFallback
      | import('@tamagui/core').SpaceTokens
      | null
      | undefined;
    mx?:
      | import('@tamagui/core').ThemeValueFallback
      | import('@tamagui/core').SpaceTokens
      | null
      | undefined;
    my?:
      | import('@tamagui/core').ThemeValueFallback
      | import('@tamagui/core').SpaceTokens
      | null
      | undefined;
    o?: number | null | undefined;
    ov?: 'visible' | 'hidden' | 'scroll' | null | undefined;
    p?:
      | import('@tamagui/core').ThemeValueFallback
      | import('@tamagui/core').SpaceTokens
      | null
      | undefined;
    pb?:
      | import('@tamagui/core').ThemeValueFallback
      | import('@tamagui/core').SpaceTokens
      | null
      | undefined;
    pl?:
      | import('@tamagui/core').ThemeValueFallback
      | import('@tamagui/core').SpaceTokens
      | null
      | undefined;
    pos?: 'absolute' | 'relative' | null | undefined;
    pr?:
      | import('@tamagui/core').ThemeValueFallback
      | import('@tamagui/core').SpaceTokens
      | null
      | undefined;
    pt?:
      | import('@tamagui/core').ThemeValueFallback
      | import('@tamagui/core').SpaceTokens
      | null
      | undefined;
    px?:
      | import('@tamagui/core').ThemeValueFallback
      | import('@tamagui/core').SpaceTokens
      | null
      | undefined;
    py?:
      | import('@tamagui/core').ThemeValueFallback
      | import('@tamagui/core').SpaceTokens
      | null
      | undefined;
    r?:
      | import('@tamagui/core').ThemeValueFallback
      | import('@tamagui/core').SpaceTokens
      | null
      | undefined;
    shac?:
      | import('@tamagui/core').ThemeValueFallback
      | import('@tamagui/core').ColorTokens
      | import('react-native').OpaqueColorValue
      | null
      | undefined;
    shar?:
      | import('@tamagui/core').SizeTokens
      | import('@tamagui/core').ThemeValueFallback
      | null
      | undefined;
    shof?:
      | import('@tamagui/core').ThemeValueFallback
      | {
          width: import('@tamagui/core').SpaceTokens;
          height: import('@tamagui/core').SpaceTokens;
        }
      | {
          width: number;
          height: number;
        }
      | null
      | undefined;
    shop?: number | null | undefined;
    t?:
      | import('@tamagui/core').ThemeValueFallback
      | import('@tamagui/core').SpaceTokens
      | null
      | undefined;
    w?:
      | import('@tamagui/core').SizeTokens
      | import('@tamagui/core').ThemeValueFallback
      | null
      | undefined;
    zi?:
      | import('@tamagui/core').ThemeValueFallback
      | import('@tamagui/core').ZIndexTokens
      | null
      | undefined;
    elevation?: import('@tamagui/core').SizeTokens | undefined;
    hoverTheme?: boolean | undefined;
    pressTheme?: boolean | undefined;
    focusTheme?: boolean | undefined;
    circular?: boolean | undefined;
    elevate?: boolean | undefined;
    transparent?: boolean | undefined;
    bordered?: number | boolean | undefined;
    backgrounded?: boolean | undefined;
    radiused?: boolean | undefined;
    padded?: boolean | undefined;
    chromeless?: boolean | 'all' | undefined;
    fullscreen?: boolean | undefined;
    size?: import('@tamagui/core').SizeTokens | undefined;
    active?: boolean | undefined;
    $xs?:
      | Partial<
          Omit<import('react-native').ViewProps, 'display' | 'children'> &
            import('@tamagui/core').RNWViewProps &
            import('@tamagui/core').TamaguiComponentPropsBase &
            import('@tamagui/core').WithThemeValues<
              import('@tamagui/core').StackStylePropsBase
            > &
            import('@tamagui/core').WithShorthands<
              import('@tamagui/core').WithThemeValues<
                import('@tamagui/core').StackStylePropsBase
              >
            > &
            Omit<
              {
                readonly fullscreen?: boolean | undefined;
                readonly elevation?:
                  | import('@tamagui/core').SizeTokens
                  | undefined;
              } & {
                readonly fontFamily?: unknown;
                readonly backgrounded?: boolean | undefined;
                readonly radiused?: boolean | undefined;
                readonly hoverTheme?: boolean | undefined;
                readonly pressTheme?: boolean | undefined;
                readonly focusTheme?: boolean | undefined;
                readonly circular?: boolean | undefined;
                readonly padded?: boolean | undefined;
                readonly elevate?: boolean | undefined;
                readonly bordered?: number | boolean | undefined;
                readonly transparent?: boolean | undefined;
                readonly chromeless?: boolean | 'all' | undefined;
              },
              'disabled' | 'size' | 'active'
            > & {
              readonly size?: import('@tamagui/core').SizeTokens | undefined;
              readonly active?: boolean | undefined;
              readonly disabled?: boolean | undefined;
            }
        >
      | undefined;
    $sm?:
      | Partial<
          Omit<import('react-native').ViewProps, 'display' | 'children'> &
            import('@tamagui/core').RNWViewProps &
            import('@tamagui/core').TamaguiComponentPropsBase &
            import('@tamagui/core').WithThemeValues<
              import('@tamagui/core').StackStylePropsBase
            > &
            import('@tamagui/core').WithShorthands<
              import('@tamagui/core').WithThemeValues<
                import('@tamagui/core').StackStylePropsBase
              >
            > &
            Omit<
              {
                readonly fullscreen?: boolean | undefined;
                readonly elevation?:
                  | import('@tamagui/core').SizeTokens
                  | undefined;
              } & {
                readonly fontFamily?: unknown;
                readonly backgrounded?: boolean | undefined;
                readonly radiused?: boolean | undefined;
                readonly hoverTheme?: boolean | undefined;
                readonly pressTheme?: boolean | undefined;
                readonly focusTheme?: boolean | undefined;
                readonly circular?: boolean | undefined;
                readonly padded?: boolean | undefined;
                readonly elevate?: boolean | undefined;
                readonly bordered?: number | boolean | undefined;
                readonly transparent?: boolean | undefined;
                readonly chromeless?: boolean | 'all' | undefined;
              },
              'disabled' | 'size' | 'active'
            > & {
              readonly size?: import('@tamagui/core').SizeTokens | undefined;
              readonly active?: boolean | undefined;
              readonly disabled?: boolean | undefined;
            }
        >
      | undefined;
    $md?:
      | Partial<
          Omit<import('react-native').ViewProps, 'display' | 'children'> &
            import('@tamagui/core').RNWViewProps &
            import('@tamagui/core').TamaguiComponentPropsBase &
            import('@tamagui/core').WithThemeValues<
              import('@tamagui/core').StackStylePropsBase
            > &
            import('@tamagui/core').WithShorthands<
              import('@tamagui/core').WithThemeValues<
                import('@tamagui/core').StackStylePropsBase
              >
            > &
            Omit<
              {
                readonly fullscreen?: boolean | undefined;
                readonly elevation?:
                  | import('@tamagui/core').SizeTokens
                  | undefined;
              } & {
                readonly fontFamily?: unknown;
                readonly backgrounded?: boolean | undefined;
                readonly radiused?: boolean | undefined;
                readonly hoverTheme?: boolean | undefined;
                readonly pressTheme?: boolean | undefined;
                readonly focusTheme?: boolean | undefined;
                readonly circular?: boolean | undefined;
                readonly padded?: boolean | undefined;
                readonly elevate?: boolean | undefined;
                readonly bordered?: number | boolean | undefined;
                readonly transparent?: boolean | undefined;
                readonly chromeless?: boolean | 'all' | undefined;
              },
              'disabled' | 'size' | 'active'
            > & {
              readonly size?: import('@tamagui/core').SizeTokens | undefined;
              readonly active?: boolean | undefined;
              readonly disabled?: boolean | undefined;
            }
        >
      | undefined;
    $lg?:
      | Partial<
          Omit<import('react-native').ViewProps, 'display' | 'children'> &
            import('@tamagui/core').RNWViewProps &
            import('@tamagui/core').TamaguiComponentPropsBase &
            import('@tamagui/core').WithThemeValues<
              import('@tamagui/core').StackStylePropsBase
            > &
            import('@tamagui/core').WithShorthands<
              import('@tamagui/core').WithThemeValues<
                import('@tamagui/core').StackStylePropsBase
              >
            > &
            Omit<
              {
                readonly fullscreen?: boolean | undefined;
                readonly elevation?:
                  | import('@tamagui/core').SizeTokens
                  | undefined;
              } & {
                readonly fontFamily?: unknown;
                readonly backgrounded?: boolean | undefined;
                readonly radiused?: boolean | undefined;
                readonly hoverTheme?: boolean | undefined;
                readonly pressTheme?: boolean | undefined;
                readonly focusTheme?: boolean | undefined;
                readonly circular?: boolean | undefined;
                readonly padded?: boolean | undefined;
                readonly elevate?: boolean | undefined;
                readonly bordered?: number | boolean | undefined;
                readonly transparent?: boolean | undefined;
                readonly chromeless?: boolean | 'all' | undefined;
              },
              'disabled' | 'size' | 'active'
            > & {
              readonly size?: import('@tamagui/core').SizeTokens | undefined;
              readonly active?: boolean | undefined;
              readonly disabled?: boolean | undefined;
            }
        >
      | undefined;
    $xl?:
      | Partial<
          Omit<import('react-native').ViewProps, 'display' | 'children'> &
            import('@tamagui/core').RNWViewProps &
            import('@tamagui/core').TamaguiComponentPropsBase &
            import('@tamagui/core').WithThemeValues<
              import('@tamagui/core').StackStylePropsBase
            > &
            import('@tamagui/core').WithShorthands<
              import('@tamagui/core').WithThemeValues<
                import('@tamagui/core').StackStylePropsBase
              >
            > &
            Omit<
              {
                readonly fullscreen?: boolean | undefined;
                readonly elevation?:
                  | import('@tamagui/core').SizeTokens
                  | undefined;
              } & {
                readonly fontFamily?: unknown;
                readonly backgrounded?: boolean | undefined;
                readonly radiused?: boolean | undefined;
                readonly hoverTheme?: boolean | undefined;
                readonly pressTheme?: boolean | undefined;
                readonly focusTheme?: boolean | undefined;
                readonly circular?: boolean | undefined;
                readonly padded?: boolean | undefined;
                readonly elevate?: boolean | undefined;
                readonly bordered?: number | boolean | undefined;
                readonly transparent?: boolean | undefined;
                readonly chromeless?: boolean | 'all' | undefined;
              },
              'disabled' | 'size' | 'active'
            > & {
              readonly size?: import('@tamagui/core').SizeTokens | undefined;
              readonly active?: boolean | undefined;
              readonly disabled?: boolean | undefined;
            }
        >
      | undefined;
    $gtXs?:
      | Partial<
          Omit<import('react-native').ViewProps, 'display' | 'children'> &
            import('@tamagui/core').RNWViewProps &
            import('@tamagui/core').TamaguiComponentPropsBase &
            import('@tamagui/core').WithThemeValues<
              import('@tamagui/core').StackStylePropsBase
            > &
            import('@tamagui/core').WithShorthands<
              import('@tamagui/core').WithThemeValues<
                import('@tamagui/core').StackStylePropsBase
              >
            > &
            Omit<
              {
                readonly fullscreen?: boolean | undefined;
                readonly elevation?:
                  | import('@tamagui/core').SizeTokens
                  | undefined;
              } & {
                readonly fontFamily?: unknown;
                readonly backgrounded?: boolean | undefined;
                readonly radiused?: boolean | undefined;
                readonly hoverTheme?: boolean | undefined;
                readonly pressTheme?: boolean | undefined;
                readonly focusTheme?: boolean | undefined;
                readonly circular?: boolean | undefined;
                readonly padded?: boolean | undefined;
                readonly elevate?: boolean | undefined;
                readonly bordered?: number | boolean | undefined;
                readonly transparent?: boolean | undefined;
                readonly chromeless?: boolean | 'all' | undefined;
              },
              'disabled' | 'size' | 'active'
            > & {
              readonly size?: import('@tamagui/core').SizeTokens | undefined;
              readonly active?: boolean | undefined;
              readonly disabled?: boolean | undefined;
            }
        >
      | undefined;
    $gtSm?:
      | Partial<
          Omit<import('react-native').ViewProps, 'display' | 'children'> &
            import('@tamagui/core').RNWViewProps &
            import('@tamagui/core').TamaguiComponentPropsBase &
            import('@tamagui/core').WithThemeValues<
              import('@tamagui/core').StackStylePropsBase
            > &
            import('@tamagui/core').WithShorthands<
              import('@tamagui/core').WithThemeValues<
                import('@tamagui/core').StackStylePropsBase
              >
            > &
            Omit<
              {
                readonly fullscreen?: boolean | undefined;
                readonly elevation?:
                  | import('@tamagui/core').SizeTokens
                  | undefined;
              } & {
                readonly fontFamily?: unknown;
                readonly backgrounded?: boolean | undefined;
                readonly radiused?: boolean | undefined;
                readonly hoverTheme?: boolean | undefined;
                readonly pressTheme?: boolean | undefined;
                readonly focusTheme?: boolean | undefined;
                readonly circular?: boolean | undefined;
                readonly padded?: boolean | undefined;
                readonly elevate?: boolean | undefined;
                readonly bordered?: number | boolean | undefined;
                readonly transparent?: boolean | undefined;
                readonly chromeless?: boolean | 'all' | undefined;
              },
              'disabled' | 'size' | 'active'
            > & {
              readonly size?: import('@tamagui/core').SizeTokens | undefined;
              readonly active?: boolean | undefined;
              readonly disabled?: boolean | undefined;
            }
        >
      | undefined;
    $gtMd?:
      | Partial<
          Omit<import('react-native').ViewProps, 'display' | 'children'> &
            import('@tamagui/core').RNWViewProps &
            import('@tamagui/core').TamaguiComponentPropsBase &
            import('@tamagui/core').WithThemeValues<
              import('@tamagui/core').StackStylePropsBase
            > &
            import('@tamagui/core').WithShorthands<
              import('@tamagui/core').WithThemeValues<
                import('@tamagui/core').StackStylePropsBase
              >
            > &
            Omit<
              {
                readonly fullscreen?: boolean | undefined;
                readonly elevation?:
                  | import('@tamagui/core').SizeTokens
                  | undefined;
              } & {
                readonly fontFamily?: unknown;
                readonly backgrounded?: boolean | undefined;
                readonly radiused?: boolean | undefined;
                readonly hoverTheme?: boolean | undefined;
                readonly pressTheme?: boolean | undefined;
                readonly focusTheme?: boolean | undefined;
                readonly circular?: boolean | undefined;
                readonly padded?: boolean | undefined;
                readonly elevate?: boolean | undefined;
                readonly bordered?: number | boolean | undefined;
                readonly transparent?: boolean | undefined;
                readonly chromeless?: boolean | 'all' | undefined;
              },
              'disabled' | 'size' | 'active'
            > & {
              readonly size?: import('@tamagui/core').SizeTokens | undefined;
              readonly active?: boolean | undefined;
              readonly disabled?: boolean | undefined;
            }
        >
      | undefined;
    $gtLg?:
      | Partial<
          Omit<import('react-native').ViewProps, 'display' | 'children'> &
            import('@tamagui/core').RNWViewProps &
            import('@tamagui/core').TamaguiComponentPropsBase &
            import('@tamagui/core').WithThemeValues<
              import('@tamagui/core').StackStylePropsBase
            > &
            import('@tamagui/core').WithShorthands<
              import('@tamagui/core').WithThemeValues<
                import('@tamagui/core').StackStylePropsBase
              >
            > &
            Omit<
              {
                readonly fullscreen?: boolean | undefined;
                readonly elevation?:
                  | import('@tamagui/core').SizeTokens
                  | undefined;
              } & {
                readonly fontFamily?: unknown;
                readonly backgrounded?: boolean | undefined;
                readonly radiused?: boolean | undefined;
                readonly hoverTheme?: boolean | undefined;
                readonly pressTheme?: boolean | undefined;
                readonly focusTheme?: boolean | undefined;
                readonly circular?: boolean | undefined;
                readonly padded?: boolean | undefined;
                readonly elevate?: boolean | undefined;
                readonly bordered?: number | boolean | undefined;
                readonly transparent?: boolean | undefined;
                readonly chromeless?: boolean | 'all' | undefined;
              },
              'disabled' | 'size' | 'active'
            > & {
              readonly size?: import('@tamagui/core').SizeTokens | undefined;
              readonly active?: boolean | undefined;
              readonly disabled?: boolean | undefined;
            }
        >
      | undefined;
    $gtXl?:
      | Partial<
          Omit<import('react-native').ViewProps, 'display' | 'children'> &
            import('@tamagui/core').RNWViewProps &
            import('@tamagui/core').TamaguiComponentPropsBase &
            import('@tamagui/core').WithThemeValues<
              import('@tamagui/core').StackStylePropsBase
            > &
            import('@tamagui/core').WithShorthands<
              import('@tamagui/core').WithThemeValues<
                import('@tamagui/core').StackStylePropsBase
              >
            > &
            Omit<
              {
                readonly fullscreen?: boolean | undefined;
                readonly elevation?:
                  | import('@tamagui/core').SizeTokens
                  | undefined;
              } & {
                readonly fontFamily?: unknown;
                readonly backgrounded?: boolean | undefined;
                readonly radiused?: boolean | undefined;
                readonly hoverTheme?: boolean | undefined;
                readonly pressTheme?: boolean | undefined;
                readonly focusTheme?: boolean | undefined;
                readonly circular?: boolean | undefined;
                readonly padded?: boolean | undefined;
                readonly elevate?: boolean | undefined;
                readonly bordered?: number | boolean | undefined;
                readonly transparent?: boolean | undefined;
                readonly chromeless?: boolean | 'all' | undefined;
              },
              'disabled' | 'size' | 'active'
            > & {
              readonly size?: import('@tamagui/core').SizeTokens | undefined;
              readonly active?: boolean | undefined;
              readonly disabled?: boolean | undefined;
            }
        >
      | undefined;
    $short?:
      | Partial<
          Omit<import('react-native').ViewProps, 'display' | 'children'> &
            import('@tamagui/core').RNWViewProps &
            import('@tamagui/core').TamaguiComponentPropsBase &
            import('@tamagui/core').WithThemeValues<
              import('@tamagui/core').StackStylePropsBase
            > &
            import('@tamagui/core').WithShorthands<
              import('@tamagui/core').WithThemeValues<
                import('@tamagui/core').StackStylePropsBase
              >
            > &
            Omit<
              {
                readonly fullscreen?: boolean | undefined;
                readonly elevation?:
                  | import('@tamagui/core').SizeTokens
                  | undefined;
              } & {
                readonly fontFamily?: unknown;
                readonly backgrounded?: boolean | undefined;
                readonly radiused?: boolean | undefined;
                readonly hoverTheme?: boolean | undefined;
                readonly pressTheme?: boolean | undefined;
                readonly focusTheme?: boolean | undefined;
                readonly circular?: boolean | undefined;
                readonly padded?: boolean | undefined;
                readonly elevate?: boolean | undefined;
                readonly bordered?: number | boolean | undefined;
                readonly transparent?: boolean | undefined;
                readonly chromeless?: boolean | 'all' | undefined;
              },
              'disabled' | 'size' | 'active'
            > & {
              readonly size?: import('@tamagui/core').SizeTokens | undefined;
              readonly active?: boolean | undefined;
              readonly disabled?: boolean | undefined;
            }
        >
      | undefined;
    $tall?:
      | Partial<
          Omit<import('react-native').ViewProps, 'display' | 'children'> &
            import('@tamagui/core').RNWViewProps &
            import('@tamagui/core').TamaguiComponentPropsBase &
            import('@tamagui/core').WithThemeValues<
              import('@tamagui/core').StackStylePropsBase
            > &
            import('@tamagui/core').WithShorthands<
              import('@tamagui/core').WithThemeValues<
                import('@tamagui/core').StackStylePropsBase
              >
            > &
            Omit<
              {
                readonly fullscreen?: boolean | undefined;
                readonly elevation?:
                  | import('@tamagui/core').SizeTokens
                  | undefined;
              } & {
                readonly fontFamily?: unknown;
                readonly backgrounded?: boolean | undefined;
                readonly radiused?: boolean | undefined;
                readonly hoverTheme?: boolean | undefined;
                readonly pressTheme?: boolean | undefined;
                readonly focusTheme?: boolean | undefined;
                readonly circular?: boolean | undefined;
                readonly padded?: boolean | undefined;
                readonly elevate?: boolean | undefined;
                readonly bordered?: number | boolean | undefined;
                readonly transparent?: boolean | undefined;
                readonly chromeless?: boolean | 'all' | undefined;
              },
              'disabled' | 'size' | 'active'
            > & {
              readonly size?: import('@tamagui/core').SizeTokens | undefined;
              readonly active?: boolean | undefined;
              readonly disabled?: boolean | undefined;
            }
        >
      | undefined;
    $hoverNone?:
      | Partial<
          Omit<import('react-native').ViewProps, 'display' | 'children'> &
            import('@tamagui/core').RNWViewProps &
            import('@tamagui/core').TamaguiComponentPropsBase &
            import('@tamagui/core').WithThemeValues<
              import('@tamagui/core').StackStylePropsBase
            > &
            import('@tamagui/core').WithShorthands<
              import('@tamagui/core').WithThemeValues<
                import('@tamagui/core').StackStylePropsBase
              >
            > &
            Omit<
              {
                readonly fullscreen?: boolean | undefined;
                readonly elevation?:
                  | import('@tamagui/core').SizeTokens
                  | undefined;
              } & {
                readonly fontFamily?: unknown;
                readonly backgrounded?: boolean | undefined;
                readonly radiused?: boolean | undefined;
                readonly hoverTheme?: boolean | undefined;
                readonly pressTheme?: boolean | undefined;
                readonly focusTheme?: boolean | undefined;
                readonly circular?: boolean | undefined;
                readonly padded?: boolean | undefined;
                readonly elevate?: boolean | undefined;
                readonly bordered?: number | boolean | undefined;
                readonly transparent?: boolean | undefined;
                readonly chromeless?: boolean | 'all' | undefined;
              },
              'disabled' | 'size' | 'active'
            > & {
              readonly size?: import('@tamagui/core').SizeTokens | undefined;
              readonly active?: boolean | undefined;
              readonly disabled?: boolean | undefined;
            }
        >
      | undefined;
    $pointerCoarse?:
      | Partial<
          Omit<import('react-native').ViewProps, 'display' | 'children'> &
            import('@tamagui/core').RNWViewProps &
            import('@tamagui/core').TamaguiComponentPropsBase &
            import('@tamagui/core').WithThemeValues<
              import('@tamagui/core').StackStylePropsBase
            > &
            import('@tamagui/core').WithShorthands<
              import('@tamagui/core').WithThemeValues<
                import('@tamagui/core').StackStylePropsBase
              >
            > &
            Omit<
              {
                readonly fullscreen?: boolean | undefined;
                readonly elevation?:
                  | import('@tamagui/core').SizeTokens
                  | undefined;
              } & {
                readonly fontFamily?: unknown;
                readonly backgrounded?: boolean | undefined;
                readonly radiused?: boolean | undefined;
                readonly hoverTheme?: boolean | undefined;
                readonly pressTheme?: boolean | undefined;
                readonly focusTheme?: boolean | undefined;
                readonly circular?: boolean | undefined;
                readonly padded?: boolean | undefined;
                readonly elevate?: boolean | undefined;
                readonly bordered?: number | boolean | undefined;
                readonly transparent?: boolean | undefined;
                readonly chromeless?: boolean | 'all' | undefined;
              },
              'disabled' | 'size' | 'active'
            > & {
              readonly size?: import('@tamagui/core').SizeTokens | undefined;
              readonly active?: boolean | undefined;
              readonly disabled?: boolean | undefined;
            }
        >
      | undefined;
    hoverStyle?:
      | Partial<
          Omit<import('react-native').ViewProps, 'display' | 'children'> &
            import('@tamagui/core').RNWViewProps &
            import('@tamagui/core').TamaguiComponentPropsBase &
            import('@tamagui/core').WithThemeValues<
              import('@tamagui/core').StackStylePropsBase
            > &
            import('@tamagui/core').WithShorthands<
              import('@tamagui/core').WithThemeValues<
                import('@tamagui/core').StackStylePropsBase
              >
            > &
            Omit<
              {
                readonly fullscreen?: boolean | undefined;
                readonly elevation?:
                  | import('@tamagui/core').SizeTokens
                  | undefined;
              } & {
                readonly fontFamily?: unknown;
                readonly backgrounded?: boolean | undefined;
                readonly radiused?: boolean | undefined;
                readonly hoverTheme?: boolean | undefined;
                readonly pressTheme?: boolean | undefined;
                readonly focusTheme?: boolean | undefined;
                readonly circular?: boolean | undefined;
                readonly padded?: boolean | undefined;
                readonly elevate?: boolean | undefined;
                readonly bordered?: number | boolean | undefined;
                readonly transparent?: boolean | undefined;
                readonly chromeless?: boolean | 'all' | undefined;
              },
              'disabled' | 'size' | 'active'
            > & {
              readonly size?: import('@tamagui/core').SizeTokens | undefined;
              readonly active?: boolean | undefined;
              readonly disabled?: boolean | undefined;
            }
        >
      | null
      | undefined;
    pressStyle?:
      | Partial<
          Omit<import('react-native').ViewProps, 'display' | 'children'> &
            import('@tamagui/core').RNWViewProps &
            import('@tamagui/core').TamaguiComponentPropsBase &
            import('@tamagui/core').WithThemeValues<
              import('@tamagui/core').StackStylePropsBase
            > &
            import('@tamagui/core').WithShorthands<
              import('@tamagui/core').WithThemeValues<
                import('@tamagui/core').StackStylePropsBase
              >
            > &
            Omit<
              {
                readonly fullscreen?: boolean | undefined;
                readonly elevation?:
                  | import('@tamagui/core').SizeTokens
                  | undefined;
              } & {
                readonly fontFamily?: unknown;
                readonly backgrounded?: boolean | undefined;
                readonly radiused?: boolean | undefined;
                readonly hoverTheme?: boolean | undefined;
                readonly pressTheme?: boolean | undefined;
                readonly focusTheme?: boolean | undefined;
                readonly circular?: boolean | undefined;
                readonly padded?: boolean | undefined;
                readonly elevate?: boolean | undefined;
                readonly bordered?: number | boolean | undefined;
                readonly transparent?: boolean | undefined;
                readonly chromeless?: boolean | 'all' | undefined;
              },
              'disabled' | 'size' | 'active'
            > & {
              readonly size?: import('@tamagui/core').SizeTokens | undefined;
              readonly active?: boolean | undefined;
              readonly disabled?: boolean | undefined;
            }
        >
      | null
      | undefined;
    focusStyle?:
      | Partial<
          Omit<import('react-native').ViewProps, 'display' | 'children'> &
            import('@tamagui/core').RNWViewProps &
            import('@tamagui/core').TamaguiComponentPropsBase &
            import('@tamagui/core').WithThemeValues<
              import('@tamagui/core').StackStylePropsBase
            > &
            import('@tamagui/core').WithShorthands<
              import('@tamagui/core').WithThemeValues<
                import('@tamagui/core').StackStylePropsBase
              >
            > &
            Omit<
              {
                readonly fullscreen?: boolean | undefined;
                readonly elevation?:
                  | import('@tamagui/core').SizeTokens
                  | undefined;
              } & {
                readonly fontFamily?: unknown;
                readonly backgrounded?: boolean | undefined;
                readonly radiused?: boolean | undefined;
                readonly hoverTheme?: boolean | undefined;
                readonly pressTheme?: boolean | undefined;
                readonly focusTheme?: boolean | undefined;
                readonly circular?: boolean | undefined;
                readonly padded?: boolean | undefined;
                readonly elevate?: boolean | undefined;
                readonly bordered?: number | boolean | undefined;
                readonly transparent?: boolean | undefined;
                readonly chromeless?: boolean | 'all' | undefined;
              },
              'disabled' | 'size' | 'active'
            > & {
              readonly size?: import('@tamagui/core').SizeTokens | undefined;
              readonly active?: boolean | undefined;
              readonly disabled?: boolean | undefined;
            }
        >
      | null
      | undefined;
    exitStyle?:
      | Partial<
          Omit<import('react-native').ViewProps, 'display' | 'children'> &
            import('@tamagui/core').RNWViewProps &
            import('@tamagui/core').TamaguiComponentPropsBase &
            import('@tamagui/core').WithThemeValues<
              import('@tamagui/core').StackStylePropsBase
            > &
            import('@tamagui/core').WithShorthands<
              import('@tamagui/core').WithThemeValues<
                import('@tamagui/core').StackStylePropsBase
              >
            > &
            Omit<
              {
                readonly fullscreen?: boolean | undefined;
                readonly elevation?:
                  | import('@tamagui/core').SizeTokens
                  | undefined;
              } & {
                readonly fontFamily?: unknown;
                readonly backgrounded?: boolean | undefined;
                readonly radiused?: boolean | undefined;
                readonly hoverTheme?: boolean | undefined;
                readonly pressTheme?: boolean | undefined;
                readonly focusTheme?: boolean | undefined;
                readonly circular?: boolean | undefined;
                readonly padded?: boolean | undefined;
                readonly elevate?: boolean | undefined;
                readonly bordered?: number | boolean | undefined;
                readonly transparent?: boolean | undefined;
                readonly chromeless?: boolean | 'all' | undefined;
              },
              'disabled' | 'size' | 'active'
            > & {
              readonly size?: import('@tamagui/core').SizeTokens | undefined;
              readonly active?: boolean | undefined;
              readonly disabled?: boolean | undefined;
            }
        >
      | null
      | undefined;
    enterStyle?:
      | Partial<
          Omit<import('react-native').ViewProps, 'display' | 'children'> &
            import('@tamagui/core').RNWViewProps &
            import('@tamagui/core').TamaguiComponentPropsBase &
            import('@tamagui/core').WithThemeValues<
              import('@tamagui/core').StackStylePropsBase
            > &
            import('@tamagui/core').WithShorthands<
              import('@tamagui/core').WithThemeValues<
                import('@tamagui/core').StackStylePropsBase
              >
            > &
            Omit<
              {
                readonly fullscreen?: boolean | undefined;
                readonly elevation?:
                  | import('@tamagui/core').SizeTokens
                  | undefined;
              } & {
                readonly fontFamily?: unknown;
                readonly backgrounded?: boolean | undefined;
                readonly radiused?: boolean | undefined;
                readonly hoverTheme?: boolean | undefined;
                readonly pressTheme?: boolean | undefined;
                readonly focusTheme?: boolean | undefined;
                readonly circular?: boolean | undefined;
                readonly padded?: boolean | undefined;
                readonly elevate?: boolean | undefined;
                readonly bordered?: number | boolean | undefined;
                readonly transparent?: boolean | undefined;
                readonly chromeless?: boolean | 'all' | undefined;
              },
              'disabled' | 'size' | 'active'
            > & {
              readonly size?: import('@tamagui/core').SizeTokens | undefined;
              readonly active?: boolean | undefined;
              readonly disabled?: boolean | undefined;
            }
        >
      | null
      | undefined;
    themeInverse?: boolean | undefined;
    reset?: boolean | undefined;
  };
};
export declare const buttonStaticConfig: {
  inlineProps: Set<string>;
};
export declare const Button: (
  props: Omit<
    Omit<TextParentStyles, 'TextComponent'> &
      Omit<import('react-native').ViewProps, 'display' | 'children'> &
      import('@tamagui/core').RNWViewProps &
      import('@tamagui/core').TamaguiComponentPropsBase &
      import('@tamagui/core').WithThemeValues<
        import('@tamagui/core').StackStylePropsBase
      > &
      import('@tamagui/core').WithShorthands<
        import('@tamagui/core').WithThemeValues<
          import('@tamagui/core').StackStylePropsBase
        >
      > &
      Omit<
        {
          readonly fullscreen?: boolean | undefined;
          readonly elevation?: import('@tamagui/core').SizeTokens | undefined;
        } & {
          readonly fontFamily?: unknown;
          readonly backgrounded?: boolean | undefined;
          readonly radiused?: boolean | undefined;
          readonly hoverTheme?: boolean | undefined;
          readonly pressTheme?: boolean | undefined;
          readonly focusTheme?: boolean | undefined;
          readonly circular?: boolean | undefined;
          readonly padded?: boolean | undefined;
          readonly elevate?: boolean | undefined;
          readonly bordered?: number | boolean | undefined;
          readonly transparent?: boolean | undefined;
          readonly chromeless?: boolean | 'all' | undefined;
        },
        'disabled' | 'size' | 'active'
      > & {
        readonly size?: import('@tamagui/core').SizeTokens | undefined;
        readonly active?: boolean | undefined;
        readonly disabled?: boolean | undefined;
      } & import('@tamagui/core').MediaProps<
        Partial<
          Omit<import('react-native').ViewProps, 'display' | 'children'> &
            import('@tamagui/core').RNWViewProps &
            import('@tamagui/core').TamaguiComponentPropsBase &
            import('@tamagui/core').WithThemeValues<
              import('@tamagui/core').StackStylePropsBase
            > &
            import('@tamagui/core').WithShorthands<
              import('@tamagui/core').WithThemeValues<
                import('@tamagui/core').StackStylePropsBase
              >
            > &
            Omit<
              {
                readonly fullscreen?: boolean | undefined;
                readonly elevation?:
                  | import('@tamagui/core').SizeTokens
                  | undefined;
              } & {
                readonly fontFamily?: unknown;
                readonly backgrounded?: boolean | undefined;
                readonly radiused?: boolean | undefined;
                readonly hoverTheme?: boolean | undefined;
                readonly pressTheme?: boolean | undefined;
                readonly focusTheme?: boolean | undefined;
                readonly circular?: boolean | undefined;
                readonly padded?: boolean | undefined;
                readonly elevate?: boolean | undefined;
                readonly bordered?: number | boolean | undefined;
                readonly transparent?: boolean | undefined;
                readonly chromeless?: boolean | 'all' | undefined;
              },
              'disabled' | 'size' | 'active'
            > & {
              readonly size?: import('@tamagui/core').SizeTokens | undefined;
              readonly active?: boolean | undefined;
              readonly disabled?: boolean | undefined;
            }
        >
      > &
      import('@tamagui/core').PseudoProps<
        Partial<
          Omit<import('react-native').ViewProps, 'display' | 'children'> &
            import('@tamagui/core').RNWViewProps &
            import('@tamagui/core').TamaguiComponentPropsBase &
            import('@tamagui/core').WithThemeValues<
              import('@tamagui/core').StackStylePropsBase
            > &
            import('@tamagui/core').WithShorthands<
              import('@tamagui/core').WithThemeValues<
                import('@tamagui/core').StackStylePropsBase
              >
            > &
            Omit<
              {
                readonly fullscreen?: boolean | undefined;
                readonly elevation?:
                  | import('@tamagui/core').SizeTokens
                  | undefined;
              } & {
                readonly fontFamily?: unknown;
                readonly backgrounded?: boolean | undefined;
                readonly radiused?: boolean | undefined;
                readonly hoverTheme?: boolean | undefined;
                readonly pressTheme?: boolean | undefined;
                readonly focusTheme?: boolean | undefined;
                readonly circular?: boolean | undefined;
                readonly padded?: boolean | undefined;
                readonly elevate?: boolean | undefined;
                readonly bordered?: number | boolean | undefined;
                readonly transparent?: boolean | undefined;
                readonly chromeless?: boolean | 'all' | undefined;
              },
              'disabled' | 'size' | 'active'
            > & {
              readonly size?: import('@tamagui/core').SizeTokens | undefined;
              readonly active?: boolean | undefined;
              readonly disabled?: boolean | undefined;
            }
        >
      > &
      ThemeableProps & {
        /**
         * add icon before, passes color and size automatically if Component
         */
        icon?: IconProp | undefined;
        /**
         * add icon after, passes color and size automatically if Component
         */
        iconAfter?: IconProp | undefined;
        /**
         * adjust icon relative to size
         */
        /**
         * default: -1
         */
        scaleIcon?: number | undefined;
        /**
         * make the spacing elements flex
         */
        spaceFlex?: number | boolean | undefined;
        /**
         * adjust internal space relative to icon size
         */
        scaleSpace?: number | undefined;
      } & React.RefAttributes<TamaguiElement>,
    'theme' | 'themeInverse'
  > &
    ThemeableProps,
) => React.ReactElement<any, string | React.JSXElementConstructor<any>> | null;
export {};
//# sourceMappingURL=Button.d.ts.map
