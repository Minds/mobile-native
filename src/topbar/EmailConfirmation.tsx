//@ts-nocheck
import React, { Component } from 'react';
import { Text, StyleSheet, View, Alert } from 'react-native';
import i18n from '../common/services/i18n.service';
import emailConfirmationService from '../common/services/email-confirmation.service';
import { CommonStyle as CS } from '../styles/Common';
import { observer, inject } from 'mobx-react';
import apiService from '../common/services/api.service';
import UserStore from '../auth/UserStore';

interface Props {
  user?: UserStore;
}

/**
 * Email Confirmation Message
 */
@inject('user')
@observer
class EmailConfirmation extends Component<Props> {
  /**
   * Send confirmation email
   */
  send = async () => {
    if (await emailConfirmationService.send()) {
      Alert.alert(i18n.t('emailConfirm.sent'));
    } else {
      Alert.alert(i18n.t('pleaseTryAgain'));
    }
  };

  /**
   * Dismiss message
   */
  dismiss = () => {
    this.props.user.setDissmis(true);
    apiService.setMustVerify(false);
  };

  /**
   * Render
   */
  render() {
    const show =
      apiService.mustVerify ||
      (!this.props.user.emailConfirmMessageDismiss &&
        this.props.user.me.email_confirmed === false);

    if (!show) {
      return null;
    }

    return (
      <View style={styles.container}>
        <View style={styles.body}>
          <Text style={[CS.fontM, CS.colorWhite]}>
            {i18n.t('emailConfirm.confirm')} {i18n.t('emailConfirm.didntGetit')}
          </Text>
          <Text style={[CS.bold, CS.colorWhite]} onPress={this.send}>
            {i18n.t('emailConfirm.sendAgain')}
          </Text>
        </View>
        <Text
          style={[styles.modalCloseIcon, CS.colorWhite, CS.bold]}
          onPress={this.dismiss}>
          [Close]
        </Text>
      </View>
    );
  }
}

export default EmailConfirmation;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#4690df',
    height: 95,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  body: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseIcon: {
    alignSelf: 'flex-end',
    paddingRight: 15,
  },
});
