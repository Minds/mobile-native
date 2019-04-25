import React, {
  Component
} from 'react';

import {
  Text,
  TextInput,
  View,
  TouchableHighlight,
  StyleSheet,
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
      });
  }

  /**
   * Confirm
   */
  confirm = () => {
    this.props.wallet.confirm(this.state.number, this.state.confirmation, this.state.secret)
      .then(response => {
        this.props.user.setRewards(true);
      })
      .catch(e => {
        this.setState({ error: e.message });
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
        <Text style={[CommonStyle.fontS, { marginTop: 8, color: '#444', padding: 4 }]}>
          Rewards Tokens enable creators to earn from interactions on their content.
          You earn tokens based on a daily contributions pool.
          At the end of each day, your contributions score will be calculated and you will receive a share of the daily reward pool.
          In order to verify you are a unique users, we require a phone number to be provided.
          Your phone number will be securely hashed and sent alongside all interactions to protect against fraud and gaming.
        </Text>

        {error}
        {body}

        <Text style={[CommonStyle.fontS, { marginTop: 20, color: '#444', padding: 4 }]}>
          Note: Minds does not store the phone numbers you provide. The numbers
          are hashed using SHA-256 and combined with a salt key for encryption
          and privacy purposes.
        </Text>
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
            <TextInput
              ref="input"
              onChangeText={this.changeConfirmation}
              style={[ComponentsStyle.input, { fontSize: 16 }]}
              underlineColorAndroid="transparent"
              value={this.state.confirmation}
              placeholder="Please enter your code..."
              keyboardType="numeric"
            />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'stretch', marginTop: 8 }}>
            <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingRight: 32, paddingLeft: 2 }}>
              <Text style={[CommonStyle.fontXS, { color: '#444'}]}>Please enter the code we just sent you, to verify that your number is correct</Text>
            </View>

            <View style={[CommonStyle.rowJustifyStart]}>
              <TouchableHighlight
                underlayColor='transparent'
                onPress={ this.cancel }
                style={[
                  ComponentsStyle.button,
                  { backgroundColor: 'transparent', marginRight: 4 },
                ]}>
                <Text style={[CommonStyle.paddingLeft, CommonStyle.paddingRight ]}>Cancel</Text>
              </TouchableHighlight>
              <TouchableHighlight
                underlayColor='transparent'
                onPress={ this.confirm }
                style={[
                  ComponentsStyle.button,
                  ComponentsStyle.buttonAction,
                  { backgroundColor: 'transparent' },
                ]}>
                <Text style={[CommonStyle.paddingLeft, CommonStyle.paddingRight, CommonStyle.colorPrimary]}>Confirm</Text>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      )
    } else {
      return (
        <View>
          <View style={[CommonStyle.marginTop3x, CommonStyle.marginBottom3x]}>
            <View style={ComponentsStyle.input}>
              <PhoneInput ref='phone' textStyle={{ letterSpacing: 18, fontSize: 16 }} />
            </View>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'stretch', marginTop: 8 }}>
            <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingRight: 56, paddingLeft: 2 }}>
              {this.state.invalidNumber && <Text style={[CommonStyle.fontS, CommonStyle.colorDanger]}>The number is invalid</Text>}
              <Text style={[CommonStyle.fontXS, { color: '#444' }]}>Please enter your phone number in order to join the rewards program</Text>
            </View>
            <View>
              <TouchableHighlight
                underlayColor='transparent'
                onPress={ this.join }
                style={[
                  ComponentsStyle.button,
                  ComponentsStyle.buttonAction,
                  { backgroundColor: 'transparent' },
                ]}>
                <Text style={[CommonStyle.paddingLeft, CommonStyle.paddingRight, CommonStyle.colorPrimary]}>Join</Text>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      )
    }
  }
}

const styles = StyleSheet.create({

});
