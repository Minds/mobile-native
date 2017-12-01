import React, {
    Component
  } from 'react';
  
  import { NavigationActions } from 'react-navigation';
  
  import {
    Text,
    StyleSheet,
    KeyboardAvoidingView,
    ScrollView,
    View,
    Image
  } from 'react-native';
  
  import RegisterForm from './RegisterForm';
  
  export default class Register extends Component {
  
    render() {
      return (
        <View style={{ flex: 1}}>
        <Image
          style={styles.background}
          source={require('../assets/bg-2.jpg')}/>
          <View
            style={styles.viewWrapper}>
            <Image
              style={styles.stretch}
              source={require('../assets/logos/medium-white.png')}
            />
            <KeyboardAvoidingView
              behavior='padding'
              style={styles.container}
            >
              <RegisterForm
                onLogin={() => this.login()}
              />
            </KeyboardAvoidingView>
          </View>
      </View>
      );
    }
  
    login() {
      const resetAction = NavigationActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({ routeName: 'Tabs' })
        ]
      })
  
      this.props.navigation.dispatch(resetAction);
    }
  }
  
  const styles = StyleSheet.create({
    stretch: {
      width: 200,
      height: 80,
      marginLeft: 20,
      marginTop: 0
    },
    background: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0, 
      justifyContent: 'center',
      alignItems: 'center',
    },
    viewWrapper: {
      flex: 1,
      backgroundColor: 'transparent',
      justifyContent: 'center',
    },
    keyboardAvoidingView: {backgroundColor: 'transparent'}
  });