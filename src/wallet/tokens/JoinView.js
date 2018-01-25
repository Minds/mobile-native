import React, {
  Component
} from 'react';

import {
  Text,
  TextInput,
  View
} from 'react-native';

import {
  observer,
  inject
} from 'mobx-react/native'

import PhoneInput from 'react-native-phone-input'

import { CommonStyle } from '../../styles/Common';
import { ComponentsStyle } from '../../styles/Components';
import Button from '../../common/components/Button';

/**
 * Token & rewards join view
 */
@inject('wallet', 'user')
export default class JoinView extends Component {

  state = {
    confirming: false,
    confirmation: '',
    invalidNumber: false,
    number: '',
    secret: '',
    error: ''
  }

  /**
   * Reset state
   */
  reset() {
    this.setState({
      confirming: false,
      confirmation: '',
      invalidNumber: false,
      number: '',
      secret: '',
      error: ''
    });
  }

  /**
   * Join
   */
  join = () => {
    const valid = this.refs.phone.isValidNumber();

    if (!valid) {
      this.setState({invalidNumber: true});
      return;
    }

    const number = this.refs.phone.getValue();

    this.props.wallet.join(number)
    .then(({secret}) => {
      this.setState({
        secret,
        number,
        confirming: true
      });
    })
    .catch(e => {
      this.setState({error: e.message});
      console.log(e);
    });
  }

  /**
   * Confirm
   */
  confirm = () => {
    this.props.wallet.confirm(this.state.number, this.state.confirmation, this.state.secret)
      .then(response => {
        console.log(response)
        this.props.user.setPhoneHash(response.phone_number_hash);
      })
      .catch(e => {
        this.setState({ error: e.message });
        console.log(e);
      })
  }

  /**
   * Render
   */
  render() {
    const body = this.getBody();

    const error = this.state.error ? <Text style={[CommonStyle.fontL, CommonStyle.colorDanger]}>{this.state.error}</Text> : null

    return (
      <View>
        <Text style={CommonStyle.fontXXL}>Welcome to Rewards</Text>
        <Text style={CommonStyle.fontS}>Rewards Tokens enable creators to earn from interactions on their content. You earn tokens based on a daily contributions pool. At the end of each day, your contributions score will be calculated and you will receive a share of the daily reward pool. In order to verify you are a unique users, we require a phone number to be provided. Your phone number will be securely hashed and sent alongside all interactions to protect against fraud and gaming.</Text>
        {error}
        {body}
      </View>
    )
  }

  /**
   * Change confirmation value
   */
  changeConfirmation = (val) => {
    this.setState({confirmation: val});
  }

  /**
   * Cancel
   */
  cancel = () => {
    this.reset();
  }

  /**
   * Get body
   */
  getBody() {
    if (this.state.confirming) {
      return (
        <View>
          <View style={[CommonStyle.marginTop3x, CommonStyle.marginBottom3x]}>
            <TextInput ref="input" onChangeText={this.changeConfirmation} style={ComponentsStyle.passwordinput} underlineColorAndroid="transparent" value={this.state.confirmation} keyboardType="numeric" />
            <Text style={CommonStyle.fontXS}>Please enter the code we just sent you, to verify that your number is correct</Text>
          </View>
          <View style={[CommonStyle.rowJustifyStart]}>
            <Button text={'Cancel'} onPress={this.cancel} />
            <Button text={'Confirm'} onPress={this.confirm} />
          </View>
        </View>
      )
    } else {
      return (
        <View>
          <View style={[CommonStyle.marginTop3x, CommonStyle.marginBottom3x]}>
            <PhoneInput ref='phone' style={ComponentsStyle.passwordinput} />
            {this.state.invalidNumber && <Text style={[CommonStyle.fontS, CommonStyle.colorDanger]}>The number is invalid</Text>}
            <Text style={CommonStyle.fontXS}>Please enter your phone number in order to join the rewards program</Text>
          </View>
          <Button text={'Join'} onPress={this.join} />
        </View>
      )
    }
  }
}