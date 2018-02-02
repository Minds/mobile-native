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
import ContributionsView from './ContributionsView';
import Toolbar from '../../common/components/toolbar/Toolbar';
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
    const hash = this.props.user.me.phone_number_hash;

    return (
      <View style={[CommonStyle.flexContainer, CommonStyle.backgroundWhite]}>
        { hash ? <ContributionsView/> : <JoinView /> }
      </View>
    )
  }

  onChange = (value) => {
    this.setState({
      option: value
    })
  }

}
