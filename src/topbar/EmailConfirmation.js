import React, {Component} from 'react';
import {Text, StyleSheet, View} from 'react-native';
import i18n from '../common/services/i18n.service';
import Touchable from '../common/components/Touchable';
import emailConfirmationService from '../common/services/email-confirmation.service';
import IonIcon from 'react-native-vector-icons/Ionicons';

export default class EmailConfirmation extends Component {
  send = () => {
    const sended = emailConfirmationService.send();
  };

  state = {
    dismiss: false,
  };

  dismiss = () => {
    this.setState({dismiss: true});
  };

  render() {
    const show =
      !this.state.dismiss && this.props.user.me.email_confirmed === false;
    return (
      show && <View style={styles.container}>
        <Text style={[styles.text, styles.paddingRight]}>{i18n.t('validation.confirm')}</Text>
        <Touchable style={styles.paddingRight} onPress={this.send}>
          <Text style={styles.textBold}>{i18n.t('validation.sendAgain')}</Text>
        </Touchable>
        <IonIcon
          style={styles.modalCloseIcon}
          size={28}
          name="ios-close"
          onPress={this.dismiss}
          color={'#FFF'}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#4690df',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  text: {
    color: '#fff',
  },
  textBold: {
    color: '#fff',
    fontWeight: '700'
  },
  modalCloseIcon: {
    position: 'absolute',
    alignSelf: 'flex-end',
    paddingRight: 15,
  },
  paddingRight: {
    paddingRight: 15,
  }
});
