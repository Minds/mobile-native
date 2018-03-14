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

import api from './../common/services/api.service';

import PhoneInput from 'react-native-phone-input'

import Icon from 'react-native-vector-icons/MaterialIcons';

import TransparentButton from '../common/components/TransparentButton';
import NavNextButton from '../common/components/NavNextButton';

import Colors from '../styles/Colors';
import { CommonStyle } from '../styles/Common';
import { ComponentsStyle } from '../styles/Components';
import stylesheet from '../onboarding/stylesheet';

@inject('messengerList')
@observer  
export default class MessengerOnboardingScreen extends Component {

  state = {
    inProgress: false,
    password: null,
    password2: null,
    inProgress: false
  }

  componentDidMount() {
    this.props.onSetNavNext(this.getNextButton());
  }

  getNextButton = () => {
    let next = (
      <NavNextButton
        onPress={this.props.onNext}
        title="SKIP"
        color={Colors.darkGreyed}
      />
    );

    if (this.state.password && this.state.password2) {
      next = (
        <NavNextButton
          onPress={this.setup.bind(this)}
          title="Done"
          color={Colors.primary}
        />
      );
    }

    if (this.state.inProgress) {
      next = (
        <ActivityIndicator size='small' />
      );
    }

    return next;
  }

  async setup() {
    try {
      this.setState({ inProgress: true });
      const { key } = await api.post('api/v2/keys/setup', { password: this.state.password, download: true });
      this.props.messengerList.setPrivateKey(key);
      this.props.onNext();
    } catch (err) {
      alert(err.message);
    }

    this.setState({ inProgress: false });
  }

  render() {
    return (
      <View>
        <Text style={style.h1}>Messenger</Text>

        <Text style={style.p}>
          An additional password is required for messenger in order to ensure that your messages 
          are private and fully encrypted.
        </Text>

        <View style={[CommonStyle.flexContainer, CommonStyle.padding2x]}>
          <View style={{ flexDirection: 'row', alignItems: 'stretch' }}>
            <TextInput
              ref='password'
              style={ [ ComponentsStyle.passwordinput, { flex: 1 } ]}
              editable={true}
              underlineColorAndroid='transparent'
              placeholder='Password'
              secureTextEntry={true}
              onChangeText={(password) => {
                this.setState({password});
                this.props.onSetNavNext(this.getNextButton());
              }}
            />
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'stretch', marginTop: 16 }}>
            <TextInput
              ref='password2'
              style={ [ ComponentsStyle.passwordinput, { flex: 1 } ]}
              editable={true}
              underlineColorAndroid='transparent'
              placeholder='Confirm password'
              secureTextEntry={true}
              onChangeText={(password2) => {
                this.setState({password2});
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
