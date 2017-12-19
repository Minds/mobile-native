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
    backgroundColor: 'rgba(255,255,255, 0.2)',
    //margin: 15,
    height: 40,
    borderRadius: 4,
    opacity: 0.8
  },
  loginButton: {
    marginLeft: 15,
    borderRadius: 4,
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