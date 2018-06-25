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
import { CommonStyle } from '../../../styles/Common';

@inject('user', 'wallet')
@observer
export default class WalletOnboardingJoinRewardsScreen extends Component {
  state = {
    inProgress: false,
    confirming: false,
    confirmFailed: false,
    smsAllowed: true,
    phone: '+1',
    secret: '',
    code: '',
    error: '',
    wait: 60
  }

  componentDidMount() {
    this.props.onSetNavNext(this.getNextButton());
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
        wait: 60
      });

      this.waiting = setInterval(() => {
        this.setState({wait: this.state.wait - 1});
      }, 1000);

      // listen for the sms for 20 seconds
      const code = await this.props.wallet.listenForSms();

      clearInterval(this.waiting);

      switch(code) {
        case false: // sms not recived
          this.setState({confirmFailed: true});
          break;
        case -1: // sms read permission not allowed
          this.setState({smsAllowed: false})
          break;
        default:
          this.setState({code}, () => this.confirm());
      }

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

  rejoinAction = () => this.join(true);

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

    const body = this.state.confirmFailed ?
      <Text style={[CommonStyle.fontXL, CommonStyle.textCenter]}>Sms was not received <Text style={CommonStyle.colorPrimary} onPress={this.rejoinAction}>Try again</Text></Text>:
      this.state.smsAllowed ?
        <Text style={[CommonStyle.colorPrimary, CommonStyle.fontXL, CommonStyle.textCenter]}> Keep the app visible and we will detect it automatically: {this.state.wait}</Text>:
        null;

    return (
      <View>
        <Text style={style.p}>
          We just sent the code to {this.state.phone} in
          order to verify that your number is correct.
        </Text>
        {body}

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

        <Text style={[style.p, style.note]}>
          Note: Minds does not store the phone numbers you provide. The numbers
          are hashed using SHA-256 and combined with a salt key for privacy purposes.
        </Text>
      </View>
    );
  }
}

const style = StyleSheet.create(stylesheet);
