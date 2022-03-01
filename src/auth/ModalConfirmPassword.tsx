//@ts-nocheck
import React, { Component } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

import Modal from 'react-native-modal';

import i18n from '../common/services/i18n.service';
import authService from '../auth/AuthService';
import { ComponentsStyle } from '../styles/Components';
import ThemedStyles from '../styles/ThemedStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import MText from '../common/components/MText';
import InputContainer from '~/common/components/InputContainer';
import { Button, H1, H2, H3, Row, ScreenSection } from '~/common/ui';

type PropsType = {
  onSuccess: Function;
  close: Function;
  isVisible: boolean;
};

export default class ModalConfirmPassword extends Component<PropsType> {
  state = {
    password: '',
    error: false,
  };

  async submit() {
    this.setState({
      error: false,
    });
    try {
      await authService.validatePassword(this.state.password);
      this.props.onSuccess(this.state.password);
      this.setState({
        password: '',
      });
    } catch (err) {
      this.setState({
        error: true,
      });
    }
  }

  render() {
    const theme = ThemedStyles.style;
    const msg = this.state.error ? (
      <MText style={styles.error}>{i18n.t('auth.invalidPassword')}</MText>
    ) : null;
    return (
      <Modal
        isVisible={this.props.isVisible}
        style={styles.modal}
        backdropColor={ThemedStyles.getColor('PrimaryBackground')}
        backdropOpacity={1}>
        <SafeAreaView style={[theme.flexContainer]}>
          {msg}
          <ScreenSection vertical="L">
            <Row align="centerBetween" stretch>
              <H3>{i18n.t('auth.confirmpassword')}</H3>
            </Row>
          </ScreenSection>
          <InputContainer
            autoFocus
            placeholder={i18n.t('auth.password')}
            onChangeText={value => this.setState({ password: value })}
            value={this.state.password}
            selectTextOnFocus={true}
            secureTextEntry={true}
          />
          <ScreenSection vertical="L">
            <Button
              onPress={() => this.submit()}
              type="action"
              bottom="L"
              size="large">
              {i18n.t('auth.confirmpassword')}
            </Button>
            <Button onPress={this.props.close}>{i18n.t('cancel')}</Button>
          </ScreenSection>
        </SafeAreaView>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  modal: { flex: 1, padding: 0, margin: 0 },
  error: {
    marginTop: 8,
    marginBottom: 8,
    color: '#c00',
    textAlign: 'center',
  },
});
