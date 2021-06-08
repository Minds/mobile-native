import { StyleSheet, Platform } from 'react-native';
import sizes from './generators/sizes';
import borders from './generators/borders';
import colors from './generators/colors';
import spacing from './generators/spacing';
import ThemedStyles from './ThemedStyles';
import { DynamicStyles } from './types';

const dynamicStyleHandler = {
  get: function (target, name) {
    // if already exist we return it
    if (name in target) return target[name];

    // generate dynamic style
    const m =
      spacing(name) ||
      colors(name, ThemedStyles) ||
      borders(name) ||
      sizes(name);

    if (m) {
      target[name] = m;
    }
    if (target[name]) {
      return target[name];
    }
    throw new Error(`Style not defined: ${name}`);
  },
};

const _buildStyle = theme =>
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
    colorWhite: {
      color: '#FFFFFF',
    },
    colorBlack: {
      color: '#000000',
    },
    colorGreen: {
      color: theme.green,
    },
    colorPrimaryText: {
      color: theme.primary_text,
    },
    colorSecondaryText: {
      color: theme.secondary_text,
    },
    colorTertiaryText: {
      color: theme.tertiary_text,
    },
    colorLink: {
      color: theme.link,
    },
    colorButton: {
      color: theme.button_border,
    },
    colorDone: {
      color: theme.done,
    },
    colorActionNew: {
      color: theme.action,
    },
    colorIcon: {
      color: theme.icon,
    },
    colorIconActive: {
      color: theme.icon_active,
    },
    colorSeparator: {
      color: theme.separator,
    },
    colorAlert: {
      color: theme.alert,
    },
    colorTransparent: {
      color: 'transparent',
    },
    // backgrounds
    backgroundPrimaryText: {
      backgroundColor: theme.primary_text,
    },
    backgroundSecondaryText: {
      backgroundColor: theme.secondary_text,
    },
    backgroundTertiaryText: {
      backgroundColor: theme.tertiary_text,
    },
    backgroundInfo: {
      backgroundColor: theme.info_background,
    },
    backgroundSuccess: {
      backgroundColor: theme.success_background,
    },
    backgroundDanger: {
      backgroundColor: theme.danger_background,
    },
    backgroundWarning: {
      backgroundColor: theme.warning_background,
    },
    backgroundWhite: {
      backgroundColor: 'white',
    },
    backgroundBlack: {
      backgroundColor: 'black',
    },
    backgroundTransparent: {
      backgroundColor: 'transparent',
    },
    backgroundLink: {
      backgroundColor: theme.link,
    },
    backgroundAlert: {
      backgroundColor: theme.alert,
    },
    colorBackgroundPrimary: {
      color: theme.primary_background,
    },
    colorBackgroundSecondary: {
      color: theme.secondary_background,
    },
    colorBackgroundTertiary: {
      color: theme.tertiary_background,
    },
    backgroundPrimary: {
      backgroundColor: theme.primary_background,
    },
    backgroundPrimaryHighlight: {
      backgroundColor: theme.primary_background_highlight,
    },
    backgroundSecondary: {
      backgroundColor: theme.secondary_background,
    },
    backgroundTertiary: {
      backgroundColor: theme.tertiary_background,
    },
    backgroundButtonPrimary: {
      backgroundColor: theme.primary_button,
    },
    backgroundSeparator: {
      backgroundColor: theme.separator,
    },
    backgroundIcon: {
      backgroundColor: theme.icon,
    },
    backgroundIconActive: {
      backgroundColor: theme.icon_active,
    },
    mindsSwitchBackgroundPrimary: {
      backgroundColor: theme.secondary_background,
    },
    mindsSwitchBackgroundSecondary: {
      backgroundColor: theme.primary_border,
    },

    // borders
    borderTransparent: {
      borderColor: 'transparent',
    },
    borderBackgroundPrimary: {
      borderColor: theme.primary_background,
    },
    borderBackgroundSecondary: {
      borderColor: theme.secondary_background,
    },
    borderBackgroundTertiary: {
      borderColor: theme.tertiary_background,
    },
    borderLink: {
      borderColor: theme.link,
    },
    borderPrimary: {
      borderColor: theme.primary_border,
    },
    borderTab: {
      borderColor: theme.tab_border,
    },
    borderIconActive: {
      borderColor: theme.icon_active,
    },
    borderIcon: {
      borderColor: theme.icon,
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
    bold: {
      fontWeight: '700',
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
    strikethrough: {
      textDecorationLine: 'line-through',
      textDecorationStyle: 'solid',
    },
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
      color: theme.primary_text,
      fontSize: 16,
      // padding: 10,
      fontFamily: 'Roboto',
      backgroundColor: 'transparent',
      // height: 50,
      borderRadius: 2,
      borderColor: theme.primary_border,
      borderWidth: 1,
      lineHeight: 21,
    },
    link: {
      color: theme.link,
      textDecorationLine: 'underline',
    },
    inputIcon: {
      position: 'absolute',
      right: 8,
      top: Platform.OS === 'ios' ? 36 : 40,
      color: theme.primary_text,
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
    buttonBorder: {
      borderColor: theme.button_border,
    },

    // others
    listItemTitle: {
      color: theme.primary_text,
      paddingVertical: 15,
      fontSize: 17,
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
