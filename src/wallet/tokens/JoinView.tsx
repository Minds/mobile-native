//@ts-nocheck
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
} from 'mobx-react'

import PhoneInput from 'react-native-phone-input'

import { CommonStyle } from '../../styles/Common';
import { ComponentsStyle } from '../../styles/Components';
import Button from '../../common/components/Button';
import i18n from '../../common/services/i18n.service';

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
          {i18n.t('wallet.join.rewardsDescription')}
        </Text>

        {error}
        {body}

        <Text style={[CommonStyle.fontS, { marginTop: 20, color: '#444', padding: 4 }]}>
          {i18n.t('wallet.join.note')}
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
              placeholder={i18n.t('wallet.join.pleaseEnterCode')}
              keyboardType="numeric"
            />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'stretch', marginTop: 8 }}>
            <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingRight: 32, paddingLeft: 2 }}>
              <Text style={[CommonStyle.fontXS, { color: '#444'}]}>{i18n.t('wallet.join.pleaseEnterCodeDescription')}</Text>
            </View>

            <View style={[CommonStyle.rowJustifyStart]}>
              <TouchableHighlight
                underlayColor='transparent'
                onPress={ this.cancel }
                style={[
                  ComponentsStyle.button,
                  { backgroundColor: 'transparent', marginRight: 4 },
                ]}>
                <Text style={[CommonStyle.paddingLeft, CommonStyle.paddingRight ]}>{i18n.t('cancel')}</Text>
              </TouchableHighlight>
              <TouchableHighlight
                underlayColor='transparent'
                onPress={ this.confirm }
                style={[
                  ComponentsStyle.button,
                  ComponentsStyle.buttonAction,
                  { backgroundColor: 'transparent' },
                ]}>
                <Text style={[CommonStyle.paddingLeft, CommonStyle.paddingRight, CommonStyle.colorPrimary]}>{i18n.t('confirm')}</Text>
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
              {this.state.invalidNumber && <Text style={[CommonStyle.fontS, CommonStyle.colorDanger]}>{i18n.t('wallet.join.numberInvalid')}</Text>}
              <Text style={[CommonStyle.fontXS, { color: '#444' }]}>{i18n.t('wallet.join.pleaseEnterPhone')}</Text>
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
                <Text style={[CommonStyle.paddingLeft, CommonStyle.paddingRight, CommonStyle.colorPrimary]}>{i18n.t('join')}</Text>
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
