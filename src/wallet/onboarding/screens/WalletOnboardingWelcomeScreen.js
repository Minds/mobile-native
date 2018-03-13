import React, {
  Component
} from 'react';

import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';

import TransparentButton from '../../../common/components/TransparentButton';
import NavNextButton from '../../../common/components/NavNextButton';

import Colors from '../../../styles/Colors';

import stylesheet from '../stylesheet';
export default class WalletOnboardingWelcomeScreen extends Component {
  componentDidMount() {
    this.props.onSetNavNext(this.getNextButton());
  }

  getNextButton = () => {
    return (
      <NavNextButton
        onPress={this.props.onNext}
        title="NEXT"
        color={Colors.primary}
      />
    );
  }

  render() {
    return (
      <View>
        <Text style={style.h1}>Welcome to your wallet</Text>

        <Text style={style.p}>
          Tokens are the cryptocurrency used on Minds. Your total balance
          of tokens will be stored in two different types of addresses.
        </Text>

        <View style={style.rows}>
          <View style={[style.row, style.rowFirst]}>
            <Icon style={style.loneIcon} name="check-circle" size={40} />
            <Text style={style.h2}>OnChain</Text>

            <Text style={style.legend}>
              OnChain payments will be published to
              the public blockchain and require a small
              ETH gas fee. You can setup your own
              private keys or create new wallets.
            </Text>
          </View>

          <View style={style.row}>
            <Icon style={style.loneIcon} name="donut-large" size={40} />
            <Text style={style.h2}>OffChain</Text>

            <Text style={style.legend}>
              OffChain payments will not be published
              to the blockchain and have spending
              limits. You will receive rewards into this
              address.
            </Text>
          </View>
        </View>
      </View>
    );
  }
}

const style = StyleSheet.create(stylesheet);
