import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Keyboard,
  Animated,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';

import LoginForm from './LoginForm';
import logService from '../common/services/log.service';
import i18nService from '../common/services/i18n.service';
import sessionService from '../common/services/session.service';

import ThemedStyles from '../styles/ThemedStyles';
import { SafeAreaView } from 'react-native-safe-area-context';

import BannerInfo from '../topbar/BannerInfo';

const LOGO_HEIGHT = 80;
const LOGO_HEIGHT_SMALL = 40;

/**
 * Login screen
 */
export default class LoginScreen extends Component {

  state = {
    keyboard: false,
  }

  constructor(props) {
    super(props);

    this.logoHeight = new Animated.Value(LOGO_HEIGHT);
  }

  componentDidMount() {
    // Setting this here because if user register, then onboarding then logout and login again, will go to onboarding again
    sessionService.setInitialScreen('Tabs');
    this.keyboardWillShowSub = Keyboard.addListener('keyboardDidShow', this.keyboardWillShow);
    this.keyboardWillHideSub = Keyboard.addListener('keyboardDidHide', this.keyboardWillHide);
  }

  componentWillUnmount() {
    this.keyboardWillShowSub.remove();
    this.keyboardWillHideSub.remove();
  }

  keyboardWillShow = (event) => {
    Animated.timing(this.logoHeight, {
      duration: 500,
      toValue: LOGO_HEIGHT_SMALL,
    }).start();

    // this.setState({keyboard: true});
    // LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
  };

  keyboardWillHide = (event) => {
    Animated.timing(this.logoHeight, {
      duration: 500,
      toValue: LOGO_HEIGHT,
    }).start();

    // this.setState({keyboard: false});
    // LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
  };

  /**
   * Render
   */
  render() {
    const CS = ThemedStyles.style;

    return (
      <KeyboardAvoidingView style={[CS.flexColumnStretch, CS.backgroundPrimary]} behavior={Platform.OS == 'ios' ? 'padding' : null} >
        <SafeAreaView style={[styles.flex10]}>
          <BannerInfo logged={false} />
          <ScrollView style={CS.flexContainer} keyboardShouldPersistTaps={true}>
            <View style={[CS.paddingHorizontal4x, CS.flexColumnStretch]}>
              <Animated.Image
                resizeMode="contain"
                source={require('./../assets/logos/bulb.png')}
                style={[styles.bulb, { height: this.logoHeight }]}
              />
              <LoginForm
                onLogin={() => this.login()}
                onForgot={this.onPressForgot}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
        <View style={[CS.paddingVertical2x, CS.backgroundSecondary, CS.mindsLayoutFooter]}>
          <TouchableOpacity onPress={this.onPressRegister} testID="registerButton">
            <View style={CS.flexColumnCentered}>
              <Text style={[CS.subTitleText, CS.colorSecondaryText]}>{i18nService.t('auth.haveAccount')}</Text>
              <Text style={[CS.titleText, CS.colorPrimaryText]}>{i18nService.t('auth.createChannel')}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }

  /**
   * On press forgot
   */
  onPressForgot = () => {
    this.props.navigation.push('Forgot');
  }

  /**
   * On press register
   */
  onPressRegister = () => {
    this.props.navigation.push('Register');
  }

  /**
   * On login successful
   */
  login() {
    logService.info('user logged in');
  }
}

const styles = StyleSheet.create({
  flex10: {
    flex: 10,
  },
  bulb: {
    width: 40,
    height: 67,
    alignSelf: 'center',
    marginTop: 10
  },
});
