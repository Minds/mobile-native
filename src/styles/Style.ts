//@ts-nocheck
import { StyleSheet, Platform } from 'react-native';
export interface ThemedStyle {
  flexContainer: any;
  flexContainerCenter: any;
  flexColumn: any;
  justifyCenter: any;
  justifyEnd: any;
  columnAlignCenter: any;
  flexColumnStretch: any;
  flexColumnCentered: any;
  rowJustifyEnd: any;
  rowJustifyCenter: any;
  rowJustifySpaceEvenly: any;
  rowJustifyStart: any;
  rowJustifySpaceBetween: any;
  rowStretch: any;
  alignCenter: any;
  alignEnd: any;
  alignSelfEnd: any;
  alignSelfStart: any;
  alignSelfCenter: any;
  centered: any;
  colorWhite: any;
  colorBlack: any;
  colorGreen: any;
  colorPrimaryText: any;
  colorSecondaryText: any;
  colorTertiaryText: any;
  colorLink: any;
  colorButton: any;
  colorDone: any;
  colorActionNew: any;
  colorIcon: any;
  colorIconActive: any;
  colorSeparator: any;
  colorAlert: any;
  colorTransparent: any;
  backgroundPrimaryText: any;
  backgroundSecondaryText: any;
  backgroundTertiaryText: any;
  backgroundInfo: any;
  backgroundSuccess: any;
  backgroundDanger: any;
  backgroundWarning: any;
  backgroundBlack: any;
  backgroundTransparent: any;
  backgroundLink: any;
  backgroundAlert: any;
  colorBackgroundPrimary: any;
  colorBackgroundSecondary: any;
  colorBackgroundTertiary: any;
  backgroundPrimary: any;
  backgroundSecondary: any;
  backgroundTertiary: any;
  backgroundButtonPrimary: any;
  backgroundSeparator: any;
  backgroundIcon: any;
  backgroundIconActive: any;
  borderTransparent: any;
  borderBackgroundPrimary: any;
  borderBackgroundSecondary: any;
  borderBackgroundTertiary: any;
  borderPrimary: any;
  borderTab: any;
  borderLink: any;
  borderIconActive: any;
  borderIcon: any;
  fontXS: any;
  fontS: any;
  fontM: any;
  fontL: any;
  fontLM: any;
  fontXL: any;
  fontXXL: any;
  fontXXXL: any;
  textRight: any;
  textLeft: any;
  textCenter: any;
  textJustify: any;
  fullWidth: any;
  halfWidth: any;
  fullHeight: any;
  halfHeight: any;
  bold: any;
  extraBold: any;
  fontThin: any;
  fontHairline: any;
  fontLight: any;
  fontNormal: any;
  fontMedium: any;
  fontSemibold: any;
  onboardingTitle: any;
  onboardingSubtitle: any;
  onboardingSteps: any;
  linkNew: any;
  mindsLayoutBody: any;
  mindsLayoutFooter: any;
  titleText: any;
  subTitleText: any;
  input: any;
  link: any;
  inputIcon: any;
  button: any;
  buttonText: any;
  borderHair: any;
  borderLeftHair: any;
  borderRightHair: any;
  borderTopHair: any;
  borderBottomHair: any;
  buttonBorder: any;
  opacity100: any;
  opacity75: any;
  opacity50: any;
  opacity25: any;
  opacity0: any;
  listItemTitle: any;
  strikethrough: any;
  mindsSwitchBackgroundPrimary: any;
  mindsSwitchBackgroundSecondary: any;
  positionAbsolute: any;
  positionAbsoluteTopLeft: any;
  positionAbsoluteTopRight: any;
  positionAbsoluteBottomRight: any;
  positionAbsoluteBottomRight: any;
  backgroundPrimaryHighlight: any;
  [name: string]: any;
}
const repetitions = 8;
const step = 5;

const dynamicStyles = {};

for (let index = 1; index <= 20; index++) {
  let value = step * index;
  dynamicStyles[`width${value}`] = { width: `${value}%` };
  dynamicStyles[`height${value}`] = { height: `${value}%` };
}

for (let index = 0; index <= repetitions; index++) {
  let value = step * index;
  const post = index === 1 ? '' : `${index}x`;
  dynamicStyles[`margin${post}`] = { margin: value };
  dynamicStyles[`marginVertical${post}`] = { marginVertical: value };
  dynamicStyles[`marginTop${post}`] = { marginTop: value };
  dynamicStyles[`marginLeft${post}`] = { marginLeft: value };
  dynamicStyles[`marginRight${post}`] = { marginRight: value };
  dynamicStyles[`marginBottom${post}`] = { marginBottom: value };
  dynamicStyles[`marginHorizontal${post}`] = { marginHorizontal: value };

  dynamicStyles[`padding${post}`] = { padding: value };
  dynamicStyles[`paddingVertical${post}`] = { paddingVertical: value };
  dynamicStyles[`paddingTop${post}`] = { paddingTop: value };
  dynamicStyles[`paddingLeft${post}`] = { paddingLeft: value };
  dynamicStyles[`paddingRight${post}`] = { paddingRight: value };
  dynamicStyles[`paddingBottom${post}`] = { paddingBottom: value };
  dynamicStyles[`paddingHorizontal${post}`] = { paddingHorizontal: value };

  dynamicStyles[`border${post}`] = { borderWidth: index };
  dynamicStyles[`borderLeft${post}`] = { borderLeftWidth: index };
  dynamicStyles[`borderRight${post}`] = { borderRightWidth: index };
  dynamicStyles[`borderTop${post}`] = { borderTopWidth: index };
  dynamicStyles[`borderBottom${post}`] = { borderBottomWidth: index };
  dynamicStyles[`borderRadius${post}`] = { borderRadius: index * 2 };
}

export const buildStyle = (theme) => ({
  ...dynamicStyles,
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
});
