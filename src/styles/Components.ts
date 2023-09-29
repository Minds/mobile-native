//@ts-nocheck
import { StyleSheet, Dimensions, Platform } from 'react-native';

import { LIGHT_THEME } from './Colors';

/**
 * Styles
 */
export const ComponentsStyle = StyleSheet.create({
  loginInputIcon: {
    position: 'absolute',
    right: 8,
    top: 22,
  },
  loginInputIconNew: {
    position: 'absolute',
    right: 8,
    top: Platform.OS === 'ios' ? 33 : 37,
    color: '#404A4E',
  },
  passwordinput: {
    borderColor: '#ECECEC',
    borderWidth: 1,
    backgroundColor: '#FFF',
    borderRadius: 3,
    padding: 16,
  },
  input: {
    borderColor: '#ECECEC',
    borderWidth: 1,
    backgroundColor: '#FFF',
    borderRadius: 3,
    padding: 16,
  },

  // login
  loginInput: {
    color: '#444',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 2,
    padding: 15,
    // fontFamily:'Roboto_400Regular',
    //backgroundColor: 'rgba(255,255,255, 0.9)',
    backgroundColor: '#f8f8f8',
    height: 50,
    borderRadius: 4,
  },
  loginInputNew: {
    color: LIGHT_THEME.PrimaryText,
    fontSize: 16,
    padding: 10,
    fontFamily: 'Roboto_400Regular',
    backgroundColor: 'transparent',
    height: 50,
    borderRadius: 2,
    borderWidth: 1,
    lineHeight: 21,
  },
  loginButton: {
    marginRight: 0,
    marginLeft: 10,
    backgroundColor: 'transparent',
    borderColor: '#FFF',
    borderWidth: 1,
    borderRadius: 30,
  },
  loginButtonNew: {
    marginRight: 0,
    marginLeft: 0,
    backgroundColor: '#5DBAC0',
    borderColor: '#5DBAC0',
    borderWidth: 1,
    borderRadius: 2,
    height: 60,
  },
  loginButtonText: {
    // fontFamily:'Roboto_400Regular',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 1.25,
    color: 'white',
  },
  loginButtonTextNew: {
    // fontFamily:'Roboto_400Regular',
    fontSize: 20,
    fontWeight: '500',
    color: 'white',
  },
  registerCheckboxText: {
    color: 'white',
  },
  registerCheckbox: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    marginRight: 0,
    alignSelf: 'flex-end',
  },
  registerCheckboxTextNew: {
    color: '#4A4A4A',
  },
  registerCheckboxNew: {
    backgroundColor: 'transparent',
    marginLeft: 0,
    paddingLeft: 0,
    borderWidth: 0,
    marginTop: 15,
  },

  //button
  commonButton: {
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    margin: 4,
    padding: 4,
  },
  bluebutton: {
    margin: 4,
    padding: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 20,
    borderColor: LIGHT_THEME.Link,
  },
  redbutton: {
    margin: 4,
    padding: 4,
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: LIGHT_THEME.Alert,
  },

  button: {
    borderWidth: 1,
    borderColor: '#ececec',
    borderRadius: 30,
    padding: 8,
  },

  buttonAction: {
    borderColor: LIGHT_THEME.Link,
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
    height: 84,
    marginBottom: 30,
    alignSelf: 'center',
  },
  link: {
    fontWeight: 'bold',
  },
  terms: {
    color: 'white',
    paddingRight: 8,
  },
  linkNew: {
    color: '#0091FF',
    fontSize: 15,
    textDecorationLine: 'underline',
  },
  termsNew: {
    color: '#AEB0B8',
    paddingLeft: 10,
    fontSize: 16,
  },
  preview: {
    height: 200,
    flexDirection: 'row',
    alignItems: 'stretch',
    position: 'relative',
  },
  posterAvatar: {
    height: 36,
    width: 36,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#EEE',
  },
  emptyComponentContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: Dimensions.get('window').height / 2,
  },
  emptyComponent: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  emptyComponentMessage: {
    fontSize: 24,
    fontFamily: 'Roboto_400Regular',
    fontWeight: '200',
    color: '#888',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  emptyComponentLink: {
    fontFamily: 'Roboto_400Regular',
    color: LIGHT_THEME.Link,
    marginTop: 16,
  },
});
