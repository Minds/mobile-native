//import 'abortcontroller-polyfill/dist/polyfill-patch-fetch'
import './global';
import './shim'
//import crypto from "crypto"; // DO NOT REMOVE!

import React, {
  Component
} from 'react';

import {
  createStackNavigator,
  NavigationActions
} from 'react-navigation';

import {
  BackHandler,
  Platform,
  AppState,
  Linking,
  Text,
  Alert,
  View,
} from 'react-native';

import NavigationStack from './src/navigation/NavigationStack';
import NavigationService from './src/navigation/NavigationService';

const Stack = createStackNavigator({});

/**
 * App
 */
export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      appState: AppState.currentState
    };
  }

  /**
   * Handle app state changes
   */
  handleAppStateChange = (nextState) => {
    // if the app turns active we check for shared
    if (this.state.appState.match(/inactive|background/) && nextState === 'active') {
      receiveShare.handle();
    }
    this.setState({appState: nextState})
  }

  /**
   * On component will mount
   */
  componentWillMount() {
    if (!Text.defaultProps) Text.defaultProps = {};
    Text.defaultProps.style = {
      fontFamily: 'Roboto',
      color: '#444',
    };
  }

  /**
   * Render
   */
  render() {
    const app = (
      <View></View>
    );

    return [ app ];
  }
}
