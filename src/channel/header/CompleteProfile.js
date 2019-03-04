import React, {
  Component
} from 'react';

import {
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import * as Progress from 'react-native-progress';

import { CommonStyle as CS } from '../../styles/Common';
import colors from '../../styles/Colors';
import navigationService from '../../navigation/NavigationService';

/**
 * Complete Profile
 */
export default class CompleteProfile extends Component {

  /**
   * Render
   */
  render() {

    return (
      <TouchableOpacity style={[CS.padding2x]} onPress={() => navigationService.push('OnboardingScreen')}>
        <View>
          <Progress.Bar progress={this.props.progress} width={null} color={colors.greyed} />
          <Text style={[CS.fontS, CS.paddingTop2x, CS.textCenter, CS.colorMedium]}>You have completed <Text style={CS.bold}>{Math.round(this.props.progress * 100)}%</Text> of your profile </Text>
        </View>
      </TouchableOpacity>
    );
  }
}
