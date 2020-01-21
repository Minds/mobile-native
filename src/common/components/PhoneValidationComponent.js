import React, {
  Component
} from 'react';

import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

import {
  inject,
  observer
} from 'mobx-react/native'

import PhoneInput from 'react-native-phone-input'

import TransparentButton from './TransparentButton';
import NavNextButton from './NavNextButton';

import Colors from '../../styles/Colors';
import stylesheet from '../../onboarding/stylesheet';
import { CommonStyle as CS } from '../../styles/Common';
import i18n from '../services/i18n.service';
import logService from '../services/log.service';
import ListItemButton from './ListItemButton';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ComponentsStyle } from '../../styles/Components';

@inject('user', 'wallet')
@observer
export default class PhoneValidationComponent extends Component {
  state = {
    inProgress: false,
    confirming: false,
    confirmFailed: false,
    smsAllowed: true,
    phone: '+1',
    secret: '',
    code: '',
    error: '',
    wait: 60,
    confirmed: false,
  }

  componentDidMount() {
    // this.props.onSetNavNext(this.getNextButton());
  }

  //

  async join(retry = false) {
    if (this.state.inProgress || (!retry && !this.canJoin())) {
      return;
    }

    this.setState({ inProgress: true, error: '',confirming: false, confirmFailed: false });

    try {
      let { secret } = await this.props.wallet.join(this.state.phone, retry);

      this.setState({
        secret,
        confirming: true,
        inProgress: false,
      });

    } catch (e) {
      const error = (e && e.message) || 'Unknown server error';
      this.setState({ error, inProgress: false });
      console.error(e);
    }
  }

  async confirm() {

    if (this.state.inProgress || !this.canConfirm()) {
      return;
    }

    this.setState({ inProgress: true, error: '' });

    try {
      await this.props.wallet.confirm(this.state.phone, this.state.code, this.state.secret);
      this.props.user.setRewards(true);
      this.setState({ inProgress: false, confirmed: true});
    } catch (e) {
      const error = (e && e.message) || 'Unknown server error';
      this.setState({ error });
      logService.exception(e);
    } finally {
      this.setState({ inProgress: false });
    }
  }

  //

  setPhone = phone => this.setState({ phone });

  setCode = code => this.setState({ code });

  canJoin() {
    return this.refs.phoneInput && this.refs.phoneInput.isValidNumber()
  }

  joinAction = () => this.join();

  rejoinAction = () => this.join(true);

  canConfirm() {
    return this.state.code.length > 0;
  }

  confirmAction = () => this.confirm();

  //

  getInputNumberPartial() {
    let joinButtonContent = <Text style={[
      CS.colorPrimaryText,
      CS.padding,
      !this.canJoin() ? CS.colorSecondaryText : CS.colorPrimaryText
    ]}>{i18n.t('validate')}</Text>

    if (this.state.inProgress) {
      joinButtonContent = <ActivityIndicator size="small" color={Colors.primary} />;
    }

    return (
      <View>
        <View style={[CS.rowStretch]} testID="RewardsOnboarding">
          <PhoneInput
            disabled={this.state.inProgress}
            style={[
              stylesheet.col,
              stylesheet.colFirst,
              stylesheet.phoneInput,
              ComponentsStyle.loginInputNew,
              CS.marginRight2x,
            ]}
            textStyle={CS.colorPrimaryText}
            value={this.state.phone}
            onChangePhoneNumber={this.setPhone}
            ref="phoneInput"
            placeholder={i18n.t('onboarding.phoneNumber')}
          />

          <ListItemButton onPress={this.joinAction} disabled={!this.canJoin()}>
            {joinButtonContent}
          </ListItemButton>
        </View>
      </View>
    );
  }

  getConfirmNumberPartial() {
    let confirmButtonContent = 'CONFIRM';

    if (this.state.inProgress) {
      confirmButtonContent = <ActivityIndicator size="small" color={Colors.primary} />;
    }

    return (
      <View>
        <Text style={CS.colorPrimaryText}>
          {i18n.t('onboarding.weJustSentCode', {phone: this.state.phone})}
        </Text>
        <View style={[style.cols, style.form]}>
          <TextInput
            style={[
              stylesheet.col,
              stylesheet.colFirst,
              stylesheet.phoneInput,
              ComponentsStyle.loginInputNew,
              CS.marginRight2x,
            ]}
            value={this.state.code}
            onChangeText={this.setCode}
            placeholder={i18n.t('onboarding.confirmationCode')}
            keyboardType="numeric"
          />

          <ListItemButton disabled={!this.canConfirm()} onPress={this.confirmAction}>
            <Icon 
              name={'check'} 
              size={26} 
              style={!this.canConfirm() ? CS.colorSecondaryText : CS.colorDone} 
            />
          </ListItemButton>
        </View>
      </View>
    );
  }

  getNumberConfirmedPartial() {
    return (
      <Text style={CS.colorPrimaryText}>{i18n.t('onboarding.numberConfirmed')}</Text>
    );
  }

  getFormPartial() {
    if (!this.state.confirming)
      return this.getInputNumberPartial();
    else if (!this.state.confirmed)
      return this.getConfirmNumberPartial();
    else
      return this.getNumberConfirmedPartial();
  }

  getNextButton = () => {
    return (
      <NavNextButton
        onPress={this.props.onNext}
        title="SKIP"
        color={Colors.darkGreyed}
      />
    );
  }

  render() {
    return (
      <View>
        <View>
          {this.getFormPartial()}
        </View>
        {!!this.state.error && <View>
          <Text style={style.error}>{this.state.error}</Text>
        </View>}
      </View>
    );
  }
}

const style = StyleSheet.create(stylesheet);
