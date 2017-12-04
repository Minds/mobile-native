import React, {
  PureComponent
} from 'react';

import {
  TextInput,
  View,
  StyleSheet,
  Platform
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

/**
 * Search Component
 */
export default class SearchView extends PureComponent {
  render() {
    const {
      ...attributes
    } = this.props;
    return (
      <View style={styles.container}>
        <Icon size={16} style={styles.icon} name={'md-search'} color={'#444'} />
        <TextInput
          {...attributes}
          underlineColorAndroid={
            'transparent'
          }
          style={styles.input}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderBottomColor: '#000',
    borderTopColor: '#000',
    backgroundColor: '#FFF',
  },
  icon: {
    backgroundColor: 'transparent',
    position: 'absolute',
    paddingLeft: 10,
    top: 15.5,
    ...Platform.select({
      android: {
        top: 20,
      },
    }),
  },
  input: {
    paddingLeft: 30,
    paddingRight: 19,
    margin: 8,
    overflow: 'hidden',
    backgroundColor: 'transparent',
    fontSize: 14,
    color: '#444',
    height: 40,
    ...Platform.select({
      ios: {
        height: 30,
      },
      android: {
        borderWidth: 0,
      },
    }),
  }
});