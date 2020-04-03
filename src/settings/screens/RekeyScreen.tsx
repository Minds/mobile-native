//@ts-nocheck
import React, {
  Component,
} from 'react';
import {Alert} from 'react-native';

import MessengerSetup from '../../messenger/MessengerSetup';
import i18n from '../../common/services/i18n.service';

/**
 * Messenger re key screen
 */
export default class RekeyScreen extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      headerRight: navigation.state.params && navigation.state.params.headerRight,
    }
  };

  /**
   * On done
   */
  onDone = () => {
    Alert.alert(i18n.t('settings.keyGenerated'));
    this.props.navigation.goBack();
  }

  /**
   * Render
   */
  render() {
    return <MessengerSetup rekey={true} onDone={this.onDone} navigation={this.props.navigation}/>
  }
}