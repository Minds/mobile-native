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
import { showNotification } from '../../AppMessages';

type PropsType = {
  onBack: Function;
};

/**
 * Forgot Password Form
 */
export default class ForgotPassword extends PureComponent<PropsType> {
  state = {
    username: '',
    sending: false,
    sent: false,
    msg: i18n.t('auth.requestNewPassword'),
  };

  /**
   * Render
   */
  render() {
    const theme = ThemedStyles.style;
    return (
      <SafeAreaView style={theme.flexContainer}>
        <Text style={titleStyle}>{i18n.t('auth.forgot')}</Text>
        <Text style={subtitleStyle}>{this.state.msg}</Text>
        {!this.state.sent && (
          <InputContainer
            autoFocus
            containerStyle={styles.inputBackground}
            style={theme.colorWhite}
            placeholder={i18n.t('auth.username')}
            returnKeyType={'done'}
            onChangeText={value => this.setState({ username: value })}
            autoCapitalize={'none'}
            value={this.state.username}
            accessibilityLabel="usernameInput"
          />
        )}
        <View style={buttonContainerStyle}>
          <Button
            onPress={this.onPressBack}
            text={i18n.t('goback')}
            containerStyle={theme.marginTop1x}
            accessibilityLabel="backButton"
            large
            transparent
          />
          {!this.state.sent && (
            <Button
              onPress={this.onContinuePress}
              text={i18n.t('continue')}
              loading={this.state.sending}
              loadingRight={true}
              disable={this.state.sending || this.state.sent}
              containerStyle={continueStyle}
              accessibilityLabel="continueButton"
              large
              transparent
            />
          )}
        </View>
      </SafeAreaView>
    );
  }

  /**
   * On press back
   */
  onPressBack = () => {
    this.props.onBack();
  };

  /**
   * On continue press
   */
  onContinuePress = async () => {
    if (!this.state.sent) {
      this.setState({ sending: true });

      try {
        const data = await authService.forgot(this.state.username);
        this.setState({
          sent: true,
          msg: i18n.t('auth.requestNewPasswordSuccess'),
        });
      } catch (err) {
        showNotification('Oops. Please try again.');
        logService.exception('[ForgotPassword]', err);
      } finally {
        this.setState({ sending: false });
      }
    }
  };
}

const buttonContainerStyle = ThemedStyles.combine(
  'rowJustifyEnd',
  'marginTop4x',
  'paddingRight2x',
);

const subtitleStyle = ThemedStyles.combine(
  'subTitleText',
  'colorWhite',
  'marginVertical',
  'marginHorizontal3x',
);
const titleStyle = ThemedStyles.combine(
  'titleText',
  'colorWhite',
  'marginTop4x',
  'marginBottom7x',
  'marginHorizontal3x',
);

const continueStyle = ThemedStyles.combine('marginTop1x', 'marginLeft2x', {
  width: 138,
});
