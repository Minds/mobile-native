import React, {
  Component
} from 'react';

import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  ActivityIndicator
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import McIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Divider } from 'react-native-elements'

import { CommonStyle } from '../styles/Common';
import colors from '../styles/Colors';
import { Button } from 'react-native-elements';
import Toolbar from '../common/components/toolbar/Toolbar';

export default class BoostScreen extends Component {

  state = {
    type: 'newsfeeds',
    payment: 'points',
    amount: '2500'
  }

  /**
   * Modal navigation
   */
  static navigationOptions = ({ navigation }) => ({
    header: (
      <View style={[CommonStyle.backgroundLight, CommonStyle.rowJustifyStart]}>
        <Text style={[styles.titleText, CommonStyle.flexContainer, CommonStyle.padding2x]}>Boost</Text>
        <Icon size={36} name="ios-close" onPress={() => navigation.goBack()} style={{ selfAlign: 'flex-end', padding: 10}} />
      </View>
    ),
    transitionConfig: {
      isModal: true
    }
  });

  changeInput = (amount) => {
    this.setState({ amount });
  }

  changeType = (type) => {
    this.setState({type});
  }

  changePayment = (payment) => {
    this.setState({ payment });
  }

  formatDolars() {
    return '$'+this.state.amount/1000;
  }

  getDetailText() {
    if (this.state.type == 'newsfeeds') {
      return 'Your content will appear on newsfeeds across the site.';
    } else {
      return 'Your content will be shared to a specific channel in exchange for USD or points.'
    }
  }

  render() {
    const typeOptions = [
      { text: 'NEWSFEEDS', icon: 'list', value: 'newsfeeds' },
      { text: 'CHANNELS', icon: 'ios-people', iconType: 'ion', value: 'channels' }
    ];

    const payOptions = [
      { text: this.formatDolars()+'\nUS DOLARS', icon: 'attach-money', value: 'usd' },
      { text: this.state.amount+'\nPOINTS', icon: 'lightbulb-outline', value: 'points' }
    ];

    const detailText = this.getDetailText();

    return (
      <ScrollView style={[CommonStyle.flexContainer, CommonStyle.backgroundLight, CommonStyle.padding2x]}>

        <Text style={styles.subtitleText} numberOfLines={2}>BOOST TYPE</Text>
        <Toolbar options={typeOptions} initial={this.state.type} onChange={this.changeType} disableBorder={true}/>
        <Text style={[CommonStyle.fontS, styles.centered]}>{detailText}</Text>
        <Divider style={[CommonStyle.marginTop3x, CommonStyle.marginBottom3x]}/>
        <Text style={styles.subtitleText}>HOW MANY VIEWS DO YOU WANT?</Text>
        <View style={[CommonStyle.rowJustifyStart, CommonStyle.alignCenter]}>
          <TextInput ref="input" onChangeText={this.changeInput} style={styles.input} underlineColorAndroid="transparent" value={this.state.amount} keyboardType="numeric" />
          <Text style={[CommonStyle.fontXXL, CommonStyle.paddingLeft2x]}>Views</Text>
        </View>
        <Divider style={[CommonStyle.marginTop3x, CommonStyle.marginBottom3x]} />
        <Text style={styles.subtitleText}>PAYMEN METHOD</Text>
        <Toolbar options={payOptions} initial={this.state.payment} onChange={this.changePayment} disableBorder={true}/>
        <Divider style={[CommonStyle.marginTop3x, CommonStyle.marginBottom3x]} />
        <Text style={styles.subtitleText}>TARGET</Text>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  titleText: {
    fontSize: 28
  },
  subtitleText: {
    fontSize: 16,
    textAlign: 'center'
  },
  centered: {
    textAlign: 'center'
  },
  input: {
    fontSize: 50,
    color: '#666',
    width: '50%',
    borderBottomWidth:2,
    paddingVertical: 0,
    borderBottomColor: colors.primary,
    textAlign: 'right',
  },
});
