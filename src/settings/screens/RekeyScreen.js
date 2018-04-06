import React, {
  Component,
} from 'react';
import {Alert} from 'react-native';

import MessengerSetup from '../../messenger/MessengerSetup';

/**
 * Messenger re key screen
 */
export default class RekeyScreen extends Component {

  /**
   * On done
   */
  onDone = () => {
    Alert.alert('Keys regenerated successfully!');
    this.props.navigation.goBack();
  }

  /**
   * Render
   */
  render() {
    return <MessengerSetup rekey={true} onDone={this.onDone}/>
  }
}