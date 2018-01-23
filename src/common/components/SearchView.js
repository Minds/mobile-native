import React, {
  PureComponent
} from 'react';

import {
  TextInput,
  View,
  StyleSheet,
  Platform,
  TouchableOpacity
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

/**
 * Search Component
 */
export default class SearchView extends PureComponent {

  /**
   * Render
   */
  render() {
    const {
      iconRight,
      iconRightOnPress,
      ...attributes
    } = this.props;

    let rIcon = this.getRightIcon(iconRight, iconRightOnPress);

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
        {rIcon}
      </View>
    );
  }

  /**
   * Get right icon or null
   * @param {string} iconRight
   * @param {function} iconRightOnPress
   */
  getRightIcon(iconRight, iconRightOnPress) {
    if (iconRight) {
      if (iconRightOnPress) {
        return (
          <TouchableOpacity style={[styles.icon, styles.iconRight]} onPress={iconRightOnPress}>
            <Icon size={16} name={iconRight} color={'#444'} />
          </TouchableOpacity>
        )
      } else {
        return <Icon size={16} style={[styles.icon, styles.iconRight]} name={iconRight} color={'#444'} />
      }
    }
    return null;
  }
}

const styles = StyleSheet.create({
  container: {
    borderBottomColor: '#000',
    borderTopColor: '#000',
    backgroundColor: '#FFF',
    //height:50,
    padding: 8,
  },
  iconRight: {
    right:0,
    paddingRight: 10,
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
    marginLeft: 8,
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