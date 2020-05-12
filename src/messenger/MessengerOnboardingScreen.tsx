//@ts-nocheck
import React, { Component } from 'react';

import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

import { inject, observer } from 'mobx-react';

import api from './../common/services/api.service';

import PhoneInput from 'react-native-phone-input';

import Icon from 'react-native-vector-icons/MaterialIcons';

import TransparentButton from '../common/components/TransparentButton';
import NavNextButton from '../common/components/NavNextButton';

import Colors from '../styles/Colors';
import { CommonStyle } from '../styles/Common';
import { ComponentsStyle } from '../styles/Components';
import stylesheet from '../onboarding/stylesheet';
import i18n from '../common/services/i18n.service';

@inject('messengerList')
@observer
export default class MessengerOnboardingScreen extends Component {
  state = {
    inProgress: false,
    password: null,
    password2: null,
  };

  componentDidMount() {
    this.didChange();
  }

  getNextButton = () => {
    let next = (
      <NavNextButton
        onPress={this.props.onNext}
        title={i18n.t('done').toUpperCase()}
        color={Colors.darkGreyed}
      />
    );

    if (this.state.password && this.state.password2) {
      next = (
        <NavNextButton
          onPress={this.setup.bind(this)}
          title={i18n.t('done')}
          color={Colors.primary}
        />
      );
    }

    if (this.state.inProgress) {
      next = <ActivityIndicator size="small" />;
    }

    return next;
  };

  didChange() {
    // this.props.onSetNavNext(this.getNextButton());
  }

  async setup() {
    try {
      this.setState({ inProgress: true });
      setTimeout(() => this.didChange());

      const { key } = await api.post('api/v2/messenger/keys/setup', {
        password: this.state.password,
        download: true,
      });
      this.props.messengerList.setPrivateKey(key);

      this.setState({ inProgress: false });
      setTimeout(() => this.didChange());

      this.props.onNext();
    } catch (err) {
      this.setState({ inProgress: false });
      setTimeout(() => this.didChange());

      alert(err.message);
    }

    this.setState({ inProgress: false });
  }

  render() {
    return (
      <View>
        <Text style={style.h1}>{i18n.t('messenger.messenger')}</Text>

        <Text style={style.p}>{i18n.t('messenger.onboardingText')}</Text>

        <View style={[CommonStyle.flexContainer, CommonStyle.padding2x]}>
          <View style={{ flexDirection: 'row', alignItems: 'stretch' }}>
            <TextInput
              ref="password"
              editable={!this.state.inProgress}
              style={[ComponentsStyle.passwordinput, { flex: 1 }]}
              underlineColorAndroid="transparent"
              placeholder={i18n.t('auth.password')}
              secureTextEntry={true}
              onChangeText={(password) => {
                this.setState({ password });
                this.props.onSetNavNext(this.getNextButton());
              }}
            />
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'stretch',
              marginTop: 16,
            }}>
            <TextInput
              ref="password2"
              editable={!this.state.inProgress}
              style={[ComponentsStyle.passwordinput, { flex: 1 }]}
              underlineColorAndroid="transparent"
              placeholder={i18n.t('auth.confirmpassword')}
              secureTextEntry={true}
              onChangeText={(password2) => {
                this.setState({ password2 });
                this.props.onSetNavNext(this.getNextButton());
              }}
            />
          </View>
        </View>
      </View>
    );
  }
}

const style = StyleSheet.create(stylesheet);
