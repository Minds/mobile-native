//@ts-nocheck
import React, { Component } from 'react';
import { StyleSheet, View, Alert, TouchableOpacity } from 'react-native';
import i18n from '../common/services/i18n.service';
import emailConfirmationService from '../common/services/email-confirmation.service';
import { observer, inject } from 'mobx-react';
import apiService from '../common/services/api.service';
import UserStore from '../auth/UserStore';
import withPreventDoubleTap from '../common/components/PreventDoubleTap';
import ThemedStyles from '../styles/ThemedStyles';
import MText from '../common/components/MText';

// prevent double tap in touchable
const TouchableOpacityCustom = withPreventDoubleTap(TouchableOpacity);

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
      this.dismiss();
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
    const theme = ThemedStyles.style;
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
          <MText style={[theme.fontM, theme.colorWhite]}>
            {i18n.t('emailConfirm.confirm')} {i18n.t('emailConfirm.didntGetit')}
          </MText>
          <TouchableOpacityCustom onPress={this.send}>
            <MText style={[theme.bold, theme.colorWhite]}>
              {i18n.t('emailConfirm.sendAgain')}
            </MText>
          </TouchableOpacityCustom>
        </View>
        <MText
          style={[styles.modalCloseIcon, theme.colorWhite, theme.bold]}
          onPress={this.dismiss}>
          [Close]
        </MText>
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
