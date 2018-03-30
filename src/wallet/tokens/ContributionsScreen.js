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
import ContributionsView from './contributions/ContributionsView';

/**
 * Token and Rewards Screen
 */
@inject('user')
@observer
export default class ContributionsScreen extends Component {

  static navigationOptions = {
    title: 'Contributions'
  }

  /**
   * Render
   */
  render() {
    return (
      <View style={[CommonStyle.flexContainer, CommonStyle.backgroundWhite]}>
        {this.props.user.me.rewards ? <ContributionsView/> : <JoinView /> }
      </View>
    )
  }

  onChange = (value) => {
    this.setState({
      option: value
    })
  }

}
