import React, { Component } from 'react';
import { Text, StyleSheet, View, Alert, Platform } from 'react-native';
import i18n from '../common/services/i18n.service';
import emailConfirmationService from '../common/services/email-confirmation.service';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { CommonStyle as CS } from '../styles/Common';
import { observer, inject } from 'mobx-react/native';
import isIphoneX from '../common/helpers/isIphoneX';

/**
 * Email Confirmation Message
 */
export default
@inject('user')
@observer
class EmailConfirmation extends Component {
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
  };

  /**
   * Render
   */
  render() {
    const show =
      !this.props.user.emailConfirmMessageDismiss &&
      this.props.user.me.email_confirmed === false;

    if (!show) {
      return null;
    }

    return (
      <View style={styles.container}>
        
        <View style={styles.body}>
          <Text style={[CS.fontM, CS.colorWhite]}>
            {i18n.t('emailConfirm.confirm')}
          </Text>
          <Text style={[CS.bold, CS.colorWhite]} onPress={this.send}>
            {i18n.t('emailConfirm.sendAgain')}
          </Text>
        </View>
        <Text style={[styles.modalCloseIcon, CS.colorWhite, CS.bold]} onPress={this.dismiss}>[Close]</Text>
      </View>
    );
  }
}

const topPosition = Platform.OS === 'ios' ? (isIphoneX ? 40 : 30) : 0;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#4690df',
    height: 70,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    width: '100%',
    top: topPosition,
    zIndex: 999,
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
