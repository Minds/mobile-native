//@ts-nocheck
import React, { Component } from 'react';

import { observer } from 'mobx-react';
import { StyleSheet } from 'react-native';

import { Icon } from 'react-native-elements';
import settingsStore from '../settings/SettingsStore';

@observer
export default class CaptureFab extends Component {
  /**
   * Nav to activity full screen
   */
  navToCapture = () => {
    this.props.navigation.push('Capture', {
      group: this.props.group,
      parentKey: this.props.route.key,
    });
  };

  render() {
    return (
      <Icon
        raised
        reverse
        name="md-create"
        type="ionicon"
        color="#4690DF"
        size={28}
        containerStyle={
          settingsStore.leftHanded ? styles.leftSide : styles.rightSide
        }
        onPress={() => this.navToCapture()}
        testID={this.props.testID}
      />
    );
  }
}

const styles = StyleSheet.create({
  rightSide: {
    position: 'absolute',
    // backgroundColor:'#4690DF',
    bottom: 8,
    zIndex: 1000,
    right: 8,
  },
  leftSide: {
    position: 'absolute',
    // backgroundColor:'#4690DF',
    bottom: 8,
    zIndex: 1000,
    left: 8,
  },
});
