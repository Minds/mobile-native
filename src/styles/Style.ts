import { StyleSheet, Platform } from 'react-native';

export interface ThemedStyle {
  flexContainer: any;
  flexContainerCenter: any;
  flexColumn: any;
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
  backgroundWhite: any;
  backgroundBlack: any;
  backgroundTransparent: any;
  backgroundLink: any;
  backgroundAlert: any;
  backgroundPrimary: any;
  backgroundSecondary: any;
  backgroundTertiary: any;
  backgroundButtonPrimary: any;
  backgroundSeparator: any;
  backgroundIcon: any;
  backgroundIconActive: any;
  borderPrimary: any;
  borderIconActive: any;
  borderIcon: any;
  fontXS: any;
  fontS: any;
  fontM: any;
  fontL: any;
  fontXL: any;
  fontXXL: any;
  fontXXXL: any;
  textRight: any;
  textLeft: any;
  textCenter: any;
  textJustify: any;
  fullWidth: any;
  halfWidth: any;
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
  [name: string]: any;
}

const repetitions = 8;
const step = 5;

const dynamicStyles = {};

for (let index = 0; index < repetitions; index++) {
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

export const buildStyle = (theme): ThemedStyle => ({
  ...dynamicStyles,
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
  centered: {
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
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
  // backgrounds
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
  backgroundPrimary: {
    backgroundColor: theme.primary_background,
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

  // borders
  borderPrimary: {
    borderColor: theme.primary_border,
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
  fontXL: {
    fontSize: 18,
  },
  fontXXL: {
    fontSize: 24,
  },
  fontXXXL: {
    fontSize: 30,
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
  bold: {
    fontWeight: '700',
  },
  extraBold: {
    // fontWeight: '800'
    fontFamily: 'Roboto-Black', // workaround android ignoring >= 800
  },
  fontThin: {
    fontWeight: '200',
  },
  fontHairline: {
    fontWeight: '100',
  },
  fontLight: {
    fontWeight: '300',
  },
  fontNormal: {
    fontWeight: '400',
  },
  fontMedium: {
    fontWeight: '500',
  },
  fontSemibold: {
    fontWeight: '600',
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
    fontSize: 26,
    fontWeight: 'bold',
    lineHeight: 44,
  },
  subTitleText: {
    fontFamily: 'Roboto',
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 23,
  },

  // inputs
  input: {
    color: theme.primary_text,
    fontSize: 16,
    padding: 10,
    fontFamily: 'Roboto',
    backgroundColor: 'transparent',
    height: 50,
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
    marginTop: 15,
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
});
