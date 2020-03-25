import { StyleSheet } from 'react-native';

import colors, {DARK_THEME, LIGHT_THEME} from './Colors';

/**
 * Styles
 */
export const CommonStyle = StyleSheet.create({
  // containers
  flexContainer: {
    flex: 1,
  },
  flexContainerCenter: {
    flex: 1,
    justifyContent: 'center',
  },
  flexColumnCentered: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
  },
  centered: {
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  columnAlignCenter: {
    alignItems: 'center',
    flexDirection: 'column',
  },
  columnAlignStart: {
    alignItems: 'flex-start',
    flexDirection: 'column',
  },
  columnAlignEnd: {
    alignItems: 'flex-end',
    flexDirection: 'column',
  },
  columnStretch: {
    alignItems: 'stretch',
    flexDirection: 'column',
  },
  rowJustifyEnd: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  rowJustifyCenter: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  rowJustifySpaceEvenly: {
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  rowJustifyStart: {
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  rowStretch: {
    alignItems: 'stretch',
    flexDirection: 'row',
  },
  // align
  alignCenter: {
    alignItems: 'center'
  },
  alignJustifyCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  alignSpaceAround: {
    alignContent: 'space-around'
  },
  //
  fillFlex: {
    flexGrow: 1,
  },
  colorWhite: {
    color: '#FFFFFF'
  },
  colorAction: {
    color: colors.action
  },
  colorBlack: {
    color: '#000000'
  },
  colorLight: {
    color: colors.light
  },
  colorMedium: {
    color: colors.medium
  },
  colorSecondary: {
    color: colors.secondary
  },
  colorTertiary: {
    color: colors.tertiary
  },
  colorPrimary: {
    color: colors.primary
  },
  colorDanger: {
    color: colors.danger
  },
  colorDarkGreyed: {
    color: colors.darkGreyed
  },
  colorGreyed: {
    color: colors.greyed
  },
  colorDark: {
    color: colors.dark
  },
  colorLightGreyed: {
    color: colors.lightGreyed
  },
  colorPrimaryText: {
    color: LIGHT_THEME.primary_text
  },
  colorSecondaryText: {
    color: LIGHT_THEME.secondary_text
  },
  colorButton: {
    color: LIGHT_THEME.button_border
  },
  colorDone: {
    color: LIGHT_THEME.done
  },
  colorActionNew: {
    color: LIGHT_THEME.action
  },
  colorIcon: {
    color: LIGHT_THEME.icon
  },
  // backgrounds
  backgroundWhite: {
    backgroundColor: 'white'
  },
  backgroundAction: {
    backgroundColor: colors.action,
  },
  backgroundLightGreyed: {
    backgroundColor: colors.lightGreyed
  },
  backgroundBlack: {
    backgroundColor: 'black'
  },
  backgroundLight: {
    backgroundColor: colors.light
  },
  backgroundSecondary: {
    backgroundColor: colors.secondary
  },
  backgroundPrimary: {
    backgroundColor: colors.primary
  },
  backgroundDanger: {
    backgroundColor: colors.danger
  },
  backgroundDarkGreyed: {
    backgroundColor: colors.darkGreyed
  },
  backgroundGreyed: {
    backgroundColor: colors.greyed
  },
  backgroundDark: {
    backgroundColor: colors.dark
  },
  backgroundTransparent: {
    backgroundColor: 'transparent'
  },
  backgroundTertiary: {
    backgroundColor: colors.tertiary
  },
  backgroundThemePrimary: {
    backgroundColor: LIGHT_THEME.primary_background,
  },
  backgroundThemeSecondary: {
    backgroundColor: LIGHT_THEME.secondary_background,
  },
  // borders
  borderWhite: {
    borderColor: 'white'
  },
  borderBlack: {
    borderColor: 'black'
  },
  borderLight: {
    borderColor: colors.light
  },
  borderLightGreyed: {
    borderColor: colors.lightGreyed
  },
  borderSecondary: {
    borderColor: colors.secondary
  },
  borderTertiary: {
    borderColor: colors.tertiary
  },
  borderPrimary: {
    borderColor: colors.primary
  },
  borderDanger: {
    borderColor: colors.danger
  },
  borderDarkGreyed: {
    borderColor: colors.darkGreyed
  },
  borderGreyed: {
    borderColor: colors.greyed
  },
  borderDark: {
    borderColor: colors.dark
  },
  borderTransparent: {
    borderColor: 'transparent'
  },
  borderButton: {
    borderColor: LIGHT_THEME.button_border
  },
  // margin
  margin4x: {
    margin: 20
  },
  margin3x: {
    margin: 15
  },
  margin2x: {
    margin: 10
  },
  margin: {
    margin: 5
  },
  // margin top
  marginTop4x: {
    marginTop: 20
  },
  marginTop3x: {
    marginTop: 15
  },
  marginTop2x: {
    marginTop: 10
  },
  marginTop: {
    marginTop: 5
  },
  // margin Right
  marginRight3x: {
    marginRight: 15
  },
  marginRight2x: {
    marginRight: 10
  },
  marginRight: {
    marginRight: 5
  },
  // margin Left
  marginLeft3x: {
    marginLeft: 15
  },
  marginLeft2x: {
    marginLeft: 10
  },
  marginLeft: {
    marginLeft: 5
  },
  // margin bottom
  marginBottom4x: {
    marginBottom: 20
  },
  marginBottom3x: {
    marginBottom: 15
  },
  marginBottom2x: {
    marginBottom: 10
  },
  marginBottom: {
    marginBottom: 5
  },

  marginTop0x: {
    marginTop: 0
  },
  marginLeft0x: {
    marginLeft: 0
  },
  marginRight0x: {
    marginRight: 0
  },
  marginBottom0x: {
    marginBottom: 0
  },

  // padding
  padding4x: {
    padding: 20
  },
  padding3x: {
    padding: 15
  },
  padding2x: {
    padding: 10
  },
  padding: {
    padding: 5
  },
  // padding top
  paddingTop3x: {
    paddingTop: 15
  },
  paddingTop2x: {
    paddingTop: 10
  },
  paddingTop: {
    paddingTop: 5
  },
  // padding Left
  paddingLeft3x: {
    paddingLeft: 15
  },
  paddingLeft2x: {
    paddingLeft: 10
  },
  paddingLeft: {
    paddingLeft: 5
  },
  // padding Right
  paddingRight3x: {
    paddingRight: 15
  },
  paddingRight2x: {
    paddingRight: 10
  },
  paddingRight: {
    paddingRight: 5
  },
  // padding bottom
  paddingBottom3x: {
    paddingBottom: 15
  },
  paddingBottom2x: {
    paddingBottom: 10
  },
  paddingBottom: {
    paddingBottom: 5
  },
  hairLineBottom: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#CCC',
  },
  hairLineTop: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#CCC',
  },

  // borders
  noBorder: {
    borderWidth: 0
  },
  borderHair: {
    borderWidth: StyleSheet.hairlineWidth
  },
  border: {
    borderWidth: 1
  },
  border2x: {
    borderWidth: 2
  },
  border3x: {
    borderWidth: 3
  },
  borderLeftHair: {
    borderLeftWidth: StyleSheet.hairlineWidth
  },
  noBorderLeft: {
    borderLeftWidth: 0
  },
  borderLeft: {
    borderLeftWidth: 1
  },
  borderLeft2x: {
    borderLeftWidth: 2
  },
  borderLeft3x: {
    borderLeftWidth: 3
  },
  borderRightHair: {
    borderRightWidth: StyleSheet.hairlineWidth
  },
  noBorderRight: {
    borderRightWidth: 0
  },
  borderRight: {
    borderRightWidth: 1
  },
  borderRight2x: {
    borderRightWidth: 2
  },
  borderRight3x: {
    borderRightWidth: 3
  },
  borderTopHair: {
    borderTopWidth: StyleSheet.hairlineWidth
  },
  noBorderTop: {
    borderTopWidth: 0
  },
  borderTop: {
    borderTopWidth: 1
  },
  borderTop2x: {
    borderTopWidth: 2
  },
  borderTop3x: {
    borderTopWidth: 3
  },
  borderBottomHair: {
    borderBottomWidth: StyleSheet.hairlineWidth
  },
  noBorderBottom: {
    borderBottomWidth: 0
  },
  borderBottom: {
    borderBottomWidth: 1
  },
  borderBottom2x: {
    borderBottomWidth: 2
  },
  borderBottom3x: {
    borderBottomWidth: 3
  },
  borderRadius: {
    borderRadius: 2
  },
  borderRadius2x: {
    borderRadius: 4
  },
  borderRadius3x: {
    borderRadius: 6
  },
  borderRadius4x: {
    borderRadius: 8
  },
  borderRadius5x: {
    borderRadius: 10
  },
  borderRadius6x: {
    borderRadius: 12
  },
  borderRadius7x: {
    borderRadius: 14
  },
  borderRadius8x: {
    borderRadius: 16
  },
  borderRadius9x: {
    borderRadius: 18
  },
  borderRadius10x: {
    borderRadius: 20
  },
  borderRadius11x: {
    borderRadius: 22
  },
  borderRadius12x: {
    borderRadius: 24
  },
  // fonts
  fontXS:{
    fontSize: 10
  },
  fontS: {
    fontSize: 12
  },
  fontM: {
    fontSize: 14
  },
  fontL: {
    fontSize: 16
  },
  fontXL: {
    fontSize: 18
  },
  fontXXL: {
    fontSize: 24
  },
  fontXXXL: {
    fontSize: 30
  },

  // text align
  textRight: {
    textAlign: 'right'
  },
  textLeft: {
    textAlign: 'left'
  },
  textCenter: {
    textAlign: 'center'
  },
  textJustify: {
    textAlign: 'justify'
  },

  fullWidth: {
    width: '100%'
  },

  halfWidth: {
    width: '50%'
  },

  // Overlay∫
  blackOverlay: {
    backgroundColor:'black',
    zIndex: 1000
  },

  //position
  positionAbsolute:{
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  },
  positionAbsoluteBottom:{
    position: "absolute",
    bottom: 0,
    left: 0
  },
  positionAbsoluteTop:{
    position: "absolute",
    top: 0,
    left: 0
  },
  positionAbsoluteTopRight:{
    position: "absolute",
    top: 0,
    right: 0
  },
  positionRelative:{
    position: "relative",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0
  },

  //shadow
  shadow: {
    elevation: 4,
    shadowOffset: { width: 0, height: 2 },
    shadowColor: "black",
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  bold: {
    fontWeight: '700'
  },
  extraBold: {
    // fontWeight: '800'
    fontFamily: 'Roboto-Black', // workaround android ignoring >= 800
  },
  fontThin: {
    fontWeight: '200'
  },
  fontHairline: {
    fontWeight: '100'
  },
  fontLight: {
    fontWeight: '300'
  },
  fontNormal: {
    fontWeight: '400'
  },
  fontMedium: {
    fontWeight: '500'
  },
  fontSemibold: {
    fontWeight: '600'
  },

  // Generic screens
  screen: {
    padding: 20,
  },
  modalScreen: {
    //padding: 20,
    paddingTop: 40
  },

  // Modal Headings
  modalTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingBottom: 10,
  },
  modalTitle: {
    fontFamily: 'Roboto-Black',
    fontSize: 18,
    color: '#444',
    marginBottom: 8,
  },
  modalNote: {
    fontSize: 12,
    marginBottom: 10,
    color: '#aaa',
  },

  // Fields
  field: {
    paddingTop: 10,
    paddingBottom: 10
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '300',
    paddingBottom: 3, // ~1.25 line height
  },
  fieldTextInput: {
    backgroundColor: '#fff',
    padding: 10,
    borderWidth: 1,
    borderColor: '#e4e4e4',
    borderRadius: 2
  },
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
    lineHeight: 20
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
    fontSize: 28,
    fontWeight: 'bold',
    lineHeight: 44,
  },
  subTitleText: {
    fontFamily: 'Roboto',
    fontSize: 17,
    fontWeight: '500',
    lineHeight: 23,
  }
});
