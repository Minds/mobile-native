import React, {
  Component
} from 'react';

import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

import TransparentButton from '../../../common/components/TransparentButton';
import NavNextButton from '../../../common/components/NavNextButton';

import Colors from '../../../styles/Colors';

import stylesheet from '../../../onboarding/stylesheet';

export default class WalletOnboardingFinishedScreen extends Component {
  componentDidMount() {
    this.props.onSetNavNext(this.getNextButton());
  }

  getNextButton = () => {
    return (
      <NavNextButton
        onPress={this.props.onNext}
        title="CONTINUE"
        color={Colors.primary}
      />
    );
  }

  render() {
    return (
      <View>
        <Text style={style.h1}>You're all setup and ready to go!</Text>

        <Text style={style.p}>
          Great, you have successfully configured your wallet to receive
          rewards and OnChain & OffChain payments.
        </Text>

        <Text style={style.p}>
          To learn more about tokens and crypto, visit
          the <Text style={style.b}>Tokens 101</Text> section below at
          any time where you can find tutorials, videos
          and a FAQ.
        </Text>

        <View style={style.vertButtonBar}>
          <TransparentButton
            style={style.vertButton}
            onPress={() => {}}
            title="MORE ON REWARDS"
            color={Colors.darkGreyed}
          />

          <TransparentButton
            style={style.vertButton}
            onPress={() => {}}
            title="LEARN ABOUT WIRE"
            color={Colors.darkGreyed}
          />

          <TransparentButton
            style={style.vertButton}
            onPress={() => {}}
            title="LEARN ABOUT BOOST"
            color={Colors.darkGreyed}
          />
        </View>
      </View>
    );
  }
}

const style = StyleSheet.create(stylesheet);
