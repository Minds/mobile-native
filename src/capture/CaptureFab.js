import React, { Component } from 'react';

import {
  observer,
} from 'mobx-react/native'

import {
  View,
  StyleSheet
} from 'react-native';

import { Icon } from 'react-native-elements'
import testID from '../common/helpers/testID';
import settingsService from '../settings/SettingsService'
import settingsStore from '../settings/SettingsStore'
import featuresService from '../common/services/features.service';

@observer
export default class CaptureFab extends Component {

  /**
   * Nav to activity full screen
   */
  navToCapture = () => {
    const { state } = this.props.navigation
    this.props.navigation.navigate('Capture', {group: this.props.group, parentKey: state.key});
  }

  render() {
    if (featuresService.has('navigation-2020')) {
      return null;
    }
    
    return (
      <Icon
        raised
        reverse
        name="md-create"
        type='ionicon'
        color='#4690DF'
        size={28}
        containerStyle={ settingsStore.leftHanded ? styles.leftSide : styles.rightSide }
        onPress={() => this.navToCapture()}
        testID={this.props.testID}
        />

    );
  }
}

const styles = StyleSheet.create({
  rightSide: {
    position:'absolute',
    // backgroundColor:'#4690DF',
    bottom:8,
    zIndex:1000,
    right:8
  },
  leftSide: {
    position:'absolute',
    // backgroundColor:'#4690DF',
    bottom:8,
    zIndex:1000,
    left:8
  }
});
