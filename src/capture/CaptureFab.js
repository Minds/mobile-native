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

@observer
export default class CaptureFab extends Component {
  
  /**
   * Nav to activity full screen
   */
  navToCapture = () => {
    const { state } = this.props.navigation
    this.props.navigation.navigate('Capture', {group: this.props.group, parentKey: state.key});
  }
  
  constructor(props){
    super(props);
  }

  componentDidMount(){
    settingsStore.init();
  }

  render() {
    return (
      <Icon
        raised
        name="md-create"
        type='ionicon'
        color='#fff'
        size={32}
        containerStyle={ settingsStore.leftHandedActive ? styles.leftSide : styles.rightSide }
        onPress={() => this.navToCapture()}
        {...testID('CaptureButton')}
        />
      
    );
  }
}

const styles = StyleSheet.create({
  rightSide: {
    position:'absolute',
    backgroundColor:'#4690DF',
    width:55,
    height:55,
    bottom:8,
    zIndex:1000,
    right:8
  },
  leftSide: {
    position:'absolute',
    backgroundColor:'#4690DF',
    width:55,
    height:55,
    bottom:8,
    zIndex:1000,
    left:8
  }
});
