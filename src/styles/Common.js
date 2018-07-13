import { StyleSheet } from 'react-native';

import colors from './Colors';

/**
 * Styles
 */
export const CommonStyle = StyleSheet.create({
  // containers
  flexContainer: {
    flex:1,
  },
  flexContainerCenter: {
    flex:1,
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
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
  },
  columnAlignCenter: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  columnAlignStart: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  columnAlignEnd: {
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  rowJustifyEnd: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  rowJustifyCenter: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  rowJustifyStart: {
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  // align
  alignCenter: {
    alignItems: 'center'
  },
  alignJustifyCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  // color
  colorWhite: {
    color: 'white'
  },
  colorBlack: {
    color: 'black'
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
  colorPrimary: {
    color: colors.primary
  },
  colorDanger: {
    color: colors.danger
  },
  colorDark: {
    color: colors.dark
  },
  // backgrounds
  backgroundWhite: {
    backgroundColor: 'white'
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
  backgroundDark: {
    backgroundColor: colors.dark
  },
  backgroundTransparent: {
    backgroundColor: 'transparent'
  },
  // margin top
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
  marginBottom3x: {
    marginBottom: 15
  },
  marginBottom2x: {
    marginBottom: 10
  },
  marginBottom: {
    marginBottom: 5
  },
  // padding
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
    borderBottomColor: '#EEE',
  },
  hairLineTop: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#EEE',
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
    elevation: 1,
    shadowColor: 'black',
    shadowOpacity: 0.5,
    shadowRadius: StyleSheet.hairlineWidth,
    shadowOffset: {
      height: StyleSheet.hairlineWidth,
    },
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
    fontWeight: '800',
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
  }
});
