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
} from 'mobx-react/native'

import { CommonStyle } from '../../styles/Common';
import JoinView from './JoinView';
import RewardsView from './RewardsView';

/**
 * Token and Rewards Screen
 */
@inject('user')
@observer
export default class TokensRewardsScreen extends Component {

  static navigationOptions = {
    title: 'Tokens & Rewards'
  }

  /**
   * Render
   */
  render() {
    const hash = this.props.user.me.phone_number_hash;

    const body = this.getBody(hash);

    return (
      <View style={[CommonStyle.flexContainer, CommonStyle.backgroundWhite, CommonStyle.padding2x]}>
        {body}
      </View>
    )
  }

  /**
   * Get body
   * @param {string} hash
   */
  getBody(hash) {
    if (true) {
      return (
        <RewardsView/>
      )
    } else {
      return (
        <JoinView />
      )
    }
  }
}