import Colors from "../../styles/Colors";

import { Platform } from "react-native";

export default {
  header: {
    backgroundColor: '#fff',
    padding: 10,
    paddingTop: (Platform.OS == 'ios' ? 14 : 8) + 10,
    paddingBottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerNext: {
    paddingTop: 4,
    paddingBottom: 4
  },
  headerNextText: {
    fontSize: 13,
  },

  view: {
    backgroundColor: '#fff',
    flex: 1,
    padding: 10,
  },

  cols: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'stretch',
  },
  colsCenter: {
    alignItems: 'center',
  },
  col: {
    flexBasis: 0,
    flexGrow: 1,
    marginLeft: 10,
  },
  colLazy: {
    flexBasis: 'auto',
    flexGrow: 0,
  },
  colFirst: {
    marginLeft: 0,
  },

  rows: {
    flexDirection: 'column',
    marginTop: 20,
    marginBottom: 20,
    alignItems: 'stretch',
  },
  row: {
    flexBasis: 0,
    flexGrow: 1,
    marginTop: 20,
  },
  rowFirst: {
    marginTop: 0,
  },

  h1: {
    color: '#444',
    fontSize: 30,
    letterSpacing: 0.5,
    fontWeight: '700',
    marginBottom: 15,
  },
  h2: {
    color: '#444',
    fontSize: 20,
    letterSpacing: 0.35,
    fontWeight: '700',
    marginBottom: 10,
  },
  p: {
    color: '#444',
    fontSize: 16,
    letterSpacing: 0.35,
    marginBottom: 10,
  },
  b: {
    fontWeight: '700',
  },

  form: {
    marginTop: 20
  },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.greyed,
    borderRadius: 3,
    paddingLeft: 10,
    paddingRight: 10,
    fontSize: 16,
    fontWeight: '700',
  },
  textInputCentered: {
    textAlign: 'center',
  },
  phoneInput: {
    borderWidth: 1,
    borderColor: Colors.greyed,
    borderRadius: 3,
    paddingLeft: 10,
    paddingRight: 10,
  },
  phoneTextInput: {
    fontSize: 16,
    fontWeight: '700',
  },

  smallLegend: {
    color: Colors.darkGreyed,
    fontSize: 12,
  },
  legend: {
    color: Colors.darkGreyed,
    fontSize: 16,
    letterSpacing: 0.5,
  },
  primaryLegendUppercase: {
    color: Colors.primary,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  loneIcon: {
    marginBottom: 10,
  },

  vertButton: {
    marginTop: 10,
    marginBottom: 10,
  },
  vertButtonBar: {
    marginTop: 10
  },

  nextButtonBar: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },

  error: {
    fontSize: 13,
    color: '#c00',
    textAlign: 'center',
  }
};
