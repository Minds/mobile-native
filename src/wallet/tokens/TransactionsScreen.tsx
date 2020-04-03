//@ts-nocheck
import React, {
  Component
} from 'react';

import {
  Text,
  ScrollView,
  View,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import {
  observer,
  inject
} from 'mobx-react'

import { CommonStyle } from '../../styles/Common';
import TransactionsList from './TransactionsList';

/**
 * Token and Rewards Screen
 */
@inject('user')
@observer
export default class TokensRewardsScreen extends Component {

  static navigationOptions = {
    title: 'Transactions'
  }

  /**
   * Render
   */
  render() {
    return (
      <View style={[CommonStyle.flexContainer, CommonStyle.backgroundWhite]}>
        <TransactionsList/>
      </View>
    )
  }

  onChange = (value) => {
    this.setState({
      option: value
    })
  }

}
