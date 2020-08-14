//@ts-nocheck
import React, { PureComponent } from 'react';

import { View, Text, SafeAreaView } from 'react-native';

import authService from './AuthService';
import i18n from '../common/services/i18n.service';
import logService from '../common/services/log.service';
import Button from '../common/components/Button';
import ThemedStyles from '../styles/ThemedStyles';
import InputContainer from '../common/components/InputContainer';
import { styles } from './styles';

type PropsType = {
  onBack: Function;
};

/**
 * Forgot Password Form
 */
export default class ForgotPassword extends PureComponent<PropsType> {
  /**
   * Component will mount
   */
  componentWillMount() {
    this.setState({
      username: '',
      sending: false,
      sent: false,
      msg: i18n.t('auth.requestNewPassword'),
    });
  }

  /**
   * Render
   */
  render() {
    const theme = ThemedStyles.style;
    return (
      <SafeAreaView style={theme.flexContainer}>
        <Text
          style={[
            theme.titleText,
            theme.colorPrimaryText,
            theme.marginVertical3x,
            theme.marginHorizontal3x,
          ]}>
          {i18n.t('auth.forgot')}
        </Text>
        <Text
          style={[
            theme.subTitleText,
            theme.colorPrimaryText,
            theme.marginVertical,
            theme.marginHorizontal3x,
          ]}>
          {this.state.msg}
        </Text>
        {!this.state.sent && (
          <InputContainer
            containerStyle={styles.inputBackground}
            style={theme.colorWhite}
            placeholder={i18n.t('auth.username')}
            returnKeyType={'done'}
            onChangeText={(value) => this.setState({ username: value })}
            autoCapitalize={'none'}
            value={this.state.username}
            accessibilityLabel="usernameInput"
          />
        )}
        <View style={[theme.rowJustifyEnd, theme.marginTop4x]}>
          <Button
            onPress={() => this.onPressBack()}
            text={i18n.t('goback')}
            containerStyle={[
              theme.transparentButton,
              theme.paddingVertical3x,
              theme.paddingHorizontal3x,
              theme.marginTop1x,
              styles.lightButton,
            ]}
            textStyle={theme.buttonText}
            accessibilityLabel="backButton"
          />
          {!this.state.sent && (
            <Button
              onPress={() => this.onContinuePress()}
              text={i18n.t('continue')}
              loading={this.state.sending}
              loadingRight={true}
              disable={this.state.sending || this.state.sent}
              containerStyle={[
                theme.transparentButton,
                theme.paddingVertical3x,
                theme.paddingHorizontal3x,
                theme.marginTop1x,
                theme.marginLeft2x,
                styles.lightButton,
              ]}
              textStyle={theme.buttonText}
              accessibilityLabel="continueButton"
            />
          )}
        </View>
      </SafeAreaView>
    );
  }

  /**
   * On press back
   */
  onPressBack() {
    this.props.onBack();
  }

  /**
   * On continue press
   */
  async onContinuePress() {
    if (!this.state.sent) {
      this.setState({ sending: true });

      try {
        const data = await authService.forgot(this.state.username);
        console.log(data);
        this.setState({
          sent: true,
          msg: i18n.t('auth.requestNewPasswordSuccess'),
        });
      } catch (err) {
        alert('Oops. Please try again.');
        logService.exception('[ForgotPassword]', err);
      } finally {
        this.setState({ sending: false });
      }
    }
  }
}
