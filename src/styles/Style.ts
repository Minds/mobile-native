import { StyleSheet, Platform } from 'react-native';
import sizes from './generators/sizes';
import borders from './generators/borders';
import colors from './generators/colors';
import spacing from './generators/spacing';
import ThemedStyles from './ThemedStyles';
import { DynamicStyles } from './types';
import type { ColorsType } from './Colors';
import typography from './generators/typography';

const dynamicStyleHandler = {
  get: function (target, name) {
    // if already exist we return it
    if (name in target) {
      return target[name];
    }

    // generate dynamic style
    const m =
      spacing(name) ||
      colors(name, ThemedStyles) ||
      typography(name, ThemedStyles) || // it must be after colors because it uses colors inside
      borders(name) ||
      sizes(name);

    if (m) {
      target[name] = m;
      return target[name];
    }
    if (__DEV__) {
      throw new Error(`Style not defined: ${name}`);
    }
    return null;
  },
};

const _buildStyle = (theme: ColorsType) =>
  ({
    // opacity
    opacity100: {
      opacity: 1,
    },
    opacity75: {
      opacity: 0.75,
    },
    opacity50: {
      opacity: 0.5,
    },
    opacity25: {
      opacity: 0.25,
    },
    opacity0: {
      opacity: 0,
    },
    // containers
    flexContainer: {
      flex: 1,
    },
    flexWrap: {
      flexWrap: 'wrap',
    },
    flexContainerCenter: {
      flex: 1,
      justifyContent: 'center',
    },
    flexColumn: {
      flex: 1,
      flexDirection: 'column',
    },
    justifyCenter: {
      justifyContent: 'center',
    },
    justifyEnd: {
      justifyContent: 'flex-end',
    },
    absoluteFill: StyleSheet.absoluteFillObject,
    columnAlignCenter: {
      alignItems: 'center',
      flexDirection: 'column',
    },
    flexColumnStretch: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'stretch',
    },
    flexColumnCentered: {
      flex: 1,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      alignContent: 'center',
    },
    rowJustifyEnd: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    rowJustifyCenter: {
      flexDirection: 'row',
      justifyContent: 'center',
    },
    rowJustifySpaceEvenly: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
    },
    rowJustifyStart: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
    },
    rowJustifySpaceBetween: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    rowStretch: {
      alignItems: 'stretch',
      flexDirection: 'row',
    },
    alignCenter: {
      alignItems: 'center',
    },
    alignEnd: {
      alignItems: 'flex-end',
    },
    alignSelfEnd: {
      alignSelf: 'flex-end',
    },
    alignSelfStart: {
      alignSelf: 'flex-start',
    },
    alignSelfCenter: {
      alignSelf: 'center',
    },
    alignSelfStretch: {
      alignSelf: 'stretch',
    },
    centered: {
      alignContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      justifyContent: 'center',
    },
    positionAbsolute: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    },
    positionAbsoluteTop: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
    },
    positionAbsoluteTopLeft: {
      position: 'absolute',
      top: 0,
      left: 0,
    },
    positionAbsoluteTopRight: {
      position: 'absolute',
      top: 0,
      right: 0,
    },
    positionAbsoluteBottom: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
    },
    positionAbsoluteBottomLeft: {
      position: 'absolute',
      bottom: 0,
      left: 0,
    },
    positionAbsoluteBottomRight: {
      position: 'absolute',
      bottom: 0,
      right: 0,
    },
    // fonts
    fontXS: {
      fontSize: 10,
    },
    fontS: {
      fontSize: 12,
    },
    fontM: {
      fontSize: 14,
    },
    fontL: {
      fontSize: 16,
    },
    fontLM: {
      fontSize: 17,
    },
    fontXL: {
      fontSize: 18,
    },
    fontXXL: {
      fontSize: 22,
    },
    fontXXXL: {
      fontSize: 28,
    },

    // text align
    textRight: {
      textAlign: 'right',
    },
    textLeft: {
      textAlign: 'left',
    },
    textCenter: {
      textAlign: 'center',
    },
    textJustify: {
      textAlign: 'justify',
    },

    fullWidth: {
      width: '100%',
    },

    halfWidth: {
      width: '50%',
    },

    fullHeight: {
      height: '100%',
    },

    halfHeight: {
      height: '50%',
    },
    // todo: replace by fontBold
    bold: {
      fontWeight: '700',
      fontFamily: 'Roboto-Black',
    },
    fontBold: {
      fontWeight: '700',
      fontFamily: 'Roboto-Black',
    },
    extraBold: {
      // fontWeight: '800'
      fontFamily: 'Roboto-Black', // workaround android ignoring >= 800
    },
    fontThin: {
      fontWeight: '200',
      fontFamily: 'Roboto-Thin',
    },
    fontHairline: {
      fontWeight: '100',
      fontFamily: 'Roboto-Thin',
    },
    fontLight: {
      fontWeight: '300',
      fontFamily: 'Roboto-Light',
    },
    fontNormal: {
      fontWeight: '400',
    },
    fontMedium: {
      fontWeight: '500',
      fontFamily: 'Roboto-Medium',
    },
    fontSemibold: {
      fontWeight: '600',
    },
    strikeThrough: {
      textDecorationLine: 'line-through',
      textDecorationStyle: 'solid',
    },

    // TODO: remove custom styles from here
    // onboarding
    onboardingTitle: {
      color: '#AEB0B8',
      fontSize: 13,
      lineHeight: 18,
      letterSpacing: 2,
    },
    onboardingSubtitle: {
      color: '#4A4A4A',
      fontSize: 26,
      lineHeight: 37,
      fontWeight: '600',
    },
    onboardingSteps: {
      color: '#A2A2A2',
      fontSize: 11,
      lineHeight: 15,
    },
    linkNew: {
      color: '#9B9B9B',
      fontSize: 13,
      lineHeight: 20,
    },
    mindsLayoutBody: {
      flex: 10,
      flexDirection: 'row',
      justifyContent: 'center',
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 10,
    },
    mindsLayoutFooter: {
      flex: 2,
      flexDirection: 'row',
      justifyContent: 'center',
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 20,
    },
    titleText: {
      fontFamily: 'Roboto',
      fontSize: Platform.select({ ios: 26, android: 24 }),
      fontWeight: '500',
      lineHeight: 44,
    },
    subTitleText: {
      fontFamily: 'Roboto',
      fontSize: Platform.select({ ios: 16, android: 15 }),
      fontWeight: '500',
      lineHeight: 23,
    },

    // inputs
    input: {
      color: theme.PrimaryText,
      fontSize: 16,
      // padding: 10,
      fontFamily: 'Roboto',
      backgroundColor: 'transparent',
      // height: 50,
      borderRadius: 2,
      borderColor: theme.PrimaryBorder,
      borderWidth: 1,
      lineHeight: 21,
    },
    link: {
      color: theme.Link,
      textDecorationLine: 'underline',
    },
    inputIcon: {
      position: 'absolute',
      right: 8,
      top: Platform.OS === 'ios' ? 36 : 40,
      color: theme.PrimaryText,
    },
    transparentButton: {
      borderWidth: 1,
      backgroundColor: 'rgba(0,0,0,0.30)',
      borderColor: Platform.select({
        android: 'rgba(255,255,255,0.40)',
        ios: 'rgba(255,255,255,0.60)',
      }),
      borderRadius: 30,
    },
    button: {
      marginRight: 0,
      marginLeft: 0,
      backgroundColor: '#5DBAC0',
      borderColor: '#5DBAC0',
      borderWidth: 1,
      borderRadius: 2,
      height: 60,
    },
    buttonText: {
      // fontFamily: 'Roboto',
      fontSize: 20,
      fontWeight: '500',
      color: 'white',
    },
    checkbox: {
      backgroundColor: 'transparent',
      marginLeft: 0,
      paddingLeft: 0,
      borderWidth: 0,
    },

    // borders
    borderHair: {
      borderWidth: StyleSheet.hairlineWidth,
    },
    borderLeftHair: {
      borderLeftWidth: StyleSheet.hairlineWidth,
    },
    borderRightHair: {
      borderRightWidth: StyleSheet.hairlineWidth,
    },
    borderTopHair: {
      borderTopWidth: StyleSheet.hairlineWidth,
    },
    borderBottomHair: {
      borderBottomWidth: StyleSheet.hairlineWidth,
    },
    debug: {
      borderWidth: 1,
      borderColor: 'red',
    },
  } as const);

export type Styles = ReturnType<typeof _buildStyle> & DynamicStyles;

export const buildStyle = (theme): Styles => {
  return new Proxy(_buildStyle(theme), dynamicStyleHandler);
};

export const updateTheme = (styles: Styles) => {
  Object.getOwnPropertyNames(styles).forEach(name => {
    const style = colors(name, ThemedStyles);
    if (style) {
      Object.assign(styles[name], style);
    }
  });
};
