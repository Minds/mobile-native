import { StyleSheet } from 'react-native';

import colors from './Colors';

/**
 * Styles
 */
export const ComponentsStyle = StyleSheet.create({
  passwordinput: {
    backgroundColor: '#CCC',
    borderRadius: 5
  },

  // login
  loginInput: {
    color: '#FFF',
    fontSize: 16,
    letterSpacing: 2,
    padding: 15,
    fontFamily: 'Roboto',
    backgroundColor: 'rgba(255,255,255, 0.2)',
    height: 50,
    borderRadius: 4,
  },
  loginButton: {
    borderRadius: 4,
    marginRight: 0,
    marginLeft: 10,
  },
  loginButtonText: {
    fontFamily: 'Roboto',
    fontWeight: 'bold'
  },
  registerCheckboxText: {
    color: 'white'
  },
  registerCheckbox: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    marginRight: 0,
    alignSelf: 'flex-end'
  },

  // background image
  backgroundImage: {
    flex: 1,
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  // logo
  logo: {
    width: 200,
    height: 80,
    marginBottom: 30,
    alignSelf: 'center'
  }
});