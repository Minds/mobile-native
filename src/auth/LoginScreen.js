import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  Keyboard,
  Animated,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';

import LoginForm from './LoginForm';
import { CommonStyle as CS } from '../styles/Common';
import logService from '../common/services/log.service';
import featuresService from '../common/services/features.service';
import i18nService from '../common/services/i18n.service';
import sessionService from '../common/services/session.service';

const LOGO_HEIGHT = 100;
const LOGO_HEIGHT_SMALL = 50;

/**
 * Login screen
 */
export default class LoginScreen extends Component {
  /**
   * Disable navigation bar
   */
  static navigationOptions = {
    header: null
  }

  constructor(props) {
    super(props);

    this.logoHeight = new Animated.Value(LOGO_HEIGHT);

    // Setting this here because if user register, then onboarding then logout and login again, will go to onboarding again
    sessionService.setInitialScreen('Tabs');

    this.setState({ loading:true });
  }

  componentWillMount () {
    this.keyboardWillShowSub = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow);
    this.keyboardWillHideSub = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide);
  }

  componentWillUnmount() {
    this.keyboardWillShowSub.remove();
    this.keyboardWillHideSub.remove();
  }

  keyboardWillShow = (event) => {
    Animated.timing(this.logoHeight, {
      duration: event.duration,
      toValue: LOGO_HEIGHT_SMALL,
    }).start();
  };

  keyboardWillHide = (event) => {
    Animated.timing(this.logoHeight, {
      duration: event.duration,
      toValue: LOGO_HEIGHT,
    }).start();
  };

  getLoginBody = () => {
    return (
      <View style={[CS.flexContainer, CS.paddingTop2x]}>
        <Image
          source={require('./../assets/logos/bulb.png')}
          style={styles.bulb}
        />
        <LoginForm
          onLogin={() => this.login()}
          onForgot={this.onPressForgot}
        />
      </View>
    );
  };

  getLoginFooter = () => {
    return (
      <TouchableOpacity onPress={this.onPressRegister} testID="registerButton">
        <View style={CS.flexColumnCentered}>
          <Text style={[CS.subTitleText, CS.colorSecondaryText]}>{i18nService.t('auth.haveAccount')}</Text>
          <Text style={[CS.titleText, CS.colorPrimaryText]}>{i18nService.t('auth.createChannel')}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  /**
   * Render
   */
  render() {
    const resizeMode = 'center';

    return (
      <View style={[CS.flexContainerCenter]}>
        <View style={[CS.mindsLayoutBody, CS.backgroundThemePrimary]}>
          {this.getLoginBody()}
        </View>
        <View style={[CS.mindsLayoutFooter, CS.backgroundThemeSecondary]}>
          {this.getLoginFooter()}
        </View>
      </View>
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
    if (featuresService.has('register_pages-december-2019')) {
      this.props.navigation.push('RegisterNew');
    } else {
      this.props.navigation.push('Register');
    }
  }

  /**
   * On login successful
   */
  login() {
    logService.info('user logged in');
  }
}

const styles = StyleSheet.create({
  logo: {
    width: 200,
    height: 84,
    marginBottom: 30,
    alignSelf: 'center',
  },
  bulb: {
    width: 34.72,
    height: 59.51,
    alignSelf: 'center',
    marginTop: 10
  },
});
