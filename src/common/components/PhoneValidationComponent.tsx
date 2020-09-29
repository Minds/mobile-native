import React, { Component } from 'react';

import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  TextInputProps,
} from 'react-native';

import { inject, observer } from 'mobx-react';

import PhoneInput from 'react-native-phone-input';

import NavNextButton from './NavNextButton';

import Colors from '../../styles/Colors';
import stylesheet from '../../onboarding/stylesheet';
import i18n from '../services/i18n.service';
import logService from '../services/log.service';
import ListItemButton from './ListItemButton';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { ComponentsStyle } from '../../styles/Components';
import ThemedStyles from '../../styles/ThemedStyles';
import twoFactorAuthenticationService from '../services/two-factor-authentication.service';
import { BottomOptionsStoreType } from './BottomOptionPopup';
import type WalletStore from '../../wallet/WalletStore';
import type UserStore from '../../auth/UserStore';
import ActivityIndicator from './ActivityIndicator';

type propsType = {
  TFA?: any;
  TFAConfirmed?: boolean;
  bottomStore?: BottomOptionsStoreType;
  inputStyles?: any;
  onNext?: Function;
  textStyle?: any;
  wallet?: WalletStore;
  user?: UserStore;
} & TextInputProps;

@inject('user', 'wallet')
@observer
export default class PhoneValidationComponent extends Component<propsType> {
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
    password: '',
    TFAConfirmed: false,
  };

  phoneInput = React.createRef<PhoneInput>();

  constructor(props: propsType) {
    super(props);

    this.state.TFAConfirmed = Boolean(
      this.props.TFAConfirmed && this.props.TFAConfirmed === true,
    );
  }

  async join(retry = false) {
    if (
      this.state.inProgress ||
      (!retry && !this.canJoin()) ||
      !this.props.wallet
    ) {
      return;
    }

    this.setState({
      inProgress: true,
      error: '',
      confirming: false,
      confirmFailed: false,
    });

    try {
      let { secret } = this.props.TFA
        ? await twoFactorAuthenticationService.authenticate(this.state.phone)
        : await this.props.wallet.join(this.state.phone, retry);

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
    if (
      this.state.inProgress ||
      !this.canConfirm() ||
      !this.props.wallet ||
      !this.props.user
    ) {
      return;
    }

    this.setState({ inProgress: true, error: '' });

    try {
      if (this.props.TFA) {
        await twoFactorAuthenticationService.check(
          this.state.phone,
          this.state.code,
          this.state.secret,
        );
      } else {
        await this.props.wallet.confirm(
          this.state.phone,
          this.state.code,
          this.state.secret,
        );
        this.props.user.setRewards(true);
      }
      this.setState({ inProgress: false, confirmed: true });
    } catch (e) {
      const error = (e && e.message) || 'Unknown server error';
      this.setState({ error });
      logService.exception(e);
    } finally {
      this.setState({ inProgress: false });
    }
  }

  setPhone = (phone) => this.setState({ phone });

  setCode = (code) => this.setState({ code });

  setPassword = (password) => this.setState({ password });

  canJoin() {
    return (
      this.phoneInput &&
      this.phoneInput.current &&
      this.phoneInput.current.isValidNumber()
    );
  }

  joinAction = () => this.join();

  rejoinAction = () => this.join(true);

  canConfirm() {
    return this.state.code.length > 0;
  }

  confirmAction = () => this.confirm();

  getInputNumberPartial() {
    const CS = ThemedStyles.style;
    let joinButtonContent = (
      <Text
        style={[
          CS.colorPrimaryText,
          CS.padding,
          !this.canJoin() ? CS.colorSecondaryText : CS.colorPrimaryText,
        ]}>
        {i18n.t('validate')}
      </Text>
    );

    if (this.state.inProgress) {
      joinButtonContent = (
        <ActivityIndicator size="small" color={Colors.primary} />
      );
    }

    const joinActionButton = !this.props.bottomStore && (
      <ListItemButton
        onPress={this.joinAction}
        disabled={!this.canJoin()}
        style={[CS.borderPrimary, CS.borderHair]}>
        {joinButtonContent}
      </ListItemButton>
    );

    /*if (this.props.bottomStore) {
      this.props.bottomStore.setOnPressDone(this.joinAction);
    }*/

    const defaultStyles = [
      stylesheet.col,
      stylesheet.colFirst,
      stylesheet.phoneInput,
      ComponentsStyle.loginInputNew,
      CS.marginRight2x,
      CS.borderPrimary,
    ];

    return (
      <View>
        <View style={[CS.rowStretch]} testID="RewardsOnboarding">
          <PhoneInput
            disabled={this.state.inProgress}
            style={this.props.inputStyles || defaultStyles}
            textStyle={ThemedStyles.style.colorPrimaryText}
            value={this.state.phone}
            onChangePhoneNumber={this.setPhone}
            ref={this.phoneInput}
            placeholder={i18n.t('onboarding.phoneNumber')}
            textProps={{
              onFocus: this.props.onFocus,
              onBlur: this.props.onBlur,
            }}
          />
          {joinActionButton}
        </View>
      </View>
    );
  }

  getConfirmNumberPartial() {
    const CS = ThemedStyles.style;

    const joinActionButton = !this.props.bottomStore && (
      <ListItemButton
        disabled={!this.canConfirm()}
        onPress={this.confirmAction}>
        <Icon
          name={'check'}
          size={26}
          style={!this.canConfirm() ? CS.colorSecondaryText : CS.colorDone}
        />
      </ListItemButton>
    );

    const text = !this.props.bottomStore && (
      <Text style={CS.colorPrimaryText}>
        {i18n.t('onboarding.weJustSentCode', { phone: this.state.phone })}
      </Text>
    );

    const defaultStyles = [
      stylesheet.col,
      stylesheet.colFirst,
      stylesheet.phoneInput,
      ComponentsStyle.loginInputNew,
      CS.marginRight2x,
      CS.borderPrimary,
    ];

    return (
      <View>
        {text}
        <View style={[style.cols, style.form]}>
          <TextInput
            style={this.props.inputStyles || defaultStyles}
            value={this.state.code}
            onChangeText={this.setCode}
            placeholder={
              !this.props.bottomStore
                ? i18n.t('onboarding.confirmationCode')
                : ''
            }
            placeholderTextColor={ThemedStyles.getColor('secondary_text')}
            keyboardType="numeric"
          />
          {joinActionButton}
        </View>
      </View>
    );
  }

  async remove2FA() {
    try {
      const { status } = await twoFactorAuthenticationService.remove(
        this.state.password,
      );
      if (status === 'error') {
        throw new Error('invalid password');
      } else {
        this.setState({ TFAConfirmed: false });
      }
    } catch (err) {
      Alert.alert(i18n.t('ops'), i18n.t('auth.invalidPassword'));
    }
  }

  getNumberConfirmedPartial() {
    const CS = ThemedStyles.style;
    const component = this.props.TFA ? (
      <View>
        <Text style={[CS.colorPrimaryText, CS.marginBottom4x]}>
          {i18n.t('settings.TFAEnabled')}
        </Text>
        <View style={[style.cols, style.form]}>
          <TextInput
            style={[
              stylesheet.col,
              stylesheet.colFirst,
              stylesheet.phoneInput,
              ComponentsStyle.loginInputNew,
              CS.marginRight2x,
              CS.borderPrimary,
              CS.colorPrimaryText,
            ]}
            value={this.state.password}
            onChangeText={this.setPassword}
            placeholder={i18n.t('passwordPlaceholder')}
            placeholderTextColor={ThemedStyles.getColor('secondary_text')}
          />
          <ListItemButton onPress={this.remove2FA}>
            <Text style={CS.colorPrimaryText}>
              {i18n.t('settings.TFADisable')}
            </Text>
          </ListItemButton>
        </View>
      </View>
    ) : (
      <Text style={CS.colorPrimaryText}>
        {i18n.t('onboarding.numberConfirmed')}
      </Text>
    );
    return component;
  }

  getFormPartial() {
    if (this.state.TFAConfirmed) {
      return this.getNumberConfirmedPartial();
    } else if (!this.state.confirming) {
      return this.getInputNumberPartial();
    } else if (!this.state.confirmed) {
      return this.getConfirmNumberPartial();
    } else {
      return this.getNumberConfirmedPartial();
    }
  }

  getNextButton = () => {
    return (
      <NavNextButton
        onPress={this.props.onNext}
        title="SKIP"
        color={Colors.darkGreyed}
      />
    );
  };

  render() {
    return (
      <View>
        <View>{this.getFormPartial()}</View>
        {!!this.state.error && (
          <View>
            <Text style={style.error}>{this.state.error}</Text>
          </View>
        )}
      </View>
    );
  }
}

const style = StyleSheet.create(stylesheet);
