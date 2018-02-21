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

import Icon from 'react-native-vector-icons/MaterialIcons';

import keychainService from '../../../common/services/keychain.service';

import TransparentButton from '../../../common/components/TransparentButton';
import NavNextButton from '../../../common/components/NavNextButton';

import Colors from '../../../styles/Colors';

import stylesheet from '../stylesheet';
import BlockchainWalletService from '../../../blockchain/wallet/BlockchainWalletService';
import BlockchainApiService from '../../../blockchain/BlockchainApiService';

export default class WalletOnboardingOnChainSetupScreen extends Component {
  state = {
    inProgress: false,
    pin: '',
    pinConfirmation: '',
    confirmingPin: false,
    alreadyHasPin: false,
    error: ''
  }

  async componentWillMount() {
    if (await keychainService.hasSecret('wallet')) {
      this.setState({ alreadyHasPin: true, confirmingPin: true });
    }
  }

  componentDidMount() {
    this.props.onSetNavNext(this.getNextButton());
  }

  create() {
    if (!this.canCreate()) {
      return;
    }

    this.setState({ confirmingPin: true });
  }

  retry() {
    this.setState({ confirmingPin: false, pin: '', pinConfirmation: '' });
  }

  async confirm() {
    if (this.state.inProgress || !this.canConfirm()) {
      return;
    }

    this.setState({ inProgress: true });

    try {
      if (!(await keychainService.hasSecret('wallet'))) {
        await keychainService.setSecretIfEmpty('wallet', this.state.pin);
      }

      const address = await BlockchainWalletService.create();

      await BlockchainApiService.setWallet(address);

      this.props.onNext({ address });
    } catch (e) {
      error = (e && e.message) || 'Unknown error';
      this.setState({ error });
      console.error(e);
    } finally {
      this.setState({ inProgress: false });
    }
  }

  canCreate() {
    return this.state.pin && /^[0-9]{6}$/.test(this.state.pin);
  }

  canConfirm() {
    return this.state.alreadyHasPin ||
      (this.state.pin && /^[0-9]{6}$/.test(this.state.pin) && this.state.pin === this.state.pinConfirmation);
  }

  //

  setPin = pin => this.setState({ pin: pin.replace(/[^0-9]/g, '') });

  getPin() {
    return this.state.pin;
  }

  setPinConfirmation = pinConfirmation => this.setState({ pinConfirmation: pinConfirmation.replace(/[^0-9]/g, '') });

  getPinConfirmation() {
    return this.state.pinConfirmation;
  }

  createAction = () => this.create();
  retryAction = () => this.retry();
  confirmAction = () => this.confirm();

  getPinFormPartial() {
    return (
      <View>
        <Text style={style.p}>
          To create a new wallet address, please enter a 6-digit PIN code
          that will be used to encrypt your private key onto this device.
        </Text>

        <View style={[style.cols, style.form]}>
          <TextInput
            style={[style.col, style.colFirst, style.textInput, style.textInputCentered]}
            value={this.getPin()}
            onChangeText={this.setPin}
            placeholder="6-digit PIN"
            keyboardType="numeric"
            secureTextEntry={true}
            maxLength={6}
          />

          <TransparentButton
            style={[style.col, style.colLazy]}
            disabled={!this.canCreate()}
            onPress={this.createAction}
            title="CREATE"
            color={Colors.primary}
          />
        </View>
      </View>
    );
  }

  getConfirmPinFormPartial() {
    let confirmButtonContent = 'CONFIRM';

    if (this.state.inProgress) {
      confirmButtonContent = <ActivityIndicator size="small" color={Colors.primary} />;
    }

    return (
      <View>
        <Text style={style.p}>
          Please confirm once more your 6-digit PIN code. Once confirmed
          your wallet will be created on this device and attached
          to your account.
        </Text>

        <View style={[style.cols, style.form]}>
          <TextInput
            style={[style.col, style.colFirst, style.textInput, style.textInputCentered]}
            value={this.getPinConfirmation()}
            onChangeText={this.setPinConfirmation}
            placeholder="6-digit PIN"
            keyboardType="numeric"
            secureTextEntry={true}
            maxLength={6}
          />

          <TransparentButton
            disabled={this.state.inProgress}
            style={[style.col, style.colLazy]}
            onPress={this.retryAction}
            title="RETRY"
            color={Colors.darkGreyed}
            borderColor={Colors.greyed}
          />

          <TransparentButton
            style={[style.col, style.colLazy]}
            disabled={!this.canConfirm()}
            onPress={this.confirmAction}
            title={confirmButtonContent}
            color={Colors.primary}
          />
        </View>
      </View>
    );
  }

  getAlreadyHasPinFormPartial() {
    let createButtonContent = 'CREATE';

    if (this.state.inProgress) {
      createButtonContent = <ActivityIndicator size="small" color={Colors.primary} />;
    }

    return (
      <View>
        <Text style={style.p}>
          Your 6-digit PIN is already setup, you just need to confirm the 
          wallet creation. Once confirmed your wallet will be created on
          this device and attached to your account.
        </Text>

        <View style={[style.cols, style.colsCenter, style.form]}>
          {this.state.alreadyHasPin && <Text
            style={[style.col, style.colFirst, style.primaryLegendUppercase]}
          >
            PIN ALREADY SETUP
          </Text>}

          <TransparentButton
            style={[style.col, style.colLazy]}
            disabled={!this.canConfirm()}
            onPress={this.confirmAction}
            title={createButtonContent}
            color={Colors.primary}
          />
        </View>
      </View>
    );
  }

  getFormPartial() {
    if (!this.state.confirmingPin)
      return this.getPinFormPartial();
    else
      return this.state.alreadyHasPin ? this.getAlreadyHasPinFormPartial() : this.getConfirmPinFormPartial();
  }

  //

  getNextButton = () => {
    return (
      <NavNextButton
        onPress={this.props.onNext}
        title="SKIP, I'M NOT INTERESTED"
        color={Colors.darkGreyed}
      />
    );
  }

  render() {
    return (
      <View>
        <Text style={style.h1}>Setup your OnChain address</Text>

        <Text style={style.p}>
          To receive OnChain payments from other channels (eg, from a Wire
          or a Boost), you will need to let us know which address to direct
          these tokens to.
        </Text>

        <Text style={style.p}>
          This address will be listed in your wallet as your Receiver Address
          and can be changed at any time.
        </Text>

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
