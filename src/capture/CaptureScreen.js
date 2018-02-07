import React, {
    Component
} from 'react';

import {
    StyleSheet,
    ActivityIndicator,
    InteractionManager,
    Image,
    View,
} from 'react-native';

import { NavigationActions } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';

import CapturePoster from './CapturePoster';
import CaptureGallery from './CaptureGallery';

/**
 * Capture screen
 */
export default class CaptureScreen extends Component {

  state = {
    disabled: true
  }

  static navigationOptions = {
    tabBarIcon: ({ tintColor }) => (
      <Icon name="md-radio-button-on" size={24} color={tintColor} />
    )
  }

  /**
   * Render
   */
  render() {

    if (this.state.disabled) {
      InteractionManager.runAfterInteractions(() => {
        setTimeout(() => {
          this.setState({disabled: false});
        }, 100);
      });
    }

    return (
      <View style={styles.screenWrapper}>
        <CapturePoster style={{ flex: 1, backgroundColor: '#FFF' }} onComplete={ (entity) => this.onComplete(entity) }/>
      </View>
    );
  }

  onComplete(entity) {
    const dispatch = NavigationActions.navigate({
      routeName: 'Tabs',
      params: {
        prepend: entity,
      },
      actions: [
        NavigationActions.navigate({
          routeName: 'Newsfeed',
        })
      ]
    })

    this.props.navigation.dispatch(dispatch);
  }

}

const styles = StyleSheet.create({
	screenWrapper: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#FFF',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#ccc'
  },
  selectedImage: {
    flex: 1
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 40
  },
  submitButton: {
    position: 'absolute',
    top:15,
    right:30,
    zIndex:100
  }
});