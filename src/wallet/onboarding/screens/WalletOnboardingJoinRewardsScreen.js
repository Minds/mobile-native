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

import Icon from 'react-native-vector-icons/MaterialIcons';

import TransparentButton from '../../../common/components/TransparentButton';
import NavNextButton from '../../../common/components/NavNextButton';

import Colors from '../../../styles/Colors';

import stylesheet from '../../../onboarding/stylesheet';

@inject('user', 'wallet')
@observer  
export default class WalletOnboardingJoinRewardsScreen extends Component {
  state = {
    inProgress: false,
    confirming: false,
    phone: '+1',
    secret: '',
    code: '',
    error: '',
  }

  componentDidMount() {
    this.props.onSetNavNext(this.getNextButton());
  }

  //

  async join() {
    if (this.state.inProgress || !this.canJoin()) {
      return;
    }

    this.setState({ inProgress: true, error: '' });

    try {
      let { secret } = await this.props.wallet.join(this.state.phone);

      this.setState({
        secret,
        confirming: true
      });
    } catch (e) {
      const error = (e && e.message) || 'Unknown server error';
      this.setState({ error });
      console.error(e);
    } finally {
      this.setState({ inProgress: false });
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
      this.props.onNext({ rewards: true });
    } catch (e) {
      const error = (e && e.message) || 'Unknown server error';
      this.setState({ error });
      console.error(e);
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

  canConfirm() {
    return this.state.code.length > 0;
  }

  confirmAction = () => this.confirm();

  //

  getInputNumberPartial() {
    let joinButtonContent = 'JOIN';

    if (this.state.inProgress) {
      joinButtonContent = <ActivityIndicator size="small" color={Colors.primary} />;
    }

    return (
      <View>
        <Text style={style.p}>
          To start earning rewards, you will need to enter a unique phone
          number.
        </Text>

        <View style={[style.cols, style.form]}>
          <PhoneInput
            disabled={this.state.inProgress}
            style={{ ...stylesheet.col, ...stylesheet.colFirst, ...stylesheet.phoneInput }}
            textStyle={stylesheet.phoneTextInput}
            value={this.state.phone}
            onChangePhoneNumber={this.setPhone}
            ref="phoneInput"
            placeholder="Phone Number"
          />

          <TransparentButton
            style={[style.col, style.colLazy]}
            disabled={!this.canJoin()}
            onPress={this.joinAction}
            title={joinButtonContent}
            color={Colors.primary}
          />
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
        <Text style={style.p}>
          Please enter the code we just sent to {this.state.phone} in
          order to verify that your number is correct.
        </Text>

        <View style={[style.cols, style.form]}>
          <TextInput
            style={[style.col, style.colFirst, style.textInput, style.textInputCentered]}
            value={this.state.code}
            onChangeText={this.setCode}
            placeholder="Confirmation Code"
            keyboardType="numeric"
          />

          <TransparentButton
            style={[style.col, style.colLazy, style.colsVCenter]}
            disabled={!this.canConfirm()}
            onPress={this.confirmAction}
            title={confirmButtonContent}
            color={Colors.primary}
          />
        </View>
      </View>
    );
  }


  getFormPartial() {
    if (!this.state.confirming)
      return this.getInputNumberPartial();
    else
      return this.getConfirmNumberPartial();
  }

  //


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
        <Text style={style.h1}>Rewards</Text>

        <Text style={style.p}>
          You can earn tokens for your contributions to the Minds network.
          The more interactions on your content, the greater your share of
          the daily token reward pool to your OffChain address.
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
